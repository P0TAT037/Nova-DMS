import { useState } from "react";
import data from "../Endpoint-url.json"
function Searchinput(props){
    const [ispressed,setIspressed] = useState(false);
    const [awooga,setAwooga] = useState({hits : 0, results : [{id: 2000, name: "*" ,metadata: {
        author: "newuser",
content: "dean office content",
created: "2023-06-19T23:27:42.4108378-08:00",
description: "Dean office desc",
editedBy: "newuser",
id: 121,
name: "Dean office",
type: "folder",
updated: "2023-06-19T23:27:42.4108385-08:00",
version: 1
}}]}) // this is a placeholder, and it worked.... and im not gonna change it back... sue me >:(
    const [exit,setExit] = useState("")
    const [inputValue, setInputValue] = useState('');

  const handleInputChange = event => {
    setInputValue(event.target.value);
  };
function searchrequest(){
    setExit("");
    setIspressed(true);
    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                setAwooga(JSON.parse(xhttp.responseText));
                console.log(awooga)
                props.onClick(awooga)
            }
        }
        xhttp.open("POST",process.env.REACT_APP_ENDPOINT_URL + `search?searchText=${inputValue}`, true);
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

    
    setIspressed(false)
}

return(
    <>
        <div className="col-11 ">
        <input id="input-search" className="input-search" placeholder="search..." onChange={handleInputChange}></input>
        <button className="search-button" title="Search" onClick={() => searchrequest()}>.</button>
        <button className="filters-button" onClick={() => props.switchsearch(2)}></button>
        </div>
    </>
)
}
export {Searchinput}