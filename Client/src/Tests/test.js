import { useState } from "react";
import { Searchbyfilters } from "../Home-functions/Searchbyfilters";
import data from '../Endpoint-url.json';

const usersArray = [];
function Test(info){
    const [permusers,setPermusers] = useState([]);
    const [allusers,setAllusers] = useState([]);
    function send(){
   //https://localhost:7052/user/getFileUsers?usrId=0&FileId=5
    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                setPermusers(JSON.parse(xhttp.responseText))
                
            }
        }
        xhttp.open("GET", data.url + `user/getFileUsers?usrId=0&FileId=12`, true);
        xhttp.setRequestHeader("Authorization", `Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAiLCJ1c2VybmFtZSI6ImFkbWluIiwibGV2ZWwiOiIyIiwicm9sZXMiOiIiLCJleHAiOjE2ODQ2MzI2NjR9.4Yw4dspiQ5AxB5eD3rqGOYBe0I3Q9-VUZIjyVK8B5mc`);
        xhttp.send();
        var xhttp2 = new XMLHttpRequest();
        xhttp2.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                setAllusers(JSON.parse(xhttp2.responseText))
                
            }
        }
        xhttp2.open("GET", data.url + `user/all`, true);
        xhttp2.setRequestHeader("Authorization", `Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAiLCJ1c2VybmFtZSI6ImFkbWluIiwibGV2ZWwiOiIyIiwicm9sZXMiOiIiLCJleHAiOjE2ODQ2MzI2NjR9.4Yw4dspiQ5AxB5eD3rqGOYBe0I3Q9-VUZIjyVK8B5mc`);
        xhttp2.send();
        
    }
    for (let i =0; i < allusers.length; i++){
        console.log(allusers[i].user.id)
        console.log(allusers[i].user.name)
        console.log(permusers[i].perm)
        usersArray.push({
            id: allusers[i].user.id,
            name: allusers[i].user.name,
            PERM: permusers[i].perm,
            Roles: allusers[i].roles
          });
    }
    return(
        console.log(usersArray),
        <>
        <button onClick={() => send()}>bruh</button>
        </>
        
    );
            }
export default Test;