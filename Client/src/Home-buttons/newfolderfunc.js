import { useState } from "react";
import data from "../Endpoint-url.json"
function Newfolderfunc(info){
    const [ispressed,setIspressed] = useState(false);
    var location = info.location
    function handlebuttonclick(){
        setIspressed(true);
    }
    function handleexitclick(){
        setIspressed(false);
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
            <div className="div-popup z-index-2">
                <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
                <div>Folder Name: <input className="pop-input" id ="folder-name" type="text"></input></div>
                <div>Description: <input className="pop-input" id="folder-desc" type="text"></input></div>
                Content: 
                <br></br>
                <textarea style={{height:"8vh", width:"34vw", fontSize:"medium",backgroundColor:"#2a2a2a8a"}} id="folder-content" type="text"></textarea>
                <br></br>
                <p>this folder will be created in:</p>
                
                {location.map((folder) => (
                    
                    folder.name + "/ "  
                    
                ))
                }
                <br></br>
                <button onClick={handlefoldersubmit}>Create Folder</button>
            </div>
        )}
        </div>
        
    );
}

export default Newfolderfunc;