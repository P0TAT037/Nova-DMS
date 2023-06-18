import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import data from '../Endpoint-url.json';

function LoginPage(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hasRendered, setHasRendered] = useState(false);
  const navigate = useNavigate();
  const onAnimationEnd = () => {
    setHasRendered(true);
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
        var loginrespone = JSON.parse(xhttp.responseText);
        var token = loginrespone.token
        var name= loginrespone.name;
        
        navigate(`/home`,{state: { 
          param1: `${token}`, 
          param2: `${name}`
        }});

      }
      else if (this.status === 400){
        document.getElementById("login conformation").innerHTML="Login failed, please make sure you typed your Username and Password correctly."
      }
      else if (this.status === 404){
        document.getElementById("login conformation").innerHTML="An error has occured, client cannot connect to server"
      }
    };
    xhttp.open("GET", data.url+ `auth/login/?username=`+username +`&password=` + password, true);
    xhttp.send();
    
  };

  return (
    <>
    <img src='.\Nova Logo.png' alt="logo" className={`img-logo${!props.rendered ? '' : 'animated'}`} onAnimationEnd={() => props.onAnimation(true)}></img>
  <div className='container-fluid login-container'>
  <div className={`row row-login${!props.rendered ? '' : 'animated'}`} onAnimationEnd={onAnimationEnd}>
    <div className='col-sm-10 col-md-10 col-10 m-5 '>
      <p className='p-login' style={{fontSize: 32 , textAlign : "center"}}>LOGIN</p>
      <form  onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            
          </div>
          <input style={{borderRadius:"10px"}} type="text" className="form-control login-input-username" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" value={username} onChange={handleUsernameChange} />
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
          </div>
          <input style={{borderRadius:"10px"}} type="password" className="form-control login-input-password" placeholder="Password" aria-label="Password" aria-describedby="basic-addon2" value={password} onChange={handlePasswordChange} />
        </div>
        <button type="submit" className="btn-login">Login</button>
      </form>
      <br />
      <div id="login conformation"></div>
      <p className='p-login'>Don't have an account?</p>
      <button onClick={props.onSignupClick} className="btn-signup">Sign Up</button>
    </div>
  </div>
  
</div>
</>
  );
}

export {LoginPage};