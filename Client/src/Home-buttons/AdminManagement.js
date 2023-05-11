import { useState } from "react";
function ManageAdmins(info){
    const [ispressed,setIspressed] = useState(false);
    const [users,setUsers] = useState([{}])
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
        
        console.log(users)
    }
    function removeuser(userid){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                alert("User Yeeted from admin");
            }
        }
        xhttp.open("DELETE",`https://localhost:7052/user/admin?usrId=${userid}`, false);
        xhttp.setRequestHeader("Authorization", `Bearer ${info.token}`);
        xhttp.send();
    }
    function handleexitclick(){
        setIspressed(false);
    }
    
    return(
        <div>
            <button onClick={handlebuttonclick}>A</button>
            {ispressed !== false &&(
            <div className="div-popup z-index-2" style={{top: "-70vh", overflowY: "auto"}}>
                <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
                Admins of this system:
                <br></br>
                {users.map((user) => (
                    user.level === 1 &&(
                    <div key={user.id}>
                    <br></br>
                    {user.username}
                    <button  className="btn-popup-close" onClick={() => {removeuser(user.id); handlebuttonclick()}}>Remove</button>
                    </div>
                )))
                    }
                <button style={{position:"relative", bottom:"-5vh"}}>Add Users</button>
            </div>
        )}
        
        </div>
        
    );
            }
export {ManageAdmins}
