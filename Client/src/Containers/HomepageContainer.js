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
    const [filetree, setFiletree] = useState([{ name: "Root", hid: "/", metadata: { type: "folder" } }]);
    const [fileclicked, setFileclicked] = useState(false);
    const [clickedfileid, setclickedfileid] = useState();
    const [metadataclicked, setMetadataclicked] = useState(false);
    const [metadata, setMetadata] = useState([{}]);
    const [versionsclicked, setVersionsclicked] = useState(false);
    const [idversion,setIdversion] = useState()
    const [selectedhid, setSelectedhid] = useState("");

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
    //Function that closes file display popup
    const handlefileClick = (state) => {
        setFileclicked(state)
    }
    //Function that closes metadata bar
    const handlemetaClick = (state) => {
        setMetadataclicked(state)
    }
    //function that calls previous versions component
    const handleversionsclick = (id) => {
        setIdversion(id);
        setVersionsclicked(true);
    }
    const handleversionclose = (state) => {
        setTimeout(() => {
            setVersionsclicked(false)
        }, 300);
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
        hidarr = [{ name: "Root", hid: "/", metadata: { type: "folder" } }];
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

                    var targetobject = response.find(node => node.hid === location[i + 1])
                    Getfiles(`${location[i]}`, `${targetobject.name}`, "true", (tree) => { setFiletree(tree) })
                }
            };

            xmlhttp2.send();
        }
        //Getfiles(`${location}`, `${name}`,"true",(tree) => { setFiletree(tree) })
        console.log(hidarr)
    }
    const handlecompeleted = () => {
        Getfiles(hidarr[hidarr.length - 1].hid, hidarr[hidarr.length - 1].name, "false", (tree) => { setFiletree(tree) })
    }

    //HTML Return
    return (
        console.log(filetree),
        <>
            <div className="div-color">
                <div className="container-fluid">
                    {pageonload === true &&(
                        <>
                         <div id="user-welcome" className="welcome-div" style={{ position: "absolute", color: "white", marginTop: "39vh", marginLeft: "35vw", fontSize: "55px" }}>Welcome, {Name}</div>
                        </>
                    )}
                   
                    {/* File Display */}
                    <Showfile clicked={fileclicked} onClick={handlefileClick} fileid={clickedfileid} token={token} />


                    <div className="row row-main">

                        <div id="main-coloumn" className="col-12">
                            <div className="row m-1">
                                {/* Search Bar */}
                                <div className="row p-1 search-row" >
                                    <div className="col-2"><img className="img-fluid " style={{ height: "6.5vh", width: "15vw" }} src={require('../image/home logo.png')} alt="logo" /></div>
                                    <SearchFunction token={token} onClick={handlelocationclick} />
                                </div>

                                <div className="row p-1 search-row" style={{ color: "white" }}>
                                    <Directoryline DirButton={DirButton} hidarr={hidarr}></Directoryline>
                                    {/* Refresh Button */}
                                    <div className="col-9"></div>
                                    <div className="col-1">
                                        <button className="refresh-button" title="Refresh" style={{ position: "absolute", top: "10.5vh" }} onClick={() => refresh()}>Refresh</button>
                                    </div>

                                    {/* New Folder Function */}
                                    <div className="col-1">
                                        <Newfolderfunc location={hidarr} token={token} onComplete={handlecompeleted} />
                                    </div>
                                    {/* New File Function */}
                                    <div className="col-1">
                                        <Uploadfunc id={userinfo.id} name={userinfo.username} onComplete={handlecompeleted} level={userinfo.level} location={hidarr} token={token} />
                                    </div>
                                    {versionsclicked ? (<Getversions closeVersions={handleversionclose} fileid={idversion} token={token}/>) : (
                                        <></>
                                    )}



                                </div>

                                {/* Back Button */}
                                {hidarr.length !== 1 && (
                                    <div className="row" ><div className="col-1"><button className="btn-back" onClick={() => goback()}></button></div></div>
                                )}
                                {/* File tree Mapping */}
                                <Filetree filetree={filetree} setFiletree={setFiletree} setFileclicked={setFileclicked} setclickedfileid={setclickedfileid} setMetadataclicked={setMetadataclicked} setMetadata={setMetadata} setSelectedhid={setSelectedhid} Getfiles={Getfiles}></Filetree>
                                
                            </div>

                            {/* Control Row */}
                            <div className="row p-1 row-bottom">
                                {/* Logout */}
                                <button className="col  logout-button" onClick={() => logout()}>Logout</button>
                                {/* Role management */}
                                {userinfo.level > 0 && (
                                    <div className="col"><ManageRoles token={token} /></div>
                                )}
                                {/* Admin Management */}
                                {userinfo.level === '2' && (
                                    <div className="col"><ManageAdmins token={token} /></div>
                                )}

                            </div>
                        </div>
                        {/* Metadata bar */}
                        <Getmetadata clicked={metadataclicked} onClick={handlemetaClick} onComplete={handlecompeleted} metadata={metadata} hid={selectedhid} token={token} userinfo={userinfo} getversionsclicked={handleversionsclick}/>
                    </div>
                </div>
            </div>
        </>
    );
}


export { Home };

