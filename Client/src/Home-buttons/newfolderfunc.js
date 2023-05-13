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
    }
    function testfile(){
      var foldername = document.getElementById("folder-name").value
        var folderdesc = document.getElementById("folder-desc").value
        var foldercontent = document.getElementById("folder-content").value
      const formData = new FormData();
        formData.append('Dir', `${location[location.length-1].hid}`);
        formData.append('Name', `${foldername}`);
        formData.append('Description', `${folderdesc}`);
        formData.append('Type', 'folder');
        formData.append('Content', `${foldercontent}`);
        formData.append('DefaultPerm', '');
        formData.append('file', ``);
        for (var pair of formData.entries()) {
          console.log(pair[0]+ ': ' + pair[1]); 
      }
    }
    return(
        
        <div>
            <button onClick={handlebuttonclick}>F</button>
            {ispressed !== false &&(
            <div className="div-popup z-index-2">
                <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
                File Name: <input id ="folder-name" type="text"></input>
                <br></br>
                Description: <input id="folder-desc" type="text"></input>
                <br></br>
                Content: <input id="folder-content" type="text"></input>
                <br></br>
                this folder will be created in:
                <br></br>
                
                {location.map((folder) => (
                    
                    folder.name + "/ "  
                    
                ))
                }
                <br></br>
                <button onClick={handlefoldersubmit}>Create Folder</button>
                <button onClick={testfile}>Test file</button>
            </div>
        )}
        </div>
        
    );
}

export default Newfolderfunc;