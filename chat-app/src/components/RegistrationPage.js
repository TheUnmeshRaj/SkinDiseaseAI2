import React , {useState , useEffect} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import './FormStyle.css'
function RegistrationPage() {
  const [username , setUsername] = useState('') 
  const [emailId , setEmailId] = useState('')
  const [password , setPassword] = useState('')
  const changeUser =(e)=>{
    setUsername(e.target.value)
  }
  const changeEmail =(e)=>{
    setEmailId(e.target.value)
  }
  const changePass =(e)=>{
    setPassword(e.target.value)
  }
  const sendData = ()=>{
    axios.post('http://localhost:3002/Register',{username,emailId,password})
    .then((response)=>{
      const result = response.data
      console.log(result.message)
    })
    .catch((error)=>{
      console.log(error)
    })
  }
  return (
    <div className = 'reg-box'>
      <div className='cover-box'>
      <h1 className='reg-hed'>SIGN UP </h1>
      <input type = "text" value = {username}  onChange={changeUser} placeholder='Enter your username '
      className='reg-user'/>
      <input type = "text" value = {emailId}  onChange={changeEmail} placeholder='Enter your email Id '
      className='reg-email'/>
      <input type = "password" value = {password}  onChange={changePass} placeholder='Enter your password '
      className='reg-pass'/>
      <button onClick={sendData}
      className='reg-button'>
        Register
      </button>
      <div>
        <p> or </p>
      </div>
      <Link to="/Login">
      <button
      className='reg-login'>
        Go To Sign In  Page
      </button>
      </Link>
      </div>
    </div>
  )
}

export default RegistrationPage
