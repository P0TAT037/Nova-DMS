import { useState } from "react";
function FilePermissions(info){
    const [ispressed,setIspressed] = useState(false);
    function handlebuttonclick(){
        setIspressed(true);
    }
    function handleexitclick(){
        setIspressed(false);
    }
    
    return(
        <div>
            <button onClick={handlebuttonclick}>Edit Permissions</button>
            {ispressed !== false &&(
            <div className="div-popup z-index-2" >
                FilePermissions
                <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
            </div>
        )}
        </div>
        
    );
            }
export {FilePermissions};