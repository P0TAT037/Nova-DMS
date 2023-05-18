import { useState } from "react";
import { getCurrentTime } from "../Home-functions/getTime";
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
        document.getElementById("upload-file-name").value=file.name;
        formData.append("file", file);
        console.log(file.type);
    }
    
    return(
        console.log(props.userinfo,props.metadata),
        <div>
            <button onClick={handlebuttonclick}>Edit</button>
            {ispressed !== false &&(
            <div className="div-popup z-index-2" >
                <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
                New File Name: <input id ="upload-file-name" type="text"></input>
                <br></br>
                New Description: <input id="upload-file-desc" type="text"></input>
                <br></br>
                New Content: <input id="upload-file-content" type="text"></input>
                
            </div>
        )}
        </div>
        
    );
            }
export {EditFile};