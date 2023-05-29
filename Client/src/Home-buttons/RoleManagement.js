import { useState } from "react";
import data from "../Endpoint-url.json"
function ManageRoles(props){
    const [ispressed,setIspressed] = useState(false);
    const [users,setUsers] = useState([]);
    const [userstoadd, setUserstoadd] =useState([]);
    const [roles,setRoles] = useState([]);
    const [currentrole,setCurrentrole] = useState();
    const [currentstate,setCurrentstate] = useState(0); //change this goofy ahh name
    function handlebuttonclick(){
        setIspressed(true);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                setRoles(JSON.parse(xhttp.responseText));
                
            }
        }
        xhttp.open("GET",data.url + `role`, true);
        xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp.send();
    }
    function Refresh(){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                setRoles(JSON.parse(xhttp.responseText));
            }
        }
        xhttp.open("GET",data.url + `role`, true);
        xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp.send();
    }
    function Addrole(){
        var rolename = document.getElementById("role-name").value
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                alert("role added")
            }
        }
        xhttp.open("POST",data.url + `role?name=${rolename}`, true);
        xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp.send();
    }
    function removerole(roleid){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                alert("role deleted")
            }
        }
        xhttp.open("DELETE",data.url + `role?id=${roleid}`, true);
        xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp.send();

    }
    function showusers(){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                setUserstoadd(JSON.parse(xhttp.responseText));
            }
        }
        xhttp.open("GET", data.url + `user/all`, true);
        xhttp.send();
    }
    function adduser(userid){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                alert("user added to role")
            }
        }
        xhttp.open("PUT", data.url + `user?usrId=${userid}&roleId=${currentrole}`, true);
        xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp.send();
    }
    function deleteuser(userid){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                alert("user deleted from role")
            }
        }
        xhttp.open("DELETE", data.url + `user?usrId=${userid}&roleId=${currentrole}`, true);
        xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp.send();
    }
    function handleexitclick(){
        setIspressed(false);
    }
    
    return(
        <div>
            <button className="mangeroles-button" title="Mange Roles" onClick={handlebuttonclick}></button>
            {ispressed !== false &&(
            <div className="div-popup z-index-2" style={{top: "-70vh"}}>
                <button  className="btn-popup-close" onClick={() => {setCurrentstate(0) ; handleexitclick()}}>X</button>
                {/* Show current roles */}
                {currentstate === 0 &&(
                    <div>
                        Roles on this system
                        {roles.map((role)=>(
                            <div key={role.id} ><button onClick={() => {setCurrentstate(2); setUsers(role.users); setCurrentrole(role.id);}}>{role.name}</button>
                            <button onClick={() => {removerole(role.id); Refresh()}}>Remove</button>
                            </div>
                        ))}
                        <button style={{position:"relative", bottom:"-5vh"}} onClick={() => setCurrentstate(1)}>Add New role</button>
                    </div>
                )}
                {/* Create Role */}
                {
                   currentstate === 1 &&(
                    <div>
                        <button onClick={() => setCurrentstate(0)}>Back</button>
                        What would you like to name this role?
                        <br></br>
                        <input id="role-name" type="text"></input>
                        <br></br>
                        <button onClick={() => {Addrole();  Refresh(); setCurrentstate(0);}}>Add</button>
                    </div>
                ) 
                }
                {/* Show Role users */}
                {
                   currentstate === 2 &&(
                    <div>
                        <button onClick={() => setCurrentstate(0)}>Back</button>
                        Users on this role:
                        <br></br>
                        {users.map((user) => (
                            <div key={user.id}>{user.name}
                            <button onClick={() => deleteuser(user.id)}>Remove user</button> 
                            </div>))}
                        <button onClick={() => {setCurrentstate(3); showusers()} }>Add users</button>
                    </div>
                ) 
                }
                {/* Add users to role */}
                {
                    currentstate === 3 &&(
                        <>
                        <button onClick={() => setCurrentstate(2)}>Back</button>
                        <div>
                            users on this system:
                            <br></br>
                        {userstoadd.map((user) => (
                            
                                <div key={user.user.id}>{user.user.name} {/* dont forget, you can't add a user twice, fix this*/}
                                <button onClick={() => adduser(user.user.id)}>Add user</button> 
                            </div>
                            ))}
                        </div>
                        </>
                    )
                }
            </div>
        )}
        </div>
        
    );
            }
export {ManageRoles}