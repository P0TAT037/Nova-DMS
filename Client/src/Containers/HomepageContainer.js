import React, { useEffect } from "react";
import { useState } from "react";
import Uploadfunc from "../Home-buttons/uploadfunc.js"
import Newfolderfunc from "../Home-buttons/newfolderfunc.js";
import { parseJwt } from "../Home-functions/parsejwt.js";
import { Showfile } from "../Home-functions/displayfile.js";
import { useNavigate } from 'react-router-dom';
import { Getmetadata } from "../Home-buttons/metadatafunc.js";

var hidarr = [{ name: "root", hid: "/" ,
metadata:{
    type:"folder"
}
}];
const token = localStorage.getItem('token');

function Home() {
    const navigate = useNavigate();
    const userinfo = parseJwt(token);
    const [filetree, setFiletree] = useState([{ name: "root", hid: "/" ,
    metadata:{
        type:"folder"
    }
}]);
const [fileclicked,setFileclicked] = useState(false);
const [clickedfileid,setclickedfileid] = useState();
const [metadataclicked,setMetadataclicked] = useState(false);
    useEffect(() => {
        Getfiles("/", "root","false",(tree) => { setFiletree(tree) })
    }, [])
    const goback = () => {
        hidarr.pop();
        var backhid = hidarr.pop();
        Getfiles(backhid.hid, backhid.name ,"true", (tree) => { setFiletree(tree) })
    }
    const DirButton = (dir) =>{
        var index = hidarr.findIndex(x => x.hid ===dir.hid);
        hidarr = hidarr.slice(0,index+1);
        var DirGet = hidarr[hidarr.length - 1];
        Getfiles(DirGet.hid ,DirGet.name , "false",(tree) => { setFiletree(tree) })
        
    }
    const handlefileClick = (state) =>{
        setFileclicked(state)
    }
    const handlemetaClick = (state) =>{
        setMetadataclicked(state)
    }
    const logout = () =>{
        localStorage.setItem('token', "");
        hidarr = [{ name: "root", hid: "/" ,metadata:{type:"folder"}}];
        navigate(`/`)
    }
    return (
        console.log(filetree),
        <div className="container-fluid">
            
            <Showfile clicked={fileclicked} onClick={handlefileClick} fileid={clickedfileid} token={token}/>
            <div className="row row-main">
                <div id="main-coloumn" className="col-12 col-home-base"> 
                <div className="row m-1">
                <div className="row p-1" >
                <div className="col-2"><img className="img-fluid" src={require('../image/logo-home.png')} alt="logo" /></div>
                <div className="col-9"><input id="input-search" className="input-search" placeholder="search..."></input></div>
                <div className="col-1"><button>go</button></div>
                </div>
                <div className="row p-1" style={{color: "white"}}>
                <div className="col-9 p-3" style={{color: "white" , fontSize: 32}}>Welcome, {userinfo.username}</div> 
                <div className="row row-main">
                    
                {
                    hidarr.map((directory) => (
                        <div className="col-2" key={directory.hid}>
                        <button onClick={() => DirButton(directory)}>{directory.name}</button>
                        </div>
                    ))} 
                    </div>
                    {hidarr.length !== 1 && (
                <div className="row" ><div className="col-1"><button className="btn-back" onClick={() => goback()}></button></div></div>
                    )}
                    <div className="col-9"></div>
                <div className="col-1">
                <button onClick={() => Getfiles(hidarr[hidarr.length-1].hid,hidarr[hidarr.length-1].name,"false",(tree) => { setFiletree(tree) })}>O</button>
                </div>
                <div className="col-1">
                    <Newfolderfunc location={hidarr} token={token}/>
                    
                </div>
                <div className="col-1">
                    <Uploadfunc id={userinfo.id} name={userinfo.username} level={userinfo.level} dir={hidarr[hidarr.length - 1]} token={token}/>
                </div>    
                    </div>
                {filetree.map((folder) => (
                    <div className="col-3" key={folder.hid}>
                        {folder.metadata.type === "folder" && (<div>
                        <button className="btn-folders" onClick={() => Getfiles(folder.hid,folder.name,"true",(tree) => { setFiletree(tree) })}>
                            {folder.name}
                        </button>
                        <button className="btn-metadata" onClick={() => setMetadataclicked(true)}>...</button>
                        </div>)}
                        {folder.metadata.type !== "folder" &&(
                            <div>
                           <button className="btn-files" onClick={() => {setFileclicked(true) ; setclickedfileid(folder.id)}}>
                           {folder.name}
                       </button> 
                       <button className="btn-metadata" onClick={() => setMetadataclicked(true)}>...</button>
                       </div>
                        )

                        }
                    </div>
                    ))
                    
                    }
                    </div>
                    <div className="row row-bottom">
                        <div className="col" onClick={() => logout()}><button>Logout</button></div>
                        <div className="col"><button>R</button></div>
                        <div className="col"><button>A</button></div>
                        </div>
                        
                </div>
                <Getmetadata clicked={metadataclicked} onClick={handlemetaClick}/>
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

