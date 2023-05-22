import { EditFile } from "../Files-Control/EditFile";
import { DeleteFile } from "../Files-Control/DeleteFile";
import { FilePermissions } from "../Files-Control/EditFilePermissions";
import data from "../Endpoint-url.json"
import { useState } from "react";
function Getmetadata(props){
    var permusers =[]
    if(props.clicked !== false){
    document.getElementById("main-coloumn").className="col-9 col-home-base";
    document.getElementById("input-search").className="input-search-aftermeta";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            permusers = JSON.parse(xhttp.responseText);
            
        }
    }
   xhttp.open("GET", data.url + `user/all`, false);
    xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
    xhttp.send();
    }
    var metadata = props.metadata
    return(
        console.log(permusers),
        props.clicked !== false &&
        <div id="metadata-column" className="col-3 col-home-base">
            <div className="row">

                {/* Permission Control */}
            <div className="col-4"><FilePermissions metadata={props.metadata} token={props.token} /></div>

                {/* File Deletion */}
            <div className="col-3"><DeleteFile metadata={props.metadata} hid={props.hid} token={props.token} /></div>

                {/* Editing */}
            {metadata.type !== "folder" &&(
                <div className="col-2"><EditFile metadata={props.metadata} token={props.token} userinfo={props.userinfo}/></div>
                )}   
            
            
            
                <div className="col-3">
            <button className="btn-popup-close" onClick={() => {props.onClick(false); document.getElementById("main-coloumn").className="col-12 col-home-base";
            document.getElementById("input-search").className="input-search"; }}>X</button>
            </div>
            </div>
            <p>ID: {metadata.id}</p>
            <p>Name: {metadata.name}</p>
            <p>Type: {metadata.type}</p>
            <p>Description: {metadata.description}</p>
            <p>Content: {metadata.content}</p>
            <p>Author: {metadata.author}</p>
            <p>Created: {metadata.created}</p>
            <p>Updated: {metadata.updated}</p>
            <p>Edited By: {metadata.editedBy}</p>
            <p>Version: {metadata.version}</p>
        
        </div>
        
    )
}

export {Getmetadata};