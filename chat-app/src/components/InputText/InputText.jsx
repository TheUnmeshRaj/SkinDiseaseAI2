import React, { useState, useContext } from 'react';
import '../TextStyle.css';
import './InputText.css';
import axios from 'axios';
import NoteContext from '../NoteContext';
import magnifyingGlass from '../images/searchIcon.png';

const headingTxt = "Welcome to our Skin Disease Detection AI";
const InitialText = "Your reliable companion for skin health! Our advanced AI tool uses cutting-edge technology to accurately identify and classify a wide range of skin conditions. Whether you're concerned about a new spot, rash, or other issues, our system provides quick and reliable insights, helping you stay informed and proactive about your skin health.";

function InputText(props) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('Enter some Query');
  const [heading, setHeading] = useState(headingTxt);
  const [loading, setLoading] = useState(false);
  const [explainPara, setExplainPara] = useState(InitialText);
  const { userId } = useContext(NoteContext);
  const { mainRes, setMainRes } = useContext(NoteContext);
  const currUserId = userId;

  const fetchRes = () => {
    const data = { inputText };
    axios.post("http://127.0.0.1:5000/api/TextAi", data)
      .then((response) => {
        const result = response.data;
        const dataPack = { 
          query: inputText, 
          res: result.result, 
          desc: result.treatment,
          doctors: result.doctors || []  // Add doctors' info to the result
        };
        setMainRes((prevMainRes) => [...prevMainRes, dataPack]);
        setOutputText(''); 
      })
      .catch((error) => {
        setOutputText('Error fetching result');
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const storeRes = () => {
    const data = { mainRes, currUserId };
    axios.post("http://localhost:3002", data)
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((err) => {
        console.log("Error storing data:", err);
      });
  };

  const handleClick = () => {
    if (inputText === '') {
      setHeading('Please Enter Your Symptoms');
      setExplainPara('');
    } else {
      setLoading(true);
      setOutputText('Fetching Result'); 
      fetchRes(); 
      storeRes();
      setInputText('');
    }
  };

  const changeTxt = (e) => {
    setInputText(e.target.value);
  };

  const renderFunc = () => {
    if (mainRes.length === 0) {
      return (
        <>
          <h1 className="hed-ini">{heading}</h1>
          <p className="explain-ini">{explainPara}</p>
        </>
      );
    }
    return mainRes.map((item, index) => (
      <React.Fragment key={index}>
        <div className="query-box">
          <p className="query">{item.query}</p>
        </div>
        <div className="res-desc-box">
          <h1 className="res">{`RESULT: ${item.res.toUpperCase()}`}</h1>
          <p className="treatment">{item.desc}</p>
        </div>
        {item.doctors.length > 0 && (
          <div className="doctor-details">
            <h2>Recommended Doctors</h2>
            {item.doctors.map((doctor, docIndex) => (
              <div key={docIndex} className="doctor-card">
                <h3>{doctor.name}</h3>
                <p><strong>Qualifications:</strong> {doctor.qualifications}</p>
                <p><strong>Clinics:</strong> {doctor.clinics}</p>
                <a href={doctor.link} target="_blank" rel="noopener noreferrer" className="doctor-link">View Profile</a>
              </div>
            ))}
          </div>
        )}
      </React.Fragment>
    ));
  };

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
        <button onClick={handleClick} disabled={loading} className="search-button">
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
