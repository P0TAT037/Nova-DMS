import { useState } from "react";
import data from "../Endpoint-url.json"
function ManageRoles(props){
    const [ispressed,setIspressed] = useState(false);
    const [users,setUsers] = useState([]);
    const [userstoadd, setUserstoadd] =useState([]);
    const [roles,setRoles] = useState([]);
    const [currentstate,setCurrentstate] = useState(0); //change this goofy ahh name
    function handlebuttonclick(){
        setIspressed(true);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                setRoles(JSON.parse(xhttp.responseText));
                console.log(roles)
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
                console.log(roles)
            }
        }
        xhttp.open("GET",data.url + `role`, true);
        xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp.send();
    }
    function Addrole(){
        var rolename = document.getElementById("role-name").value
        console.log(rolename);
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
    function removerole(name){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                alert("role deleted")
            }
        }
        xhttp.open("DELETE",data.url + `role?name=${name}`, true);
        xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp.send();

    }
    function addusers(){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                setUserstoadd(JSON.parse(xhttp.responseText));
            }
        }
        xhttp.open("GET", data.url + `user/all`, true);
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
                        {roles.map((role)=>(
                            <div key={role.id} onClick={() => {setCurrentstate(2); setUsers(role.users)}}>{role.name}
                            <button onClick={() => {removerole(role.name); Refresh()}}>Remove</button>
                            </div>
                        ))}
                        <button style={{position:"relative", bottom:"-5vh"}} onClick={() => setCurrentstate(1)}>Add New role</button>
                    </div>
                )}
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
                {
                   currentstate === 2 &&(
                    <div>
                        <button onClick={() => setCurrentstate(0)}>Back</button>
                        Users on this role:
                        <br></br>
                        {users.map((user) => (
                            <div>{user.name}
                            <button>Remove user</button> {/*ill leave this here till users appear inside roles */}
                            </div>))}
                        <button onClick={() => {setCurrentstate(3); addusers()} }>Add users</button>
                    </div>
                ) 
                }
                {
                    currentstate === 3 &&(
                        <>
                        <button onClick={() => setCurrentstate(2)}>Back</button>
                        <div>
                            users on this system:
                            <br></br>
                        {userstoadd.map((user) => (
                            <div key={user.id}>{user.name}
                            <button>Add user</button> {/*ill leave this here till users appear inside roles */}
                            </div>))}
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