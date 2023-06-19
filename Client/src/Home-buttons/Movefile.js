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
                alert("does")
              }
            }
            xhttp.open("PUT", data.url +`node/move?FileId=${props.id}&newDir=${location[location.length-1].hid}` , true);
            xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
            xhttp.send();
    }
    return(
        console.log(props),
        <div style={{marginLeft: "27vw", marginTop:"58vh"}} className="`div-popup z-index-2`">
        <button className="pop-button" onClick={() => movefile()}>Move here</button>
        <button style={{marginLeft:"8vw"}} className="pop-button" onClick={() => props.cancel()}>Cancel</button>
        </div>
    )
}
export {Movefile}