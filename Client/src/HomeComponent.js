import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

function Home() {
const { usertoken } = useParams();
    const [filetree, setFiletree] = useState([{ name: "root", hid: "/" }]);
    useEffect(() => {
        Getfiles("/", (tree) => { setFiletree(tree) })
    }, [])
    const token = localStorage.getItem('token');
    console.log(token);
    return (
        <div className="bg-image" style={{backgroundImage: "url('/bg.jpg')" , height: "100vh" , backgroundSize: "100%"}}>
        <div className="container-fluid">
            <div className="row row-main">
                <div className="col-3 col-home-base">
                <img className="img-fluid ms-5 mt-3" src={require('./image/logo-home.png')} alt="logo" />
                <button className="btn-manage">Edit Account</button>
                <button className="btn-manage">Logout</button>
                </div>
                <div className="col-9 col-home-base">
                <div className="row m-1">
                <div className="row p-1" ><input className="input-search" placeholder="search..."></input></div>
                <div className="row p-1" style={{color: "white"}}><h4>folders:</h4></div>
                {filetree.map((folder) => (
                    <div className="col-3" key={folder.hid}>
                        <button className="btn-files" onClick={() => Getfiles(folder.hid, (tree) => { setFiletree(tree) })}>
                            {folder.name}
                        </button>
                    </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
   
    );
}

const Getfiles = (hid1, callback) => {
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.open(
        "GET",
        `https://localhost:7052/api/node?id=${hid1}`,
        false
    );

    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            callback(JSON.parse(this.responseText))

        }
    };
    
    xmlhttp.send();
};

export { Home };

//{filetree.map((folder) => (
   // <div className="col-2" key={folder.hid}>
    //<button className="btn-files" onClick={() => Getfiles(folder.hid, (tree) => { setFiletree(tree) })}>
      //  {folder.name}
   // </button>
//</div>
//))}