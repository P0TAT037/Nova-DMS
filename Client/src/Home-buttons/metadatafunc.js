import { EditFile } from "../Files-Control/EditFile";
import { DeleteFile } from "../Files-Control/DeleteFile";
import { FilePermissions } from "../Files-Control/EditFilePermissions";
import data from "../Endpoint-url.json"
import { useState } from "react";
function Getmetadata(props){
    var allusers =[]
    if(props.clicked !== false){
    document.getElementById("main-coloumn").className="col-9 col-home-base";
    document.getElementById("input-search").className="input-search-aftermeta";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            allusers = JSON.parse(xhttp.responseText);
            
        }
    }
   xhttp.open("GET", data.url + `user/all`, false);
    xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
    xhttp.send();
    }
    var metadata = props.metadata;
    var datecreated = Date(props.metadata.created);
    var dateupdated = Date(props.metadata.updated);
    return(
        props.clicked !== false &&
        <div id="metadata-column" className="col-3 col-home-base">
            <div className="row">

                {/* Permission Control */}
            <div className="col-4"><FilePermissions metadata={props.metadata} token={props.token} allusers={allusers} id={props.metadata.id}/></div>

                {/* File Deletion */}
            <div className="col-3"><DeleteFile metadata={props.metadata} hid={props.hid} token={props.token} /></div>

                {/* Editing */}
                <div className="col-2">
            {metadata.type !== "folder" &&(
                <EditFile metadata={props.metadata} token={props.token} userinfo={props.userinfo} />
                )}   
            </div>
            
            
                <div className="col-3">
            <button className="btn-popup-close" onClick={() => {props.onClick(false); document.getElementById("main-coloumn").className="col-12 col-home-base";
            document.getElementById("input-search").className="input-search"; }}>X</button>
            </div>
            </div>
            {}
            <p>Name: {metadata.name}</p>
            <p>Type: {metadata.type}</p>
            <p>Description: {metadata.description}</p>
            <p>Content: {metadata.content}</p>
            <p>Author: {metadata.author}</p>
            <p>Created: {datecreated}</p>
            <p>Updated: {dateupdated}</p>
            <p>Edited By: {metadata.editedBy}</p>
            <p>Version: {metadata.version}</p>
        
        </div>
        
    )
}

export {Getmetadata};