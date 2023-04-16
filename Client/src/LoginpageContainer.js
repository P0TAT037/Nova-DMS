import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apis from "./API-shortcuts/APIsc.js"

function LoginPage({ onSignupClick }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


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
        var loginrespone = JSON.parse(xhttp.responseText);
        var token = loginrespone.token
        localStorage.setItem('token', token);
        navigate(`/home`)

      }
      else if (this.status === 400){
        document.getElementById("login conformation").innerHTML="Login failed, please make sure you typed your Username and Password correctly."
      }
      else if (this.status === 404){
        document.getElementById("login conformation").innerHTML="An error has occured, client cannot connect to server"
      }
    };
    xhttp.open("GET", `https://localhost:7052/user?username=`+username +`&password=` + password, true);
    xhttp.send();
    
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="username" value={username} onChange={handleUsernameChange} />
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
      <div id="login conformation"></div>
      <button onClick={onSignupClick}>Sign Up</button>
    </div>
  );
}

function SignupPage({ onLoginClick }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
    xhttp.open("POST", 'https://localhost:7052/user?name='+name+'&username='+username+'&password='+password, true);
    xhttp.send();
  };

  return (
    <div>
      <h1>Signup Page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="name" value={name} onChange={handleNameChange} />
        </label>
        <br />
        <label>
          Username:
          <input type="name" value={username} onChange={handleUsernameChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <br />
        <button type="submit">Sign Up</button>
      </form>
      <br />
      <div id="login conformation"></div>
      <button onClick={onLoginClick}>Login</button>
    </div>
  );
}

function LoginPageContainer() {
  const [showSignup, setShowSignup] = useState(false);

  const handleSignupClick = () => {
    setShowSignup(true);
  };

  const handleLoginClick = () => {
    setShowSignup(false);
  };

  return (
    <div>
      {showSignup ? (
        <SignupPage onLoginClick={handleLoginClick} />
      ) : (
        <LoginPage onSignupClick={handleSignupClick} />
      )}
    </div>
  );
}

export default LoginPageContainer;