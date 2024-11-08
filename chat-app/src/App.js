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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const bodyElement = document.body;
  const { userId, setUserId , mainRes,setMainRes } = useContext(NoteContext);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    const currUserId = userId ; 
    localStorage.setItem("id", JSON.stringify(currUserId));
  }, [userId]);
  useEffect(()=>{
    const currRes = mainRes ; 
    localStorage.setItem("res", JSON.stringify(currRes));
  },[mainRes])
  useEffect(() => {
    bodyElement.style.backgroundColor = mode === 'Dark' ? 'gray' : 'lightgray';
  }, [mode]);

  const changeMode = () => {
    setMode((prev) => (prev === 'Light' ? 'Dark' : 'Light'));
  };
  const button = (
    <button className={`app-login-${userId !== '.' ? "LoggedIn" : "Login"}`}
    onClick={userId!== '.' ? toggleDropdown : null}>
{userId !== '.' ? "U" : "Login"}
      </button>
  );
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
            {userId === '.' ? (
        <Link to="/Login">{button}</Link>
      ) : (
        button
      )}
            {userId !== '.' && isDropdownOpen && (
        <div 
          className="dropdown-menu" 
        >
          <button className="dropdown-item" onClick={() => setUserId('.')}>Logout</button>
          <button className="dropdown-item" onClick={() => setMainRes([])}>Clear</button>
        </div>
      )}
          </div>
        </div>
        <InputText mode={mode} />
      </div>
  );
}

export default App;
