import { useState } from "react";
import data from "../Endpoint-url.json"
function Searchinput(props){
    const [ispressed,setIspressed] = useState(false);
    const [awooga,setAwooga] = useState({hits : 0, results : [{id: 20, name: "bruh"}]}) // this is a placeholder, and it worked.... and im not gonna change it back... sue me >:(
    
function searchrequest(){
    setIspressed(true);
    var searchinput = document.getElementById("input-search").value;
    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                setAwooga(JSON.parse(xhttp.responseText));
            }
        }
        xhttp.open("POST",data.url + `search?searchText=${searchinput}`, true);
        xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp.send([]);
}                  
function gotolocation(hid){
    props.onClick(hid)
    setIspressed(false)
}
function handleexitclick(){
    setIspressed(false)
}
return(
    <>
        <div className="col-8"><input id="input-search" className="input-search" placeholder="search..."></input></div>
        <div className="col-1"><button onClick={() => searchrequest()}>go</button></div>
        {ispressed === true &&(
            <div className="div-popup z-index-2" style={{width: "100vh" , height: "35vw", top: "15vh"}}> 
            <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
            {awooga.results.map((result) => (
                <div key={result.id}>
                    {console.log(result)}
                {result.name}
                <button onClick={() => gotolocation(result.hid)}>go to location</button>
                <br></br>
                </div>
            ))}
            
            </div>
            
        )}
    </>
)
}
export {Searchinput}