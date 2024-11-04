import React, { useState,useEffect } from 'react';
import './TextStyle.css';
import magnifyingGlass from './images/istockphoto-1151843591-612x612.png';
import axios from 'axios';

const headingTxt = "Welcome to our Skin Disease Detection AI";
const InitialText = "Your reliable companion for skin health! Our powerful AI tool uses cutting-edge technology to help identify and classify a wide range of skin conditions. Designed to support both healthcare professionals and individuals, our AI provides fast, accurate insights that can make a real difference in early detection and proactive skin care. Easy to use, quick, and highly reliable, we’re here to empower you on your journey to healthier skin.";

function InputText(props) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('Enter some Query');
  const [heading , setHeading] = useState(headingTxt)
  const [loading, setLoading] = useState(false);
  const [explainPara, setExplainPara] = useState(InitialText);
  const [mainRes, setMainRes] = useState([]);

  const click = () => {
    if (inputText === '') {
      setHeading('Please Enter Your Symptoms');
      setExplainPara('');
    } else {
      setLoading(true);
      setOutputText('Fetching Result');
      fetchRes();
      setInputText('')
    }
  };
  const fetchRes = () => {
    const data = { inputText };    
    axios.post("http://127.0.0.1:5000/api/TextAi", data)
      .then((response) => {
        const result = response.data;
        const dataPack = { query: inputText, res: result.result, desc: result.treatment };
        setMainRes(prevMainRes => [...prevMainRes, dataPack]);
      })
      .catch((error) => {
        setOutputText('Error fetching result');
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const changeTxt = (e) => {
    setInputText(e.target.value);
  };
  const renderFunc=()=>{
    if(mainRes.length === 0){
      return(
        <>
       <h1 className="res">
       {heading}
      </h1>
     <p className="treatment">{explainPara}</p>
      </>  )
    }
    return(
    mainRes.map((item, index) => (
      <React.Fragment key={index}>
        <div className='query-box'>
        <p className='query'>{item.query}</p>
        </div>
        <div className='res-desc-box'>
        <h1 className="res">
          {`RESULT: ${item.res.toUpperCase()}`}
        </h1>
        <p className="treatment">{item.desc}</p>
        </div>
      </React.Fragment>
    )))
  }
  return (
    <div className={`body-container-${props.mode}`}>
      <div className="res-box">
        {renderFunc()}
      </div>
      <div className="ip-search">
        <input
          type="text"
          value={inputText}
          onChange={changeTxt}
          placeholder="Enter your query"
          className="ip"
        />
        <button onClick={click} disabled={loading} className="search-button">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            <img src={magnifyingGlass} alt="Search" className="magnifying-glass" />
          )}
        </button>
      </div>
    </div>
  );
}

export default InputText;
