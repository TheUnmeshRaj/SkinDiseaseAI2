import React , {useState} from 'react'
import './TextStyle.css'
function SideBar({changeBar}) {
  return (
    <div className='left-box'>
     <div>
      <button onClick ={changeBar}>
          openBar
      </button>
      </div>
    </div>
  )
}

export default SideBar
