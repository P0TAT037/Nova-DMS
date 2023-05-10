import { useState } from "react";
function ManageRoles(info){
    const [ispressed,setIspressed] = useState(false);
    function handlebuttonclick(){
        setIspressed(true);
    }
    function handleexitclick(){
        setIspressed(false);
    }
    
    return(
        <div>
            <button onClick={handlebuttonclick}>R</button>
            {ispressed !== false &&(
            <div className="div-popup z-index-2" style={{top: "-70vh"}}>
                ManageRoles
                <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
            </div>
        )}
        </div>
        
    );
            }
export {ManageRoles}