import './App.css';
import {useEffect, useState} from "react";
import {ArtMap} from "./components/ArtMap";

import { Provider }  from 'react-redux'
import store from './store'
import {LoginPage} from "./components/LoginPage";
import {CircularProgress} from "@mui/material";

function App() {
  const [data, setData] = useState([]);
  const [auth, setAuth] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [recsLoaded, setRecsLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/artworks/').then(response => response.json())
                                .then(data => setData(data));
    fetch('/api/check_auth/').then(response => response.json()).then(data => {
      if (data) {
        setAuth(data);
        setLoaded(true);
      } else {
        setLoaded(true);
      }
    })
  }, [])

  useEffect(() => {
    if (auth) {
      fetch(`/api/update_user_recommendations/`, {method: "GET"})
          .then(response => response.json())
          .then(() => {
            console.log("happens")
            setRecsLoaded(true);
        }
      );
    }
  }, [auth])

  return (
      <>
      {loaded ? (auth ? (recsLoaded ? <CircularProgress /> : <div className="App">
                  <header className="App-header">
                    <ArtMap />
                  </header>
                </div>) : <LoginPage setAuth={setAuth} />) : null}
      </>
  );
}

export default App;
