import React, { useState } from 'react';
import { LoginPage } from '../LoginFiles/Login.js';
import { SignupPage } from '../LoginFiles/Signup.js';
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