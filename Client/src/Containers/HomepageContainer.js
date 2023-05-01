import React, { useEffect } from "react";
import { useState } from "react";
import Uploadfunc from "../Home-buttons/uploadfunc.js"
import Newfolderfunc from "../Home-buttons/newfolderfunc.js";
import { parseJwt } from "../Home-functions/parsejwt.js";


const hidarr = [];
const token = localStorage.getItem('token');

function Home() {
    const userinfo = parseJwt(token);
    const [filetree, setFiletree] = useState([{ name: "root", hid: "/" }]);
    useEffect(() => {
        Getfiles("/", (tree) => { setFiletree(tree) })
    }, [])
    const goback = () => {
        hidarr.pop();
        var backhid = hidarr.pop();
        console.log(backhid);
        Getfiles(backhid, (tree) => { setFiletree(tree) })
    }
    return (
        <div className="container-fluid">
            <div className="row row-main">
                <div className="col-12 col-home-base">
                <div className="row m-1">
                <div className="row p-1" >
                <div className="col-2"><img className="img-fluid" src={require('../image/logo-home.png')} alt="logo" /></div>
                <div className="col-9"><input className="input-search" placeholder="search..."></input></div>
                <div className="col-1"><button>go</button></div>
                </div>
                <div className="row p-1" style={{color: "white"}}>
                <div className="col-9 p-3" style={{color: "white" , fontSize: 32}}>Welcome, {userinfo.username}</div>   
                <div className="col-9 p-3" style={{color: "white" , fontSize: 32}}>folders:</div>
                <div className="col-1">
                    <Uploadfunc id={userinfo.id} name={userinfo.username} level={userinfo.level} dir={hidarr[hidarr.length - 1]} token={token}/>
                </div>
                <div className="col-1">
                    <Newfolderfunc/>
                </div>
                <div className="col-1">

                </div>
                {hidarr.length !== 1 && (
                <div className="row" ><div className="col-1"><button className="btn-back" onClick={() => goback()}></button></div></div>
                    )}    
                    </div>
                {filetree.map((folder) => (
                    <div className="col-3" key={folder.hid}>
                        <button className="btn-files" onClick={() => Getfiles(folder.hid, (tree) => { setFiletree(tree) })}>
                            {folder.name}
                        </button>
                    </div>
                    ))}
                    </div>
                    <div className="col-11 p-3" style={{color: "white" , fontSize: 32 }}>files: (map files here)</div> 
                </div>
            </div>
        </div>
   
    );
}

const Getfiles = (hid, callback) => {
    hidarr.push(hid);
    console.log(hidarr)
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

