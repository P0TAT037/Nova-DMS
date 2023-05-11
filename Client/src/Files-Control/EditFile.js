import { useState } from "react";
function EditFile(info){
    const [ispressed,setIspressed] = useState(false);
    function handlebuttonclick(){
        setIspressed(true);
    }
    function handleexitclick(){
        setIspressed(false);
    }
    
    return(
        <div>
            <button onClick={handlebuttonclick}>Edit</button>
            {ispressed !== false &&(
            <div className="div-popup z-index-2" >
                EditFile
                <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
            </div>
        )}
        </div>
        
    );
            }
export {EditFile};