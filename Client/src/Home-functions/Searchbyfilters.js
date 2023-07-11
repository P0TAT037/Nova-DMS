import { useState } from "react";
function Searchbyfilters(props){
    const [ispressed,setIspressed] = useState(false);
    const [exit,setExit] = useState("");
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
}}]}) 
    function handlebuttonclick(){
      setExit("");
        setIspressed(true);
    }
    function handleexitclick(){
      setExit("exit");
      setTimeout(function() {
        setIspressed(false);
      }, 350);
    }
    function handleSearchClick() {
        const name = document.getElementById('nm').value;
        const description = document.getElementById('Des').value;
        const content = document.getElementById('con').value;
        const author = document.getElementById('auth').value;

        const requestBody = {
            ...(name && { name }),
            ...(description && { description }),
            ...(content && { content }),
            ...(author && { author }),
          };
          console.log(JSON.stringify(requestBody));
          const headers = {
            'accept': '*/*',
            'Authorization': `Bearer ${props.token}`,
            'Content-Type': 'application/json',
          };
          fetch("https://localhost:7052/search/filter", {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
          })
         
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            setAwooga(data);
            props.onClick(awooga)
            console.log(data);
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
          
        
    }
    return(
        <>
        <span className="col-2" style={{color:"white"}}>Name: <input style={{width:"10vw"}} id="nm" className="input-search-small" placeholder="search..." ></input></span>
        <span className="col-3" style={{color:"white"}} >Description: <input style={{width:"10vw"}} id="Des" className="input-search-small" placeholder="search..." ></input></span>
        <span className="col-2" style={{color:"white"}} > Content: <input  style={{width:"10vw"}} id="con" className="input-search-small" placeholder="search..." ></input></span>
        <span className="col-2" style={{color:"white"}} >Author: <input style={{width:"10vw"}} id="auth" className="input-search-small" placeholder="search..."></input></span>
        <button style={{width:"2vw", borderRadius:"10px"}} className="col-1 search-button" onClick={() => handleSearchClick()} ></button>
        <button style={{width:"10vw" , marginLeft:"3vw"}} onClick={() => props.switchsearch(1)} className="col-2 pop-button">Back to normal seach</button>
        </>
    );
}
export {Searchbyfilters}