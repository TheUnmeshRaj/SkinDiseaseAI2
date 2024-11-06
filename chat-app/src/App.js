import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import InputText from './components/InputText';
import HeaderFile from './components/HeaderFile';
import SocialMedia from './components/SocialMedia';
import './components/HeaderStyle.css';
import { Link } from 'react-router-dom';
import SideBar from './components/SideBar';
import NoteState from './components/NoteState';
import NoteContext from './components/NoteContext';

function App() {
  const [mode, setMode] = useState('Light');
  const [loggedIn, setLoggedIn] = useState(false);
  const bodyElement = document.body;
  const userId = useContext(NoteContext);

  useEffect(() => {
    bodyElement.style.backgroundColor = mode === 'Dark' ? 'gray' : 'lightgray';
  }, [mode]);

  const changeMode = () => {
    setMode((prev) => (prev === 'Light' ? 'Dark' : 'Light'));
  };

  return (
      <div className={`App-${mode}`}>
        <div className={`social-media-${mode}`}>
          <div className="right-items">
            <SocialMedia Theme={mode} />
          </div>
          <div className="center-items">
            <HeaderFile mode={mode} />
          </div>
          <div className="left-items">
            <button className={`mode-${mode}`} onClick={changeMode}></button>
            <Link to="/Login">
              <button className="app-login">
                {userId ? "Logged In" : "Login"}
              </button>
            </Link>
          </div>
        </div>
        <InputText mode={mode} />
      </div>
  );
}

export default App;
