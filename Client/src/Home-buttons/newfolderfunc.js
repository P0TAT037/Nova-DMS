import { useState } from "react";
function Newfolderfunc(){
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
                <input type="file"></input>
                <button onClick={handleexitclick}>X</button>
            </div>
        )}
        </div>
        
    );
}

export default Newfolderfunc;