import { useState } from "react";
function ManageRoles(props){
    const [ispressed,setIspressed] = useState(false);
    const [users,setUsers] = useState();
    const [currentstate,setCurrentstate] = useState(0); //change this goofy ahh name
    function handlebuttonclick(){
        setIspressed(true);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                setUsers(JSON.parse(xhttp.responseText));
            }
        }
        xhttp.open("GET",`https://localhost:7052/user/all`, true);
        xhttp.send();
    }
    function handleexitclick(){
        setIspressed(false);
    }
    
    return(
        <div>
            <button onClick={handlebuttonclick}>R</button>
            {ispressed !== false &&(
            <div className="div-popup z-index-2" style={{top: "-70vh"}}>
                <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
                {currentstate === 0 &&(
                    <div>
                        Roles on this system

                        <button style={{position:"relative", bottom:"-5vh"}} onClick={() => setCurrentstate(1)}>Add New role</button>
                    </div>
                )}
                {
                   currentstate === 1 &&(
                    <div>
                        <button onClick={() => setCurrentstate(0)}>Back</button>
                        state 1
                    </div>
                ) 
                }
                {
                   currentstate === 2 &&(
                    <div>
                        <button onClick={() => setCurrentstate(0)}>Back</button>
                        state 2
                    </div>
                ) 
                }
            </div>
        )}
        </div>
        
    );
            }
export {ManageRoles}