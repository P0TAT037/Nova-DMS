import { useState } from "react";
import { useEffect } from "react";
import data from "../Endpoint-url.json"
function FilePermissions(props){
    const [ispressed,setIspressed] = useState(false);
    const [permusers,setPermusers] = useState([{}]);
    const [mergedarray,setMergedarray] = useState([{}]);
    var xhttp = new XMLHttpRequest();
    function handlebuttonclick(){
        setIspressed(true);

    }
    function handleexitclick(){
        setIspressed(false);
    }
    useEffect(() => {
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                setPermusers(JSON.parse(xhttp.responseText));
                console.log(permusers);
                const updatedUsers = props.allusers.map((userObj) => {
                    const permissionObj = permusers.find((perm) => perm.user_ID === userObj.user.id);
                    return {
                      ...userObj.user,
                      roles: userObj.roles,
                      perm: permissionObj ? permissionObj.perm : "",
                    };
                    
                  });
                  setMergedarray(updatedUsers);
            }
        }
       xhttp.open("GET", data.url + `user/getFileUsers?FileId=${props.id}`, false);
        xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp.send()
        
    
      }, [ispressed]);

      function ChangePerm(userid){
        var newperm = document.getElementById(`${userid}`).value;
        var xhttp2 = new XMLHttpRequest();
        xhttp2.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                alert("ميه ميه يا باشا")
                
            }
        }
       xhttp2.open("GET", data.url + `user/changePerm?usrId=${userid}&FileId=${props.id}&perm=${newperm}`, true);
        xhttp2.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp2.send();
        }
      
    return(
        <div>
            <button onClick={handlebuttonclick}>Edit Permissions</button>
            {ispressed !== false &&(
            <div className="div-popup z-index-2" >
                <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
                <div>
                {mergedarray.map((item)=>(
                    item.level < 1 &&(<div key={item.id}>
                        {item.name}
                        <select id={item.id} defaultValue={`${item.perm}`}>
                          <option value="true">Read and Write</option>
                          <option value="false">Read only</option>
                          <option value="">Only User</option>
                          </select>
                          <button onClick={()=> ChangePerm(item.id)}>Change</button>
                        </div>
                    )
                ))}
                </div>
            </div>
        )}
        </div>
        
    );
            }
export {FilePermissions};