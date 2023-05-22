import React, { useState } from 'react';
import { LoginPage } from '../LoginFiles/Login.js';
import { SignupPage } from '../LoginFiles/Signup.js';
function LoginPageContainer() {
  const [showSignup, setShowSignup] = useState(false);
  const [loginrenderd,setLoginrender] = useState(false);

  const handleSignupClick = () => {
    setShowSignup(true);
  };

  const handleLoginClick = () => {
    setShowSignup(false);
  };
  const handleanimationcomplete = (State) => {
    setLoginrender(State);
  }

  return (
    <div>
      {showSignup ? (
        <SignupPage onLoginClick={handleLoginClick} />
      ) : (
        <LoginPage onSignupClick={handleSignupClick} onAnimation={handleanimationcomplete} rendered={loginrenderd} />
      )}
      <div className="wave"></div>
     <div className="wave"></div>
     <div className="wave"></div>
    </div>
  );
}

export default LoginPageContainer;