import React from 'react';
import { useState } from "react";

function Login(){
        function loginclick(){
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
        var loginrespone = JSON.parse(xhttp.responseText);
        document.getElementById("here").innerHTML="Welcome, " + loginrespone.name
        }
    };
        xhttp.open("GET", `https://localhost:7052/api/user?username=`+username +`&password=` + password, true);
        xhttp.send();
        }
        function signup(){
            return(
                <div>AAAAAAAAA</div>
            )
        }
    
    return(
        <body className="body-login">
        
        <div className="container">
            
             <div className="login-bg">
            <div className="row">
                <div className="col"><input id='username' placeholder='username here...'></input></div>
            </div>
            <div className="row">
                <div className="col"><input id='password' placeholder='password here...'></input></div>
            </div>
            <div className="row">
                <div className="col"><button id='Login-btn' onClick={loginclick}>Login</button>
                <button id='Login-btn' onClick={() => signup()}>Signup</button></div>
            </div>
            
            <div id="here">
            </div>
        </div>
        
        </div>
        </body>
    );
}

export default Login;