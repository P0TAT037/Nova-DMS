import { useState } from "react";
function Searchbyfilters(props){
    const [ispressed,setIspressed] = useState(false);
    function handlebuttonclick(){
        setIspressed(true);
    }
    function handleexitclick(){
        setIspressed(false);
    }
    return(
        <>
        <button onClick={handlebuttonclick}>search by filters</button>
        {ispressed !== false &&(
            <div className="div-popup z-index-2" >
                Searchbyfilters
                <button  className="btn-popup-close" onClick={handleexitclick}>X</button>
            </div>
        )}
        </>
    );
}
export {Searchbyfilters}