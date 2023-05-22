import { useState } from "react";
import data from "../Endpoint-url.json"
function FilePermissions(props){
    const [ispressed,setIspressed] = useState(false);
    var permusers = [{}]
    var allusers = [{}]
    const usersArray = [];
    function handlebuttonclick(){
        setIspressed(true);
        fetch(data.url + `user/getFileUsers?usrId=0&FileId=${props.metadata.id}`, {
            headers: {
              Authorization: `Bearer ${props.token}`
            }
          })
            .then(response => {
              if(response.ok) {
                return response.json();
              }
              throw new Error('Network response was not ok.');
            })
            .then(data => {
              permusers = data
              return fetch(data.url + 'user/all', {
                headers: {
                  Authorization: `Bearer ${props.token}`
                }
              })
                .then(response => response.json())
                .then(data => {
                    allusers = data
                    for (let i =0; i < allusers.length; i++){
                        console.log(allusers[i].user.id)
                        console.log(allusers[i].user.name)
                        usersArray.push({
                            id: allusers[i].user.id,
                            name: allusers[i].user.name,
                            perm: permusers[i].perm,
                            Roles: allusers[i].roles
                          });
                    }
                })
                .catch(error => console.error('Error:', error));
            })
            .catch(error => {
              console.error('There was a problem with the fetch operation:', error);
            });
        
            
        
    }
    
    function ShowPerm(id){
       // console.log(id)
        var perms = document.getElementsByName("perm-"+id)
        //console.log(perms)
        //console.log(usersArray.find(element => element.id = id)) 
        for(let i = 0; i < perms.length; i++) {
            var user = usersArray.find(element => element.id = id)
            if (perms[i].value === usersArray.find(element => element.id = id).perm){
               console.log(perms[i].value)
           }
        }
    }

    function ChangePerm(){

    }
    function handleexitclick(){
        setIspressed(false);
    }
    
    return(
        console.log(allusers,permusers),
        <div>
            <button onClick={handlebuttonclick}>Edit Permissions</button>
            {ispressed !== false &&(
            <div className="div-popup z-index-2" >
                
                <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
                <div>
                {usersArray.map((user) => (
                    <div key={user.id}>{user.name}
                    <div>
                    <input type="radio" id="rw-radio" name={"perm-"+user.id} value="false"></input>
                    <label>Read Only </label>
                    <input type="radio" id="rw-radio" name={"perm-"+user.id} value="true"></input>
                    <label>Read and Write </label>
                    <input type="radio" id="rw-radio" name={"perm-"+user.id} value=""></input>
                    <label>This User Only</label>
                    <button onClick={() => ShowPerm(user.id)}>Ok</button>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        )}
        </div>
        
    );
            }
export {FilePermissions};