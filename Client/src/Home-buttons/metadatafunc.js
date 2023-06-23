import { EditFile } from "../Files-Control/EditFile";
import { DeleteFile } from "../Files-Control/DeleteFile";
import { FilePermissions } from "../Files-Control/EditFilePermissions";
import { convertdate } from "../Home-functions/convertdate";
import { truncate } from "../Home-functions/truncation";
import data from "../Endpoint-url.json"
import { useState } from "react";
function Getmetadata(props){
    var allusers =[]
    if(props.clicked === true){
        document.getElementById("main-coloumn").className="col-9 col-home-base";
        document.getElementById("input-search").className="input-search-aftermeta";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            allusers = JSON.parse(xhttp.responseText);
            
        }
    }
   xhttp.open("GET", process.env.REACT_APP_ENDPOINT_URL + `user/all`, false);
    xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
    xhttp.send();
    }
    function sendtocontainer() {
        props.onComplete();
        props.onClick(false); 
        document.getElementById("main-coloumn").className="col-11 col-home-base";
    }
    var metadata = props.metadata;
    var datecreated = convertdate(props.metadata.created);
    var dateupdated = convertdate(props.metadata.updated);
    return(
        props.clicked !== false &&
        <div id="metadata-column" className="col-2 col-home-base z-index-2">
            <div className="row">

                {/* Permission Control */}
            <div className="col-6"><FilePermissions metadata={props.metadata} token={props.token} allusers={allusers} id={props.metadata.id}/></div>

                

                {/* Editing */}
                <div className="col-1">
            {metadata.type !== "folder" &&(
                <EditFile metadata={props.metadata} token={props.token} userinfo={props.userinfo} onUpdate={sendtocontainer} />
                )}   
            </div>
            
            
                <div className="col-4">
            <button className="btn-popup-close" onClick={() => {props.onClick(false); document.getElementById("main-coloumn").className="col-11 col-home-base"; document.getElementById("input-search").className="input-search"; }}>X</button>
            </div>
            </div>
            {}
            <p className="span-metadata">Name: <span className="pop-span"> {metadata.name}</span></p>
            <p className="span-metadata">Type: <span className="pop-span"> {metadata.type}</span></p>
            <p className="span-metadata">Description: <span className="pop-span"> {metadata.description}</span></p>
            <p className="span-metadata">Content: <span className="pop-span"> {truncate(metadata.content,150)}</span></p>
            <p className="span-metadata">Author: <span className="pop-span"> {metadata.author}</span></p>
            <p className="span-metadata">Created: <span className="pop-span"> {datecreated}</span></p>
            <p className="span-metadata">Updated: <span className="pop-span"> {dateupdated}</span></p>
            <p className="span-metadata">Edited By: <span className="pop-span"> {metadata.editedBy}</span></p>
            <p className="span-metadata">Version: <span className="pop-span"> {metadata.version}</span></p>
            
        {/* File Deletion */}
        <div className="row">
        <div className="col-3"><DeleteFile metadata={props.metadata} hid={props.hid} token={props.token} onDelete={sendtocontainer}/></div>
        {metadata.type !== "folder" && (
            <>
            <div className="col-7"><button onClick={() => props.getversionsclicked(metadata.id, metadata.type)} className="metadata-nav-button">Get Previous Versions</button></div>
            <div className="col-2"><button onClick={() => props.movefileclicked(metadata.id, metadata.name)} className="metadata-nav-button">Move </button></div>
            </>
        )}
        </div>
        </div>
    )
}

export {Getmetadata};