import { useState } from "react";
import data from "../Endpoint-url.json"
function ManageAdmins(info){
    const [ispressed,setIspressed] = useState(false);
    const [addpressed,setAddpressed] = useState(false);
    const [users,setUsers] = useState([{roles:[], user:{}}])
    const [exit,setExit] = useState("")
    function handlebuttonclick(){
        setExit("");
        setIspressed(true);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                setUsers(JSON.parse(xhttp.responseText));
            }
        }
        xhttp.open("GET", data.url + `user/all`, true);
        xhttp.setRequestHeader("Authorization", `Bearer ${info.token}`);
        xhttp.send();
        
    }
    function removeuser(userid){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                alert("User Yeeted from admin");
            }
        }
        xhttp.open("DELETE",data.url +`user/admin?usrId=${userid}`, false);
        xhttp.setRequestHeader("Authorization", `Bearer ${info.token}`);
        xhttp.send();
    }
    function adduser(userid){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                alert("User added to admin");
            }
        }
        xhttp.open("PUT",data.url + `user/admin?usrId=${userid}`, false);
        xhttp.setRequestHeader("Authorization", `Bearer ${info.token}`);
        xhttp.send();
    }
    function handleexitclick(){
        setExit("exit");
      setTimeout(function() {
        setIspressed(false);
      }, 350);
    }
    
    return(
        <div>
            <button className="mangeadmin-button" onClick={handlebuttonclick}></button>
            {ispressed !== false &&(
                <>  {
                addpressed !== true &&(
                    <div className={`div-popup${exit} z-index-2`} style={{top: "-70vh", overflowY: "auto"}}>
                        <button  className="btn-popup-close" onClick={() => {handleexitclick() ;setAddpressed(false)}}>X</button>
                        <p>Admins of this system:</p>
                        <br></br>
                        {users.map((user) => (
                            user.user.level === 1 &&(
                                
                            <div key={user.user.id}>
                            <br></br>
                                {user.user.username}
                            <button  className="btn-popup-close" onClick={() => {removeuser(user.user.id); handlebuttonclick()}}>Remove</button>
                            </div>
                        )))
                            }
                        <button style={{position:"relative"}} onClick={() => setAddpressed(true)}>Add Users</button></div>
                )
            }
            {addpressed !== false &&(
                <div className="div-popup z-index-2" style={{top: "-70vh", overflowY: "auto"}}>
                <button onClick={() => setAddpressed(false)}>Back</button>
                <button  className="btn-popup-close" onClick={() => {handleexitclick() ;setAddpressed(false)}}>X</button>
                <br></br>
                    Add Admins
                {users.map((user) => (
                            user.user.level < 1 &&(
                            <div key={user.user.id}>
                            <br></br>
                            {user.user.username}
                            <button  className="btn-popup-close" onClick={() => {adduser(user.user.id); handlebuttonclick()}}>Add</button>
                            </div>
                        )))
                            }
                </div>
            )}
            </>    
                    
        )}
        
        </div>
        
    );
            }
export {ManageAdmins}
