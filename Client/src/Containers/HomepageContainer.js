import React, { useEffect } from "react";
import { useState } from "react";
import Uploadfunc from "../Home-buttons/uploadfunc.js"
import Newfolderfunc from "../Home-buttons/newfolderfunc.js";
import { parseJwt } from "../Home-functions/parsejwt.js";
import { Showfile } from "../Home-functions/displayfile.js";
import { useNavigate } from 'react-router-dom';
import { Getmetadata } from "../Home-buttons/metadatafunc.js";
import { ManageAdmins } from "../Home-buttons/AdminManagement.js";
import { ManageRoles } from "../Home-buttons/RoleManagement.js";
import { SearchFunction } from "../Home-functions/Search.js";

var hidarr = [{ name: "root", hid: "/" ,
metadata:{
    type:"folder"
}
}];
const token = localStorage.getItem('token');

function Home() {
    const navigate = useNavigate();
    const userinfo = parseJwt(token);
    const [filetree, setFiletree] = useState([{ name: "root", hid: "/" ,metadata:{type:"folder"}}]);
    const [fileclicked,setFileclicked] = useState(false);
    const [clickedfileid,setclickedfileid] = useState();
    const [metadataclicked,setMetadataclicked] = useState(false);
    const [metadata,setMetadata] = useState();
    // pls pls pls fix your horrifying names
    useEffect(() => {
        Getfiles("/", "root","false",(tree) => { setFiletree(tree) })
    }, [])
    //function that returns to previous directory
    const goback = () => {
        hidarr.pop();
        var backhid = hidarr.pop();
        Getfiles(backhid.hid, backhid.name ,"true", (tree) => { setFiletree(tree) })
    }
    //Function that handles directory line
    const DirButton = (dir) =>{
        var index = hidarr.findIndex(x => x.hid ===dir.hid);
        hidarr = hidarr.slice(0,index+1);
        var DirGet = hidarr[hidarr.length - 1];
        Getfiles(DirGet.hid ,DirGet.name , "false",(tree) => { setFiletree(tree) })
        
    }
    //Function that closes file display popup
    const handlefileClick = (state) =>{
        setFileclicked(state)
    }
    //Function that closes metadata bar
    const handlemetaClick = (state) =>{
        setMetadataclicked(state)
    }
    //Function that logs out
    const logout = () =>{
        delete localStorage['token']; // you need to use cookies, not local storage
        hidarr = [{ name: "root", hid: "/" ,metadata:{type:"folder"}}];
        navigate(`/`)
    }

    //HTML Return
    return (
        console.log(filetree,userinfo.level),
        <div className="container-fluid">
                {/* File Display */}
            <Showfile clicked={fileclicked} onClick={handlefileClick} fileid={clickedfileid} token={token}/>

                {/* Search Bar */}
            <div className="row row-main">
                <div id="main-coloumn" className="col-12 col-home-base"> 
                <div className="row m-1">
                <div className="row p-1" >
                <div className="col-2"><img className="img-fluid" src={require('../image/logo-home.png')} alt="logo" /></div>
                <SearchFunction/>
                </div>

                {/* Welcome (Very Important) */}
                <div className="row p-1" style={{color: "white"}}>
                <div className="col-9 p-3" style={{ fontSize: 32}}>Welcome, {userinfo.username}</div> 
                <div className="row row-main">

                {/* Directory Line */}
                    {
                        hidarr.map((directory) => (
                        <div className="col-2" key={directory.hid}>
                            <button onClick={() => DirButton(directory)}>{directory.name}</button>
                        </div>
                    ))} 
                </div>

                {/* Back Button */}
                {hidarr.length !== 1 && (
                    <div className="row" ><div className="col-1"><button className="btn-back" onClick={() => goback()}></button></div></div>
                )}

                {/* Refresh Button */}
                <div className="col-9"></div>
                <div className="col-1">
                    <button onClick={() => Getfiles(hidarr[hidarr.length-1].hid,hidarr[hidarr.length-1].name,"false",(tree) => { setFiletree(tree) })}>O</button>
                </div>

                {/* New Folder Function */}
                <div className="col-1">
                    <Newfolderfunc location={hidarr} token={token}/>
                </div>
                {/* New File Function */}
                <div className="col-1">
                    <Uploadfunc id={userinfo.id} name={userinfo.username} level={userinfo.level} dir={hidarr[hidarr.length - 1]} token={token}/>
                </div>

            </div>
                {/* File tree Mapping */}
            {filetree.map((folder) => (
                <div className="col-3" key={folder.hid}>
                        {folder.metadata.type === "folder" && (<div>
                        <button className="btn-folders" onClick={() => Getfiles(folder.hid,folder.name,"true",(tree) => { setFiletree(tree) })}>
                            {folder.name}
                        </button>
                        <button className="btn-metadata" onClick={() => {setMetadataclicked(true); setMetadata(folder.metadata)}}>...</button>
                        </div>)}
                        {folder.metadata.type !== "folder" &&(
                        <>
                            <button className="btn-files" onClick={() => {setFileclicked(true) ; setclickedfileid(folder.id)}}>
                            {folder.name}
                            </button> 
                            <button className="z-index-1 btn-metadata" onClick={() => {setMetadataclicked(true); setMetadata(folder.metadata)}}>...</button>
                        </>
                        )}
                </div>)
                )
            }
            </div>
                    {/* Control Row */}
                    <div className="row row-bottom">
                    {/* Logout */}
                        <div className="col" onClick={() => logout()}><button>Logout</button></div>
                    {/* Role management */}
                        <div className="col"><ManageRoles/></div>
                    {/* Admin Management */}
                    {userinfo.level === '2' && (
                        <div className="col"><ManageAdmins token={token}/></div>
                    )}
                        
                    </div>
                </div>
                {/* Metadata bar */}
                <Getmetadata clicked={metadataclicked} onClick={handlemetaClick} metadata={metadata} />
            </div>
        </div>
    );
}

const Getfiles = (hid,name1, push,callback) => { //hideous, i know
    if(push === "true"){
        const obj = {hid: hid,name: name1};
        hidarr.push(obj);
    }
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open(
        "GET",
        `https://localhost:7052/node/getNodes?hierarchyId=${hid}`,
        false
    );
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            callback(JSON.parse(this.responseText))

        }
    };
    
    xmlhttp.send();
};

export { Home };

