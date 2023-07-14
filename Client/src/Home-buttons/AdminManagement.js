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
                console.log(users);
            }
        }
        xhttp.open("GET", process.env.REACT_APP_ENDPOINT_URL + `user/all`, true);
        xhttp.setRequestHeader("Authorization", `Bearer ${info.token}`);
        xhttp.send();
        
    }
    function removeuser(userid){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                alert("User Deleted from admin");
            }
        }
        xhttp.open("DELETE",process.env.REACT_APP_ENDPOINT_URL +`user/admin?usrId=${userid}`, false);
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
        xhttp.open("PUT",process.env.REACT_APP_ENDPOINT_URL + `user/admin?usrId=${userid}`, false);
        xhttp.setRequestHeader("Authorization", `Bearer ${info.token}`);
        xhttp.send();
    }
    function handleexitclick(){
        setExit("exit");
      setTimeout(function() {
        setAddpressed(false);
        setIspressed(false);
      }, 350);
    }
    
    return(
        <div>
            <button className="mangeadmin-button" onClick={handlebuttonclick}></button>
            {ispressed !== false &&(
                <>  {
                addpressed !== true &&(
                    <div className={`div-popup${exit} z-index-2`} style={{top: "18vh" , marginLeft: "3vw"}}>
                       <div className="div-popup-title">
                        <span style={{fontSize:"1.4rem" , marginLeft:"1.3vw"}}> Admin Management</span>
                        <button  className="btn-popup-close" onClick={() =>  handleexitclick()}>X</button>
                        </div>
                            <>
                            <span className="pop-span">Admins of this system:</span>
                            {users.map((user) => (
                            user.user.level === 1 &&(
                                
                            <div className="pop-row" key={user.user.id}>
                                <span className="pop-span">{user.user.username}</span>
                            <button  className="pop-deletebutton" onClick={() => {removeuser(user.user.id); handlebuttonclick()}}></button>
                            </div>
                        )))
                            }
                            </>
                        <button style={{position:"relative", marginTop: "3vh", marginLeft: "18vw"}} className="pop-button" onClick={() => setAddpressed(true)}>Add Users</button></div>
                )
            }
            {addpressed !== false &&(
                <div className={`div-popup${exit} z-index-2`} style={{ overflowY: "auto"}}>
                    <div className="div-popup-title">
                        <span style={{fontSize:"1.4rem" , marginLeft:"1.3vw"}}> Admin Management</span>
                        <button  className="btn-popup-close" onClick={() =>  handleexitclick()}>X</button>
                        </div>
                <button className="pop-back" onClick={() => setAddpressed(false)}>Back</button>
                <span className="pop-span">Add Admins:</span>
                {users.map((user) => (
                            user.user.level < 1 &&(
                            <div className="pop-row" style={{marginTop: "2vh"}} key={user.user.id}>
                            {user.user.username}
                            <button style={{fontSize: "1.2rem" ,width: "5vw" , float: "right", height: "4.6vh"}} className="pop-button" onClick={() => {adduser(user.user.id); handlebuttonclick()}}>Add</button>
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
