import { useState } from "react";

function Test2(){
    const [ispressed,setIspressed] = useState(false);
    function handlebuttonclick(){
        setIspressed(true);
    }
    function handleexitclick(){
        setIspressed(false);
    }
    return(
        <div>
        <button onClick={handlebuttonclick}>+</button>
        {ispressed !== false &&(
            <div className="div-popup">
                <input type="text"></input>
                <button onClick={handleexitclick}>X</button>
            </div>
        )}
        </div>
    )
}

export default Test2;