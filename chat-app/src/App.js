import React , {useEffect,useState}from 'react' ; 
import './App.css';
import InputText from './components/InputText';
import HeaderFile from './components/HeaderFile';
import SocialMedia from './components/SocialMedia';
import  './components/HeaderStyle.css';
import {Link} from 'react-router-dom'
function App() {
  const [mode , setMode] = useState('Light')
  const bodyElement = document.body;
  useEffect(() => {
    if (mode === 'Dark') {
      document.body.style.backgroundColor = 'gray';
    } else {
      document.body.style.backgroundColor = 'lightgray';
    }
  }, [mode]);
  const changeMode =()=>{
    setMode((prev)=>{
      if(prev === 'Light'){
        bodyElement.style.backgroundColor = 'blue';
        return 'Dark'
      }
      else{
        bodyElement.style.backgroundColor ='lightgray';
        return 'Light'
      }
    })
  }
  return (
    <div className={`App-${mode}`}>
      <div className = {`social-media-${mode}`}>
      <div className='right-items'>
      <SocialMedia Theme = {mode}/>
      </div>
      <div className='center-items'>
      <HeaderFile mode = {mode}/>
      </div>
      <div className='left-items'>
      <button className={`mode-${mode}`} onClick ={changeMode}></button>
      <Link to = "/Login">
      <button className='app-login' >
        login
      </button>
      </Link>
      </div>
      </div>
     <InputText mode = {mode}/>
    </div>
  );
}

export default App;
