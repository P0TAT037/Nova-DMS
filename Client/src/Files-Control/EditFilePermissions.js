import { useState } from "react";
import data from "../Endpoint-url.json"
function FilePermissions(props){
    const [ispressed,setIspressed] = useState(false);
    const [permusers,setPermusers] = useState([]);
    const [allusers,setAllusers] =useState([]);
    const usersArray = [];
    function handlebuttonclick(){
        setIspressed(true);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                setPermusers(JSON.parse(xhttp.responseText))
                
            }
        }
        xhttp.open("GET", data.url + `user/getFileUsers?usrId=0&FileId=12`, true);
        xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp.send()
        var xhttp2 = new XMLHttpRequest();
        xhttp2.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                setAllusers(JSON.parse(xhttp2.responseText))
                
            }
        }
        xhttp2.open("GET", data.url + `user/all`, true);
        xhttp2.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp2.send();
        
    }
    for (let i =0; i < allusers.length; i++){
        usersArray.push({
            id: allusers[i].user.id,
            name: allusers[i].user.name,
            PERM: permusers[i].perm,
            Roles: allusers[i].roles
          });
    }
    function handleexitclick(){
        setIspressed(false);
    }
    
    return(
        console.log(usersArray),
        <div>
            <button onClick={handlebuttonclick}>Edit Permissions</button>
            {ispressed !== false &&(
            <div className="div-popup z-index-2" >
                
                <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
                <div>
                {usersArray.map((user) => (
                    <div>{user.name}
                    </div>
                ))}
                </div>
            </div>
        )}
        </div>
        
    );
            }
export {FilePermissions};