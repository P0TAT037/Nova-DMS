import { useState } from "react";
function ManageAdmins(info){
    const [ispressed,setIspressed] = useState(false);
    function handlebuttonclick(){
        setIspressed(true);
    }
    function handleexitclick(){
        setIspressed(false);
    }
    
    return(
        <div>
            <button onClick={handlebuttonclick}>A</button>
            {ispressed !== false &&(
            <div className="div-popup z-index-2" style={{top: "-70vh"}}>
                ManageAdmins
                <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
            </div>
        )}
        </div>
        
    );
            }
export {ManageAdmins}
