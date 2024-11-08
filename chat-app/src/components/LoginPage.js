import React , {useState,useContext} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import './FormStyle.css'
import NoteContext from './NoteContext'
import NoteState from './NoteState'
function LoginPage (){
    const [username , setUsername] = useState('')
    const [password , setPassword] = useState('')
    const userId = useContext(NoteContext);
    const {mainRes , setMainRes} = useContext(NoteContext)
    const changeUser =(e)=>{
        setUsername(e.target.value)
      }
      const changePass =(e)=>{
        setPassword(e.target.value)
      }
      const handleLogin = () => {
        axios.post('http://localhost:3002/Login', { username, password })
            .then((response) => {
                const res = response.data ; 
                console.log(res.message);
                userId.setUserId(
                  res.userId
                )
                setMainRes(
                    res.prevData
                )
            })
            .catch((err) => {
                console.log('Login failed:', err);
            });
    };
    return(
        <div className='log-box'>
            <div className='log-cover-box'>
            <h1 className='log-hed'>SIGN IN </h1>
            <input type = "text" value = {username}  onChange={changeUser} placeholder='Enter your username or email Id '
            className='log-user'/>
            <input type = "password" value = {password}  onChange={changePass} placeholder='Enter your password '
            className='log-pass'/>
            <button onClick={handleLogin}
            className='log-button'>Login</button>
            <div>
                or 
            </div>
            <Link to="/Register">
            <button
            className='log-reg'>Go To Registration Page</button>
            </Link>
            </div>
        </div>
    )
}

export default LoginPage