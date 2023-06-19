import { useState } from "react";
import data from "../Endpoint-url.json"
function Getversions(props){
    const [ispressed,setIspressed] = useState(false);
    const [exit,setExit] = useState("")
    
    function handlebuttonclick(){
        setExit("");
        setIspressed(true);
    }
    function handleexitclick(){
        props.closeVersions();
      }
    return(
        <>
                <div style={{width: "50vw"}} className={`div-popup${exit} z-index-2`}>
                <div className="div-popup-title">
                 <span style={{fontSize:"1.4rem" , marginLeft:"1.3vw"}}> Get Previous Versions</span>
                <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
                </div>
                </div>
        </>
    )
}
export {Getversions}