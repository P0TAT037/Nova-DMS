import { useState } from "react";
function DeleteFile(info){
    const [ispressed,setIspressed] = useState(false);
    function handlebuttonclick(){
        setIspressed(true);
    }
    function handleexitclick(){
        setIspressed(false);
    }
    
    return(
        <div>
            <button onClick={handlebuttonclick}>Delete</button>
            {ispressed !== false &&(
            <div className="div-popup z-index-2" >
                DeleteFile
                <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
            </div>
        )}
        </div>
        
    );
            }
export {DeleteFile};