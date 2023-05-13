import { useState } from "react";
import { Searchbyfilters } from "../Home-functions/Searchbyfilters";
function Test(info){
   
    
    return(
        <>
        <div className="col-8"><input id="input-search" className="input-search" placeholder="search..."></input></div>
        <div className="col-1"><button>go</button></div>
        <div className="col-1"><Searchbyfilters/></div>
        </>
        
    );
            }
export default Test;