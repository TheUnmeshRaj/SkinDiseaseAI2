import React from 'react'
import InstaLogo from './images/1000_F_298315933_FdK3b8wCs7EhYWlJqieSvmSgTOr9MSfR(2).png'
import GoogleLogo from './images/Google__G__logo.svg.png'
import GithubLogoLight from "./images/GitHub-Mark-ea2971cee799 (2).png"
import LinkdinLogo from "./images/sm_5b321c9756fc6.png"
import GithubLogoDark from './images/github-logo-git-hub-icon-with-text-on-white-and-black-background-free-vector-Dark.jpg'
import HeaderFile from './HeaderFile'
function SocialMedia(props) {
    const RenderLogo =({Mode})=>{
        if(Mode === 'Light'){
          return <img src={GithubLogoLight} alt = 'GithubLogoLight'
          className='github-logo'/>
        }
        else{
          return <img src={GithubLogoDark} alt = 'GithubLogoDark'
          className='github-logo-dark'/>
        }
      }
  return (
    <>
       <div className="icons">
        <a href="https://www.linkedin.com/in/adithya-sakthimani-0459a7281/"
        target='_blank' className={`linkdin-${props.Theme}`}>
        <img src={LinkdinLogo} alt = 'LINKDINLogo'
          className='linkdin-logo'/>
        </a>
        <a href="https://github.com/AdithyaSakthimani"
        target='_blank'
        className={`github-${props.Theme}`}>
          <RenderLogo  Mode = {props.Theme}/>
        </a>
        <a href="https://www.instagram.com/adithya_sakthimani/profilecard/?igsh=b3Vhc3pna25oY3hk"
        target='_blank'
        className={`instagram-${props.Theme}`}>
          <img src={InstaLogo} alt = 'InstaLogo'
          className='insta-logo'/></a>
        <a href="mailto:adithyasakthimani@gmail.com"
        target='_blank'
        className={`gmail-${props.Theme}`}>
          <img src={GoogleLogo} alt = 'GoogleLogo'
          className='google-logo'/>
        </a>
        </div>
    </>
  )
}

export default SocialMedia
