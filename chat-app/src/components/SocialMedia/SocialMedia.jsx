import React from 'react';
import InstaLogo from '../images/1000_F_298315933_FdK3b8wCs7EhYWlJqieSvmSgTOr9MSfR(2).png';
import GoogleLogo from '../images/Google__G__logo.svg.png';
import GithubLogoLight from '../images/GitHub-Mark-ea2971cee799 (2).png';
import LinkdinLogo from '../images/sm_5b321c9756fc6.png';
import GithubLogoDark from '../images/github-logo-git-hub-icon-with-text-on-white-and-black-background-free-vector-Dark.jpg';

function SocialMedia({ Theme }) {
  const RenderGithubLogo = () => {
    return Theme === 'Light' ? (
      <img src={GithubLogoLight} alt="Github Logo Light" className="github-logo" />
    ) : (
      <img src={GithubLogoDark} alt="Github Logo Dark" className="github-logo-dark" />
    );
  };

  return (
    <div className="icons">

      {/* GitHub Icon */}
      <a
        href="https://github.com/TheUnmeshRaj/SkinDiseaseAI2"
        target="_blank"
        rel="noopener noreferrer"
        className={`github-icon github-${Theme}`}
      >
        <RenderGithubLogo />
      </a>
    </div>
  );
}

export default SocialMedia;