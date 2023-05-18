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
    console.log(props.userinfo);
    function handleFileChange(event) {
        file = event.target.files[0];
        document.getElementById("upload-file-name").value=file.name;
        formData.append("file", file);
        console.log(file.type);
    }
    function updatefile(){
        var filename = document.getElementById("update-file-name").value
        var desc = document.getElementById("update-file-desc").value
        var content = document.getElementById("update-file-content").value
        const endpoint = data.url +'node';
        const headers = {
          'accept': '*/*',
          'Authorization': `Bearer ${props.token}`,
        };

        console.log(formData,filename,desc,content);
        formData.append('Dir', ``);
        formData.append('Name', `${filename}`);
        formData.append('Description', `${desc}`);
        formData.append('Type', `${file.type}`);
        formData.append('Content', `${content}`);
        formData.append('DefaultPerm', 'true');
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
          alert("File Created.")
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