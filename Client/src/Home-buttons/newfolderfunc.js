import { useState } from "react";
import data from "../Endpoint-url.json"
function Newfolderfunc(info){
    const [ispressed,setIspressed] = useState(false);
    const [exit,setExit] = useState("")
    var location = info.location
    function handlebuttonclick(){
        setExit("");
        setIspressed(true);
    }
    function handleexitclick(){
      setExit("exit");
      setTimeout(function() {
        setIspressed(false);
      }, 350);
    }
    function handlefoldersubmit(){
        var foldername = document.getElementById("folder-name").value
        var folderdesc = document.getElementById("folder-desc").value
        var foldercontent = document.getElementById("folder-content").value
        
        const endpoint = data.url + 'node';
        const headers = {
          'accept': '*/*',
          'Authorization': `Bearer ${info.token}`,
        };
        
        const formData = new FormData();
        formData.append('Dir', `${location[location.length-1].hid}`);
        formData.append('Name', `${foldername}`);
        formData.append('Description', `${folderdesc}`);
        formData.append('Type', 'folder');
        formData.append('Content', `${foldercontent}`);
        formData.append('DefaultPerm', 'true');
        formData.append('file', ``);
        fetch(endpoint, {
          method: 'POST',
          headers: headers,
          body: formData
        })
       
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
        alert("Folder Created.")
        info.onComplete();
        setIspressed(false);
    }
    
    return(
        
        <div>
            <button className="newfol-button" style={{position: "absolute" ,top: "10.3vh", overflowY:"auto"}} title="New Folder" onClick={handlebuttonclick}>F</button>
            {ispressed !== false &&(
            <div className={`div-popup${exit} z-index-2`}>
                <div className="div-popup-title">
                 <span style={{fontSize:"1.4rem" , marginLeft:"1.3vw"}}> Create New Folder</span>
                <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
                </div>
                
                <div style={{marginTop: "1vh"}}><span className="pop-span">Folder Name: </span><input className="pop-input" id ="folder-name" type="text" ></input></div>
                <div><span className="pop-span">Description: </span><input className="pop-input" id="folder-desc" type="text" ></input></div>
                <span className="pop-span"> Content: </span>
                <br></br>
                <textarea className="pop-textarea" id="folder-content" type="text"></textarea>
                <br></br>
                <span className="pop-span">This folder will be created in: </span>
                
                {location.map((folder) => (
                    
                    folder.name + "/"  
                    
                ))
                }
                <br></br>
                <button onClick={handlefoldersubmit} className="pop-button" style={{marginLeft: "17.3vw"}}>Create Folder</button>
            </div>
        )}
        </div>
        
    );
}

export default Newfolderfunc;