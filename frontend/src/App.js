import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/artworks/').then(response => response.json())
                                .then(data => setData(data));
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>Artworks</div>
        {data.map(object => {
            return <div>{object.title} by {object.author} - <a href={object.url}>WGA</a></div>
        })}
      </header>
    </div>
  );
}

export default App;
