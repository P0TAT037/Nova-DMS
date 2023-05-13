import { useState } from "react";
import data from "../Endpoint-url.json"
function Uploadfunc(info){
    var file;
    const formData = new FormData();
    const [ispressed,setIspressed] = useState(false);
    var location = info.location
    console.log(location)
    function handlebuttonclick(){
        setIspressed(true);
        //console.log(info.level,info.dir,info.id)
        
    }
    function handleexitclick(){
        setIspressed(false);
    }
    function handleFileChange(event) {
        file = event.target.files[0];
        document.getElementById("upload-file-name").value=file.name;
        formData.append("file", file);
        console.log(file.type);
    }
    function handleuploadclick(){
        var filename = document.getElementById("upload-file-name").value
        var desc = document.getElementById("upload-file-desc").value
        var content = document.getElementById("upload-file-content").value

        const endpoint = data.url +'node';
        const headers = {
          'accept': '*/*',
          'Authorization': `Bearer ${info.token}`,
        };

        console.log(formData,filename,desc,content);
        formData.append('Dir', `${location[location.length-1].hid}`);
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
    //this was used to test the api, but it sends back "bad request"

    

    
    return(
        
        <div>
            <button onClick={handlebuttonclick}>+</button>
            {ispressed !== false &&(
            <div className="div-popup z-index-2">
                <input type="file" onChange={handleFileChange}></input>
                <button className="btn-popup-close" onClick={handleexitclick}>X</button>
                <br></br>
                File Name: <input id ="upload-file-name" type="text"></input>
                <br></br>
                Description: <input id="upload-file-desc" type="text"></input>
                <br></br>
                Content: <input id="upload-file-content" type="text"></input>
                {info.level !== "0" &&(
                    <div>
                    <br></br>
                    <input type="radio" id="write-radio" name="perm" value="false"></input>
                    <label htmlFor="age2">Read Only </label>
                    <br></br>
                    <input type="radio" id="rw-radio" name="perm" value="true"></input>
                    <label htmlFor="age3">Read and Write </label>
                    <br></br>
                    </div>
                )}
                <button onClick={() => handleuploadclick()}>Upload</button>    
                    
            </div>
        )}
        </div>
        
    );
}

export default Uploadfunc;