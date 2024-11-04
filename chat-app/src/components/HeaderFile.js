import React from 'react'
import './TextStyle.css'
import {Link,useNavigate} from 'react-router-dom'
function HeaderFile(props) {
  const navigate = useNavigate();

  const handleClick = (event) => {
    event.preventDefault(); 
    navigate('/'); 
    window.location.reload(); 
  };
  return (
      <Link to ="/" className='header-lnk' onClick={handleClick}>
      <h1 className={`header-txt-${props.mode}`}> AI SKIN DOCTOR  </h1>
      </Link>
  )
}

export default HeaderFile
