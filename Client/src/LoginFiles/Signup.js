import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import data from "../Endpoint-url.json"

function SignupPage({ onLoginClick }) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const handleNameChange = (event) => {
      setName(event.target.value);
    };
  
    const handleUsernameChange = (event) => {
      setUsername(event.target.value);
    };
  
    const handlePasswordChange = (event) => {
      setPassword(event.target.value);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          document.getElementById("login conformation").innerHTML="Sign Up is successful, please log in to use your account"
        }
        else if (this.readyState === 4 && this.status === 400){
          document.getElementById("login conformation").innerHTML="This account is already used, please type in a different account."
        }
      };
      xhttp.open("POST", process.env.REACT_APP_ENDPOINT_URL + `auth/signup?name=${name}&username=${username}&password=${password}`, true);
      xhttp.send();
    };
  
    return (
      <div className='container-fluid login-container'>
    <div className='row row-signup'>
    
      <div className='col-sm-10 col-md-10 col-10 m-5'>
      <button onClick={onLoginClick} style={{width: "7vw" , position: "absolute" , marginTop:"1vh" , marginLeft:"-1.2vw"}} className="pop-back">Back</button>
      <p className='p-login' style={{fontSize: 32 , textAlign : "center"}}>Signup</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
            </div>
            <input style={{borderRadius:"10px"}} type="text" className="form-control" placeholder="Name" aria-label="Name" aria-describedby="basic-addon1" value={name} onChange={handleNameChange} />
          </div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
            </div>
            <input style={{borderRadius:"10px"}} type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon2" value={username} onChange={handleUsernameChange} />
          </div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
            </div>
            <input style={{borderRadius:"10px"}} type="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon3" value={password} onChange={handlePasswordChange} />
          </div>
          <button  type="submit" className="btn-login">SignUp</button>
        </form>
        <br />
        <div id="login conformation"></div>
        
      </div>
    </div>
    
  </div>
    );
  }
export {SignupPage};