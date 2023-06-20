import { useState } from "react";
import data from "../Endpoint-url.json"
function DeleteFile(props){
    const [ispressed,setIspressed] = useState(false);
    const [exit,setExit] = useState("")
    var metadata = props.metadata;
    var hid = props.hid
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
    function deletefolder(){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                props.onDelete();
                alert("folder deleted");
            }
        }
        xhttp.open("DELETE",data.url + `node/deleteFolder?HID=${hid}`, true);
        xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp.send();
        handleexitclick();
    }
    function deletefile(){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                props.onDelete();
                alert("file deleted");
            }
        }
        xhttp.open("DELETE",data.url + `node?id=${props.metadata.id}`, true);
        xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp.send();
        handleexitclick();
    }
    function deletelastver(){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                alert("file deleted");
                props.onDelete();
            }
        }
        xhttp.open("DELETE",data.url + `node?id=${props.metadata.id}&versionId=${props.metadata.version}`, true);
        xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp.send();
        handleexitclick();
    }
    return(
        <div>
            <button onClick={handlebuttonclick}>Delete</button>
            {ispressed !== false &&(
            <div className={`div-popup${exit} z-index-2`} style={{height: "20vh", marginTop: "15vh"}} >
                <div className="div-popup-title">
                 <span style={{fontSize:"1.4rem" , marginLeft:"1.3vw"}}> Delete {props.metadata.name}</span>
                <button  className="btn-popup-close" onClick={() =>  handleexitclick()}>X</button>
                </div>
                {metadata.type === "folder" &&(
                    <>
                    <div><span className="pop-span" style={{marginLeft: "7vw"}}>Are you sure you want to delete this folder? This will delete all items inside it.</span></div>
                    <button className="pop-button" style={{width: "10vw", marginLeft: "11vw"}} onClick={() => deletefolder()}>Yes</button>
                    <button className="pop-button" style={{width: "10vw" , marginLeft: "8vw"}} onClick={() => handleexitclick()}>No</button>
                    </>
                )}
                {metadata.type !== "folder" &&(
                    <>
                    <div><span className="pop-span">Are you sure you want to delete this file?</span></div>
                    {metadata.version === 1 &&(
                    <>
                    <button className="pop-button" style={{width: "10vw", marginLeft: "11vw"}} onClick={() => deletefile()}>Yes</button>
                    <button className="pop-button" style={{width: "10vw" , marginLeft: "8vw"}} onClick={() => handleexitclick()}>No</button>
                    </>
                    )}
                    {metadata.version > 1 &&(
                        <>
                        <button className="pop-button" style={{width: "10vw", marginLeft: "11vw"}} onClick={() => deletefile()}>Delete file</button>
                        <button className="pop-button" style={{width: "10vw", marginLeft: "8vw"}}  onClick={() => deletelastver()}>Delete last version</button>
                        </>
                    )}
                    </>
                )}
            </div>
        )}
        </div>
        
    );
            }
export {DeleteFile};