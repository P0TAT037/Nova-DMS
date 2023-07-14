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
import { Filetree } from "../Home-functions/Filetree";
import { Directoryline } from "../Home-functions/Directoryline";
import { Getversions } from "../Home-functions/getVersions";
import { Movefile } from "../Home-buttons/Movefile";
import { switchtolight } from "../Home-buttons/switchcolormode";

var hidarr = [{
    name: "Root", hid: "/",
    metadata: {
        type: "folder"
    }
}];

function Home() {
    const location = useLocation();
    const token = location.state?.param1;
    const Name = location.state?.param2;
    const navigate = useNavigate();
    const userinfo = parseJwt(token);
    const [pageonload, setPageonload] = useState(true)
    const [view,setView] = useState(0);
    const [filetree, setFiletree] = useState([{ name: "Root", hid: "/", metadata: { type: "folder" } }]);
    const [fileclicked, setFileclicked] = useState(false);
    const [searched,setSearched] = useState(false)
    const [clickedfileid, setclickedfileid] = useState();
    const [metadataclicked, setMetadataclicked] = useState(false);
    const [metadata, setMetadata] = useState([{}]);
    const [versionsclicked, setVersionsclicked] = useState(false);
    const [idOfGetversion,setIdOfGetVersion] = useState()
    const [versionfiletype,setVersionfiletype] = useState();
    const [versionid,setVersionID] = useState(null)
    const [selectedhid, setSelectedhid] = useState("");
    const [movefile, setMovefile] = useState(false);
    const [movefileid,setMovefileid] = useState();
    const [movefilename, setMovefilename] = useState();

    setTimeout(function() {
        setPageonload(false)
      }, 2500);
    const Getfiles = (hid, name1, push, callback) => { //hideous, i know
        if (push === "true") {
            const obj = { hid: hid, name: name1 };
            hidarr.push(obj);
        }

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open(
            "GET",
            process.env.REACT_APP_ENDPOINT_URL + `node/getNodes?hierarchyId=${hid}`,
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
        Getfiles("/", "Root", "false", (tree) => { setFiletree(tree) })
    }, [])
    //function that returns to previous directory
    const goback = () => {
        hidarr.pop();
        var backhid = hidarr.pop();
        Getfiles(backhid.hid, backhid.name, "true", (tree) => { setFiletree(tree) })
    }
    //Function that handles directory line
    const DirButton = (dir) => {
        var index = hidarr.findIndex(x => x.hid === dir.hid);
        hidarr = hidarr.slice(0, index + 1);
        var DirGet = hidarr[hidarr.length - 1];
        Getfiles(DirGet.hid, DirGet.name, "false", (tree) => { setFiletree(tree) })

    }
    //Function that opens file display popup
    const handlefileClick = (state) => {
        setFileclicked(state)
    }
    //Function that closes metadata bar
    const handlemetaClick = (state) => {
        setMetadataclicked(state)
        
    }
    //function that calls previous versions component
    const handleversionsclick = (id, filetype) => {
        setIdOfGetVersion(id);
        setVersionfiletype(filetype);
        setVersionsclicked(true);
    }
    //function that closes versions window
    const handleversionclose = (state) => {
        setTimeout(() => {
            setVersionsclicked(false)
        }, 300);
    }
    //function that displays the version
    const displayversion = (versionid) => {
        setTimeout(() => {
            setVersionsclicked(false)
            setVersionID(versionid);
        }, 300);
    }
    //function that closes version display
    const closedisplayversion = (state) => {
        setVersionID(state);
    }
    //function that moves file
    const movefilepressed = (fileid,filename) =>{
        setMetadataclicked(false);
        setMovefile(true);
        setMovefileid(fileid);
        setMovefilename(filename);
        
    }
    const cancelmovefile = () =>{
        setMovefile(false);
    }
    //function that goes back from search
    function gobacksearch() {
        Getfiles("/", "Root", "false", (tree) => { setFiletree(tree) });
        setSearched(false);
        hidarr = [{
            name: "Root", hid: "/",
            metadata: {
                type: "folder"
            }
        }];
    }
    //Function that logs out
    const logout = () => {
        hidarr = [{ name: "Root", hid: "/", metadata: { type: "folder" } }];
        navigate(`/`)
    }
    const refresh = () => {

        Getfiles(hidarr[hidarr.length - 1].hid, hidarr[hidarr.length - 1].name, "false", (tree) => { setFiletree(tree) })
    }
    //function that goes to location of pressed file in search
    function handlelocationclick(location) {
        console.log(location)
        setFiletree(location.results)
        setSearched(true);
    }
    const handlecompeleted = () => {
        Getfiles(hidarr[hidarr.length - 1].hid, hidarr[hidarr.length - 1].name, "false", (tree) => { setFiletree(tree) })
    }

    //HTML Return
    return (
        console.log(filetree),
        <>
            <div id="div-color" className="div-color z-index-1">
                <div className="container-fluid">
                    {pageonload === true &&(
                        <>
                         <div id="user-welcome" className="welcome-div" style={{ position: "absolute", color: "white", marginTop: "39vh", marginLeft: "37vw", fontSize: "55px" }}>Welcome, {Name}</div>
                        </>
                    )}
                   
                   


                    <div className="row row-main">
                        {/*Menu Bar*/}
                    
                    
                        {/* New Folder Function */}
                        <div id="div-menu" className="col-1 div-menu pt-1">
                        <img style={{width:"3.5vw" ,marginTop:"1.5vh", marginLeft:"1.5vw"}} src={require('../image/home-logo.png')} alt="logo" />
                            <Newfolderfunc location={hidarr} token={token} onComplete={handlecompeleted} />
                             <span className="span-menu">New Folder</span>
                        {/* New File Function */}
                         {/* File Display */}
                    <Showfile clicked={fileclicked} onClick={handlefileClick} fileid={clickedfileid} token={token} versionclicked={versionid} idOfGetversion={idOfGetversion} closeversiondisplay={closedisplayversion} filetype={versionfiletype} />
                            <Uploadfunc id={userinfo.id} name={userinfo.username} onComplete={handlecompeleted} level={userinfo.level} location={hidarr} token={token} />
                            <span style={{ marginLeft:"1.8vw"}} className="span-menu">New File</span>
                        {/* Role management */}
                        {userinfo.level > 0 && (
                            <>
                            <ManageRoles token={token} />
                            <span style={{marginLeft:"0.9vw"}} className="span-menu">Manage Groups</span>
                            </>
                        )}
                            
                        {/* Admin Management */}
                        {userinfo.level === '2' && (
                            <>
                            <ManageAdmins token={token} />
                            <span style={{marginLeft:"0.8vw"}} className="span-menu">Manage Admins </span>
                            </>
                        )}
                            
                        {/* Logout */}
                        <button className="logout-button" onClick={() => logout()}>Logout</button>{/* honestly i dont care at this point */}
                        <span style={{marginLeft:"2vw"}} className="span-menu">Logout</span>
                        </div>
                        <div id="main-coloumn" className="col-11 pt-2">
                            
                                {/* Search Bar */}
                                <div className="row p-1 search-row" >
                                    <SearchFunction token={token} onClick={handlelocationclick} />
                                </div>

                                <div className="row p-1 search-row" style={{ color: "white" }}>
                                    {/* Back Button */}
                                {searched !== true && (
                                    <>
                                    {hidarr.length !== 1 && (
                                    <div className="col-md-auto g-0 col-back-button">
                                    <button className="btn-back" onClick={() => goback()}></button>
                                    </div>
                                )}
                                {hidarr.length === 1 && (
                                    <div className="col-md-auto g-0 col-back-button">
                                    <button className="btn-back-placeholder" ></button>
                                    </div>
                                )}
                                    </>
                                )}
                                {searched === true &&(<>
                                    <div className="col-md-auto g-0 col-back-button">
                                    <button className="btn-back" onClick={() => gobacksearch()}></button>
                                    </div>
                                </>)}
                                
                                    <Directoryline DirButton={DirButton} searched={searched} hidarr={hidarr}></Directoryline>
                                    {/* Refresh Button */}
                                    <div className="col-2">
                                    {view === 0 && (
                                            <>
                                            <button className="tileview-button" title="Change to Tile view" onClick={() => setView(1)}>Refresh</button>
                                            </>
                                        )}
                                        {view === 1 && (
                                            <>
                                            <button className="gridview-button" title="Change to Grid view" onClick={() => setView(0)}>Refresh</button>
                                            </>
                                        )}
                                        <button className="refresh-button" title="Refresh" onClick={() => refresh()}>Refresh</button>
                                    </div> 
                                    

                                    {versionsclicked ? (<Getversions closeVersions={handleversionclose} fileid={idOfGetversion} token={token} getVersion={displayversion}/>) : (
                                        <></>
                                    )}



                                </div>

                                
                                {/* File tree Mapping */}
                                <Filetree filetree={filetree} setFiletree={setFiletree} setFileclicked={setFileclicked} setclickedfileid={setclickedfileid} setMetadataclicked={setMetadataclicked} setMetadata={setMetadata} setSelectedhid={setSelectedhid} Getfiles={Getfiles} fileview={view}></Filetree>
                                {movefile ? (<><Movefile id={movefileid} name={movefilename} location={hidarr} cancel={cancelmovefile} token={token} onComplete={handlecompeleted}></Movefile></>) : (
                                        <></>
                                    )}
                                <button className="darkmode-button" onClick={() => {switchtolight()}}></button>
                        </div>
                        {/* Metadata bar */}
                        <Getmetadata clicked={metadataclicked} onClick={handlemetaClick} onComplete={handlecompeleted} metadata={metadata} hid={selectedhid} token={token} userinfo={userinfo} getversionsclicked={handleversionsclick} movefileclicked={movefilepressed}/>
                    </div>
                </div>
            </div>
        </>
    );
}


export { Home };

