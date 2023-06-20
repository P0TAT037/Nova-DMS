import { useState } from "react";
import { getCurrentTime } from "../Home-functions/getTime"; 
import { truncate } from "../Home-functions/truncation";
import data from "../Endpoint-url.json"
function EditFile(props){
    const [ispressed,setIspressed] = useState(false);
    const [exit,setExit] = useState("")
    var file;
    const formData = new FormData();
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
    function handleFileChange(event) {
        file = event.target.files[0];
        document.getElementById("update-file-name").value=file.name;
        document.getElementById("filename-selected").innerHTML = `You Selected ${truncate(file.name, 45)}` 
        document.getElementById("filename-selected").className = "pop-span-uploaded"
        document.getElementById("upload-file-input").className = "pop-file-uploaded";
        document.getElementById("upload-file-input").innerHTML = "Uploaded"
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
            <div className={`div-popup${exit} z-index-2`} >
              <div className="div-popup-title">
                 <span style={{fontSize:"1.4rem" , marginLeft:"1.3vw"}}> Create a file</span>
                <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
                </div>
                <><label id="upload-file-input" htmlFor="file-update" className="pop-file">Choose File</label></>
                <span id="filename-selected"></span>
                <input type="file" id="file-update" onChange={handleFileChange}></input>
                <br></br>
                <span className="pop-span">New File Name: </span><input className="pop-input" id ="update-file-name" type="text"></input>
                <br></br>
                <span className="pop-span">New Description: </span><input className="pop-input" id="update-file-desc" type="text"></input>
                <br></br>
                <span className="pop-span">New Content:</span> <input className="pop-input" id="update-file-content" type="text"></input>
                <br></br>
                <button style={{marginLeft: "18vw" , marginTop: "3vh"}} className="pop-button" onClick={() => updatefile()}>Update</button>
            </div>
        )}
        </div>
        
    );
            }
export {EditFile};