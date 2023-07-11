// for this piece of shit component to suppoert refershing, i need to rewrite its entire logic..... i hate this job
import { useState } from "react";
import data from "../Endpoint-url.json"
function ManageRoles(props){
    const [ispressed,setIspressed] = useState(false);
    const [users,setUsers] = useState([]);
    const [userstoadd, setUserstoadd] =useState([]);
    const [roles,setRoles] = useState([]);
    const [currentrole,setCurrentrole] = useState();
    const [currentrolename, setCurrentrolename] = useState("");
    const [currentstate,setCurrentstate] = useState(0); 
    const [exit,setExit] = useState("")
    function handlebuttonclick(){
        setExit("");
        setIspressed(true);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                setRoles(JSON.parse(xhttp.responseText));
            }
        }
        xhttp.open("GET",process.env.REACT_APP_ENDPOINT_URL + `role`, true);
        xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp.send();
    }
    const Refresh = () =>{
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                setRoles(JSON.parse(xhttp.responseText));
                showRoleusers(currentrole)
               
            }
        }
        xhttp.open("GET",process.env.REACT_APP_ENDPOINT_URL + `role`, false);
        xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp.send();
    }
    function Addrole(){
        var rolename = document.getElementById("role-name").value
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                alert("role added")
                Refresh(); 
                setCurrentstate(0);
            }
        }
        xhttp.open("POST",process.env.REACT_APP_ENDPOINT_URL + `role?name=${rolename}`, true);
        xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp.send();
    }
    function removerole(roleid){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                alert("role deleted")
                Refresh(); 
            }
        }
        xhttp.open("DELETE",process.env.REACT_APP_ENDPOINT_URL + `role?id=${roleid}`, true);
        xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp.send();

    }
    function showRoleusers(roleid){
        const found = roles.find(element => element.id === roleid);
        setUsers(found.users);
        console.log(users)
    }
    function showusers(){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                setUserstoadd(JSON.parse(xhttp.responseText));
                console.log(userstoadd)
            }
        }
        xhttp.open("GET", process.env.REACT_APP_ENDPOINT_URL + `user/all`, true);
        xhttp.send();
    }
    function adduser(userid){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                Refresh();
                alert("user added to role");
                setCurrentstate(0); //PIECE OF SHIT 
            }
        }
        xhttp.open("PUT", process.env.REACT_APP_ENDPOINT_URL + `user?usrId=${userid}&roleId=${currentrole}`, true);
        xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp.send();
    }
    function deleteuser(userid){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                Refresh();
                alert("user deleted from role");
                setCurrentstate(0); //FUCK YOU JAVASCRIPT
            }
        }
        xhttp.open("DELETE", process.env.REACT_APP_ENDPOINT_URL + `user?usrId=${userid}&roleId=${currentrole}`, true);
        xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp.send();
    }
    function handleexitclick(){
        setExit("exit");
      setTimeout(function() {
        setCurrentstate(0);
        setIspressed(false);
      }, 350);
    }
    
    return(
        <div>
            <button className="mangeroles-button" title="Mange Roles" onClick={handlebuttonclick}></button>
            {ispressed !== false &&(
            <div className={`div-popup${exit} z-index-2`} style={{top: "18vh" , marginLeft: "3vw"}}>
                <div className="div-popup-title">
                 <span style={{fontSize:"1.4rem" , marginLeft:"1.3vw"}}> Role Management</span>
                <button  className="btn-popup-close" onClick={() =>  handleexitclick()}>X</button>
                </div>
                {/* Show current roles */}
                {currentstate === 0 &&(
                    <div>
                        {roles.map((role)=>(
                            <div key={role.id} className="pop-row"><button className="pop-rowbutton" style={{textAlign: "left"}} onClick={() => {setCurrentstate(2);  setCurrentrole(role.id); showRoleusers(role.id); setCurrentrolename(role.name)}}><span>{role.name} </span><span style={{marginLeft: "2vw"}}>Total Users: {role.users.length}</span></button>
                            
                            {console.log(role)}
                            <button className="pop-deletebutton" onClick={() => {removerole(role.id); Refresh()}}></button>
                            <br></br>
                            </div>
                        ))}
                        <button className="pop-button" style={{position:"relative", bottom:"-5vh" ,marginLeft:"18vw"}} onClick={() => setCurrentstate(1)}>Add New role</button>
                    </div>
                )}
                {/* Create Role */}
                {
                   currentstate === 1 &&(
                    <div>
                        <button className="pop-back" onClick={() => setCurrentstate(0)}>Back</button>
                        <span className="pop-span">What would you like to name this role?</span>
                        <br></br>
                        <input id="role-name" className="pop-input" type="text" style={{marginLeft:"5vw",width: "40vw",animation: "slowappear 0.25s ease-in-out"}}></input>
                        <br></br>
                        <button className="pop-button" style={{position:"relative", bottom:"-2vh" ,marginLeft:"18vw", animation: "slowappear 0.25s ease-in-out"}} onClick={() => Addrole()}>Add</button>
                    </div>
                ) 
                }
                {/* Show Role users */}
                {
                   currentstate === 2 &&(
                    <div>
                        <button className="pop-back" onClick={() => setCurrentstate(0)}>Back</button>
                        <span className="pop-span">Users on {currentrolename}:</span>
                        <br></br>
                        {users.map((user) => (
                            <div className="pop-row" key={user.id}><span className="pop-span">{user.name} </span>{user.level > 0 &&(
                                <span style={{color: "black"}}>(is an admin)</span>
                            )}
                            <button  className="pop-deletebutton" onClick={() => { deleteuser(user.id);}}></button> 
                            </div>))}
                            <br></br>
                        <button style={{marginLeft: "18vw"}} className="pop-button" onClick={() => {setCurrentstate(3); showusers()} }>Add users</button>
                    </div>
                ) 
                }
                {/* Add users to role */}
                {
                    currentstate === 3 &&(
                        <>
                        <button className="pop-back" onClick={() => setCurrentstate(2)}>Back</button>
                        <span className="pop-span"> Add non-admin users:</span>
                        
                            <br></br>
                        {userstoadd.map((user) => (
                            user.user.level < 1 &&(
                                <>
                                <div className="pop-row" style={{marginTop: "2vh"}} key={user.user.id}>{user.user.name} {/* dont forget, you can't add a user twice, fix this*/}
                                <button style={{fontSize: "1.2rem" ,width: "5vw" , float: "right", height: "4.6vh"}} className="pop-button" onClick={() => adduser(user.user.id)}>Add</button> 
                                </div>
                                </>
                            )
                                
                            
                            
                            ))}
                        
                        </>
                    )
                }
            </div>
        )}
        </div>
        
    );
            }
export {ManageRoles}