import { useState } from "react";
import data from "../Endpoint-url.json"
function Searchinput(props){
    const [ispressed,setIspressed] = useState(false);
    const [awooga,setAwooga] = useState({hits : 0, results : [{id: 20, name: "*"}]}) // this is a placeholder, and it worked.... and im not gonna change it back... sue me >:(
    const [exit,setExit] = useState("")
function searchrequest(){
    setExit("");
    setIspressed(true);
    var searchinput = document.getElementById("input-search").value;
    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                setAwooga(JSON.parse(xhttp.responseText));
            }
        }
        xhttp.open("POST",process.env.REACT_APP_ENDPOINT_URL + `search?searchText=${searchinput}`, true);
        xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
        xhttp.send([]);
}                  
function gotolocation(hid){
    var newhidarr = ["/"]
    var element = "/"
    var oldhid = hid.split("/");
    oldhid.pop();
    oldhid.pop();
    for (let i = 0; i < oldhid.length; i++) {
        if(oldhid[i] !== ""){
            element += oldhid[i] + "/";
            newhidarr.push(element)
        }
        
    }
    //console.log(newhidarr);

    props.onClick(newhidarr)
    setIspressed(false)
}
function handleexitclick(){
    setExit("exit");
      setTimeout(function() {
        setIspressed(false);
      }, 350);
}
return(
    <>
        <div className="col-11 "><input id="input-search" className="input-search" placeholder="search..."></input>
        <button className="search-button" title="Search" onClick={() => searchrequest()}>.</button>
        </div>
        
        
        {ispressed === true &&(
            <div className={`div-popup${exit} z-index-2`} style={{width: "100vh" , height: "35vw", top: "15vh"}}> 
            <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
            {awooga.results.map((result) => (
                <div key={result.id}>
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