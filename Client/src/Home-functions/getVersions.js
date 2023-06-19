import { useState } from "react";
import { useEffect } from "react";
import data from "../Endpoint-url.json"
function Getversions(props){
    const [exit,setExit] = useState("")
    const [isloaded,setIsloaded] = useState(false);
    const [versions,setVersions] = useState([]);
        useEffect(() => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (this.readyState === 4 && this.status === 200) {
                setVersions(JSON.parse(this.responseText));
                setIsloaded(true);
              }
            };
            xhttp.open('GET', data.url + `node/versions?id=${props.fileid}`, true);
            xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
            xhttp.send();
          }, []);
        
    function handleexitclick(){
        setExit("exit");
        props.closeVersions();
      }
    return(
        <>
                <div style={{height: "25vh", marginTop: "15vh" , width:"50vw"}} className={`div-popup${exit} z-index-2`}>
                <div className="div-popup-title">
                 <span style={{fontSize:"1.4rem" , marginLeft:"1.3vw"}}> Get Previous Versions</span>
                <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
                </div>
                {
                    isloaded === false &&(
                        <>
                        loading
                        </>
                    )
                }
                {
                    isloaded === true &&(
                        <>
                        <span style={{marginLeft:"1.3vw"}} className="pop-span">Choose a version:</span>
                        <select style={{marginLeft:"13vw", width:"4vw"}} className="pop-select" id="versionslist">
                            {versions.map((version , index) => (
                                <option value={version}>{index + 1}</option>
                            ))}
                        </select>
                        <br></br>
                        <button style={{marginLeft:"14vw" ,marginTop: "5vh",width:"22vw"}} className="pop-button">Get Version</button>
                        </>
                    )
                }
                </div>
        </>
    )
}
export {Getversions}