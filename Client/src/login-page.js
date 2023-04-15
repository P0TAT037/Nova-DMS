import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ onSignupClick }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleusernameChange = (event) => {
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
        var loginrespone = JSON.parse(xhttp.responseText);
        document.getElementById("here").innerHTML=loginrespone.name
        var token = loginrespone.token
        localStorage.setItem('token', token);
        navigate(`/home/1`)
        }
    };
        xhttp.open("GET", `https://localhost:7052/api/user?username=`+username +`&password=` + password, true);
        xhttp.send();
    
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="username" value={username} onChange={handleusernameChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      <br />
      <button onClick={onSignupClick}>Sign Up</button>
      <div id="here"></div>
    </div>
  );
}

function SignupPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleusernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handlenameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
        var loginrespone = JSON.parse(xhttp.responseText);
        }
    };
        xhttp.open("POST", 'https://localhost:7052/api/user?name='+name+'&username='+username+'&password='+password, true);
        xhttp.send();
  };

  return (
    <div>
      <h1>Signup Page</h1>
      <form onSubmit={handleSubmit}>
      <label>
          Name:
          <input type="name" value={name} onChange={handlenameChange} />
        </label>
        <br />
        <label>
          Username:
          <input type="name" value={username} onChange={handleusernameChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <div id="here"></div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

function Loginpage() {
  const [showSignup, setShowSignup] = useState(false);

  const handleSignupClick = () => {
    setShowSignup(true);
  };

  return (
    <div>
      {showSignup ? (
        <SignupPage />
      ) : (
        <LoginPage onSignupClick={handleSignupClick} />
      )}
    </div>
  );
}

export default Loginpage;