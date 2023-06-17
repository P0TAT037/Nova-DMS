import React, { useEffect } from "react";
import { useState } from "react";
import data from "../Endpoint-url.json"
import Uploadfunc from "../Home-buttons/uploadfunc.js"
import { truncate } from "../Home-functions/truncation";
import Newfolderfunc from "../Home-buttons/newfolderfunc.js";
import { parseJwt } from "../Home-functions/parsejwt.js";
import { Showfile } from "../Home-functions/displayfile.js";
import { useNavigate } from 'react-router-dom';
import { Getmetadata } from "../Home-buttons/metadatafunc.js";
import { ManageAdmins } from "../Home-buttons/AdminManagement.js";
import { ManageRoles } from "../Home-buttons/RoleManagement.js";
import { SearchFunction } from "../Home-functions/Search.js";
import { useLocation } from 'react-router-dom';

var hidarr = [{ name: "Root", hid: "/" ,
metadata:{
    type:"folder"
}
}];

function Home() {
    const location = useLocation();
    const token =location.state?.param1;
    const Name =location.state?.param2;
    const navigate = useNavigate();
    const userinfo = parseJwt(token);
    const [filetree, setFiletree] = useState([{ name: "Root", hid: "/" ,metadata:{type:"folder"}}]);
    const [fileclicked,setFileclicked] = useState(false);
    const [clickedfileid,setclickedfileid] = useState();
    const [metadataclicked,setMetadataclicked] = useState(false);
    const [metadata,setMetadata] = useState([{}]);
    const [selectedhid, setSelectedhid] = useState("");


    const Getfiles = (hid,name1, push,callback) => { //hideous, i know
        if(push === "true"){
            const obj = {hid: hid,name: name1};
            hidarr.push(obj);
        }
        
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open(
            "GET",
            data.url + `node/getNodes?hierarchyId=${hid}`,
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

    
    // pls pls pls fix your horrifying names
    useEffect(() => {
        Getfiles("/", "Root","false",(tree) => { setFiletree(tree) })
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
        hidarr = [{ name: "Root", hid: "/" ,metadata:{type:"folder"}}];
        navigate(`/`)
    }
    const refresh = () =>{
        
        Getfiles(hidarr[hidarr.length-1].hid,hidarr[hidarr.length-1].name,"false",(tree) => { setFiletree(tree) })
    }
    //function that goes to location of pressed file in search
    function handlelocationclick(location){
        hidarr = [{ name: "Root", hid: "/" ,metadata:{type:"folder"}}];
        for (let i = 0; i < location.length; i++) {
            var xmlhttp2 = new XMLHttpRequest();
            xmlhttp2.open(
                "GET",
                data.url + `node/getNodes?hierarchyId=${location[i]}`,
                false
            );
            xmlhttp2.setRequestHeader("Authorization", `Bearer ${token}`);
            xmlhttp2.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    var response = JSON.parse(this.responseText)
                    
                    var targetobject = response.find(node=> node.hid === location[i+1])
                    Getfiles(`${location[i]}`, `${targetobject.name}`,"true",(tree) => { setFiletree(tree) })
                }
            };
            
            xmlhttp2.send();
        }
        //Getfiles(`${location}`, `${name}`,"true",(tree) => { setFiletree(tree) })
        console.log(hidarr)
    }
    const handlecompeleted = () =>{
        Getfiles(hidarr[hidarr.length-1].hid,hidarr[hidarr.length-1].name,"false",(tree) => { setFiletree(tree) })
    }

    //HTML Return
    return (
        console.log(filetree),
        <>
        <div className="div-color">
        <div className="container-fluid">
        <div id="user-welcome" className="welcome-div" style={{position: "absolute", color:"white" ,marginTop:"39vh", marginLeft:"35vw", fontSize:"55px"}}>Welcome, {Name}</div>
                {/* File Display */}
            <Showfile clicked={fileclicked} onClick={handlefileClick} fileid={clickedfileid} token={token}/>

                
            <div className="row row-main">
            
                <div id="main-coloumn" className="col-12"> 
                <div className="row m-1">
                    {/* Search Bar */}
                <div className="row p-1 search-row" >
                <div className="col-2"><img className="img-fluid " style={{height: "6.5vh", width:"15vw"}} src={require('../image/home logo.png')} alt="logo" /></div>
                <SearchFunction token={token} onClick={handlelocationclick}/>
                </div>

                <div className="row p-1 search-row"  style={{color: "white"}}>
                <div className="row directory-line mt-2">

                {/* Directory Line */}
                
                    {
                        hidarr.map((directory) => (
                        <div className="col-2" key={directory.hid}>
                            <button className="dir-button" onClick={() => DirButton(directory)}>{truncate(directory.name,10)}</button>
                            {hidarr.length !== 1 && (
                                <img src={require('../image/dir-arrow.png')} alt="arrowlol" style={{height: "2vh", width:"1.5vw",position:"absolute", top:"12.1vh"}}></img>
                            )}
                        </div>
                    ))} 
                </div>
                {/* Refresh Button */}
                <div className="col-9"></div>
                <div className="col-1">
                    <button className="refresh-button" title="Refresh" style={{position: "absolute" ,top: "10.5vh"}} onClick={() => refresh()}>Refresh</button>
                </div>

                {/* New Folder Function */}
                <div className="col-1">
                    <Newfolderfunc location={hidarr} token={token} onComplete={handlecompeleted}/>
                </div>
                {/* New File Function */}
                <div className="col-1">
                    <Uploadfunc id={userinfo.id} name={userinfo.username} onComplete={handlecompeleted} level={userinfo.level} location={hidarr} token={token}/>
                </div>
                

                

            </div>
                
                {/* Back Button */}
                {hidarr.length !== 1 && (
                    <div className="row" ><div className="col-1"><button className="btn-back" onClick={() => goback()}></button></div></div>
                )}
                {/* File tree Mapping */}
                <div className="row">
            {filetree.map((folder) => (
                <div className="col-3" key={folder.hid}>
                        {folder.metadata.type === "folder" && (<div>
                        <button className="btn-folders" onClick={() => Getfiles(folder.hid,folder.name,"true",(tree) => { setFiletree(tree) })}>
                            {truncate(folder.name,25)}
                        </button>
                        <button className="btn-metadata" onClick={() => {setMetadataclicked(true); setMetadata(folder.metadata); setSelectedhid(folder.hid)}}>...</button>
                        </div>)}
                        {folder.metadata.type !== "folder" &&(
                        <>
                            <button className="btn-files" onClick={() => {setFileclicked(true) ; setclickedfileid(folder.id)}}>
                            {truncate(folder.name,25)}
                            </button> 
                            <button className="btn-metadata" onClick={() => {setMetadataclicked(true); setMetadata(folder.metadata); setSelectedhid(folder.hid)}}>...</button>
                        </>
                        )}
                </div>)
                )
            }</div>
            </div>
          
                    {/* Control Row */}
                    <div className="row p-1 row-bottom">
                    {/* Logout */}
                        <button className="col  logout-button" onClick={() => logout()}>Logout</button>
                    {/* Role management */}
                    {userinfo.level > 0 && (
                    <div className="col"><ManageRoles token={token}/></div>
                    )}
                    {/* Admin Management */}
                    {userinfo.level === '2' && (
                        <div className="col"><ManageAdmins token={token}/></div>
                    )}
                        
                    </div>
                </div>
                {/* Metadata bar */}
                <Getmetadata clicked={metadataclicked} onClick={handlemetaClick} onComplete={handlecompeleted} metadata={metadata} hid={selectedhid} token={token} userinfo={userinfo}/>
            </div>
        </div>
        </div>
        </>
    );
}


export { Home };

