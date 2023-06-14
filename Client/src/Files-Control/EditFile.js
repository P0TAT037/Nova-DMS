import { useState } from "react";
import { getCurrentTime } from "../Home-functions/getTime";
import data from "../Endpoint-url.json"
function EditFile(props){
    const [ispressed,setIspressed] = useState(false);
    var file;
    const formData = new FormData();
    function handlebuttonclick(){
        setIspressed(true);
    }
    function handleexitclick(){
        setIspressed(false);
    }
    function handleFileChange(event) {
        file = event.target.files[0];
        document.getElementById("update-file-name").value=file.name;
        console.log(file);
    }
    function updatefile(){
        var filename = document.getElementById("update-file-name").value
        var desc = document.getElementById("update-file-desc").value
        var content = document.getElementById("update-file-content").value
        let time = getCurrentTime();
        const endpoint = data.url +`node?id=${props.metadata.id}`;
        const headers = {
          'accept': '*/*',
          'Authorization': `Bearer ${props.token}`,
        };

        formData.append('EditedBy', `${props.userinfo.username}`);
        formData.append('Created', `${props.metadata.created}`);
        formData.append('Author', `${props.metadata.author}`);
        formData.append('Name', `${filename}`);
        formData.append('Version', `1`);
        formData.append('Content', `${content}`);
        formData.append('Type', `${file.type}`);
        formData.append('Updated', `${time}`);
        formData.append('Id', `${props.metadata.id}`);
        formData.append('Description', `${desc}`);
        formData.append("file", file);
        fetch(endpoint, {
            method: 'PUT',
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
            alert("File Updated.")
            props.onUpdate();
            console.log(data);
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
          console.log(formData);
    }
    
    return(
        <div>
            <button onClick={handlebuttonclick}>Edit</button>
            {ispressed !== false &&(
            <div className="div-popup z-index-2" >
                <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
                Updated File:
                <input type="file" onChange={handleFileChange}></input>
                <br></br>
                New File Name: <input id ="update-file-name" type="text"></input>
                <br></br>
                New Description: <input id="update-file-desc" type="text"></input>
                <br></br>
                New Content: <input id="update-file-content" type="text"></input>
                <br></br>
                <button onClick={() => updatefile()}>Update</button>
            </div>
        )}
        </div>
        
    );
            }
export {EditFile};