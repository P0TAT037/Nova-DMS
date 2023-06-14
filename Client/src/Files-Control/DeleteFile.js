import { useState } from "react";
import data from "../Endpoint-url.json"
function DeleteFile(props){
    const [ispressed,setIspressed] = useState(false);
    var metadata = props.metadata;
    var hid = props.hid
    function handlebuttonclick(){
        setIspressed(true);
    }
    function handleexitclick(){
        setIspressed(false);
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
            <div className="div-popup z-index-2" >
                {metadata.type === "folder" &&(
                    <>
                    <div>Are you sure you want to delete this folder? This will delete all items inside it.</div>
                    <button onClick={() => deletefolder()}>Yes</button>
                    <button onClick={() => handleexitclick()}>No</button>
                    </>
                )}
                {metadata.type !== "folder" &&(
                    <>
                    <div>صباح الخير من يريد ان يمسح الفايل كله ومن يريد ان يمسح اخر فرجن</div>
                    <button onClick={() => deletefile()}>Delete file</button>
                    {metadata.version > 1 &&(
                        <button>Delete last version</button>
                    )}
                    <button className="btn-popup-close" onClick={() => setIspressed(false)}>Cancel</button>
                    </>
                )}
            </div>
        )}
        </div>
        
    );
            }
export {DeleteFile};