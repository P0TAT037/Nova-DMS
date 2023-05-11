import { useState } from "react";
function Test(info){
    const [ispressed,setIspressed] = useState(false);
    function handlebuttonclick(){
        setIspressed(true);
    }
    function handleexitclick(){
        setIspressed(false);
    }
    
    return(
        
        <div>
            <button onClick={handlebuttonclick}>F</button>
            {ispressed !== false &&(
            <div className="div-popup z-index-2">
                <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
                File Name: <input id ="folder-name" type="text"></input>
                <br></br>
                Description: <input id="folder-desc" type="text"></input>
                <br></br>
                Content: <input id="folder-content" type="text"></input>
                <br></br>
                this folder will be created in:
                <br></br>
                
                <br></br>
               
            </div>
        )}
        </div>
        
    );
            }
export default Test;