import './App.css';
import {useEffect, useState} from "react";
import {ArtMap} from "./components/ArtMap";

import { Provider }  from 'react-redux'
import store from './store'

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/artworks/').then(response => response.json())
                                .then(data => setData(data));
  }, [])

  return (
    <Provider store={store}>
        <div className="App">
          <header className="App-header">
            <ArtMap />
          </header>
        </div>
    </Provider>
  );
}

export default App;
