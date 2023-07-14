import { useState } from "react";
import data from "../Endpoint-url.json"
function Movefile(props) {
    function movefile(){
        var location = props.location;
        var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (this.readyState === 4 && this.status === 200) {
                props.onComplete();
                props.cancel();
                alert("File Moved")
              }
            }
            xhttp.open("PUT", process.env.REACT_APP_ENDPOINT_URL +`node/move?FileId=${props.id}&newDir=${location[location.length-1].hid}` , true);
            xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
            xhttp.send();
    }
    return(
        console.log(props),
        <div style={{marginLeft: "19vw", top:"90vh", position:"absolute"}} className="`div-popup z-index-2`">
        <button style={{left: "24vw",position:"absolute"}} className="pop-button" onClick={() => movefile()}>Move here</button>
        <button style={{ position:"absolute"}} className="pop-button" onClick={() => props.cancel()}>Cancel</button>
        </div>
    )
}
export {Movefile}