import { useState } from "react";
import { truncate } from "../Home-functions/truncation";
import { OcrWindow } from "./Ocr";
function Uploadfunc(info){
    var file;
    var defaultperm
    const formData = new FormData();
    const [imagefile, setImagefile] = useState();
    const [ispressed,setIspressed] = useState(false);
    const [isimage,setIsimage] = useState(false);
    const [exit,setExit] = useState("");
    const [ocrclicked, setOcrclicked] = useState(false)
    var location = info.location
    function handlebuttonclick(){
        setExit("");
        setIspressed(true);
    }
    function handleexitclick(){
      setExit("exit");
      setTimeout(function() {
        setIspressed(false);
        setIsimage(false);
      }, 350);
    }
    
    function handleFileChange(event) {
        file = event.target.files[0];
        setImagefile(file);
        document.getElementById("upload-file-name").value=file.name;
        if (file.type.includes("image")){
          setIsimage(true)
        }
        formData.append("file", file);
        document.getElementById("upload-file-input").className = "pop-file-uploaded";
        document.getElementById("upload-file-input").innerHTML = "Uploaded"
        document.getElementById("afterupload").style.opacity= "1"
        document.getElementById("afterupload").style.animation= "onload 0.7s ease-in-out "
        document.getElementById("filename-selected").innerHTML = `You Selected ${truncate(file.name, 45)}` 
        document.getElementById("filename-selected").className = "pop-span-uploaded"
    }
    function handleOcrClick(){
      setOcrclicked(true);
      setIspressed(false);
    }
    function handleOcrClose(){
      setOcrclicked(false);
      setIspressed(true);
    }
    function handleuploadclick(){
        var filename = document.getElementById("upload-file-name").value
        var desc = document.getElementById("upload-file-desc").value
        var content = document.getElementById("upload-file-content").value
        


        defaultperm = document.getElementById("perm").value
        
        const endpoint = process.env.REACT_APP_ENDPOINT_URL +'node';
        const headers = {
          'accept': '*/*',
          'Authorization': `Bearer ${info.token}`,
        };

        formData.append('Dir', `${location[location.length-1].hid}`);
        formData.append('Name', `${filename}`);
        formData.append('Description', `${desc}`);
        formData.append('Type', `${file.type}`);
        formData.append('Content', `${content}`);
        formData.append('DefaultPerm', `${defaultperm}`);
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
          info.onComplete();
          setIspressed(false);
        
    }
    

    

    
    return(
        <>
            <button className="newfile-button" style={{position: "absolute" ,top: "10.3vh"}} onClick={handlebuttonclick} title="Upload File">+</button>
            {ispressed !== false &&(
            <div className={`div-popup${exit} z-index-2`}>
                <input type="file" id="file-upload" onChange={handleFileChange}></input>
                <div className="div-popup-title">
                 <span style={{fontSize:"1.4rem" , marginLeft:"1.3vw"}}> Create a file</span>
                <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
                </div>
                  <><label id="upload-file-input" htmlFor="file-upload" className="pop-file">Choose File</label></>
                  <span id="filename-selected"></span>
                <br></br>
                <div id="afterupload" className="pop-fileselected">
                <span className="pop-span">File Name: </span><input id ="upload-file-name" className="pop-input" type="text"></input>
                <br></br>
                <span className="pop-span">Description: </span><input id="upload-file-desc" className="pop-input" type="text"></input>
                <br></br>
                <span className="pop-span">Content: </span><input id="upload-file-content" className="pop-textarea" type="text"></input>
                {info.level !== "0" &&(
                    <div>
                    <select className="pop-select" id="perm">
                      <option value="true">Users can Read and Write</option>
                      <option value="false">Users can Read only</option>
                      <option value="">Only Me</option>
                    </select>
                    <br></br>
                    </div>
                )}
                {
                  isimage ===true && (
                    <>
                    <button style={{marginLeft: "5.5vw"}} className="pop-button" onClick={() => handleOcrClick()}>Use OCR</button>
                    <button style={{marginLeft: "8vw"}} className="pop-button" onClick={() => handleuploadclick()}>Upload</button>    
                    </>
                  )
                }
                {
                  isimage ===false && (
                    <>
                    <button style={{marginLeft: "18vw"}} className="pop-button" onClick={() => handleuploadclick()}>Upload</button>    
                    </>
                  )
                }
                
                
                </div>      
            </div>
        )}
        {ocrclicked === true &&(
          <>
          <OcrWindow closewindow={handleOcrClose} image={imagefile}></OcrWindow>
          </>
        )}
        </>
        
    );
}

export default Uploadfunc;