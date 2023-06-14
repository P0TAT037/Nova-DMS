import { useState } from "react";
import { Searchbyfilters } from "../Home-functions/Searchbyfilters";
import data from '../Endpoint-url.json';
var ocr = [{
  startlocx: "69px",
  startlocy: "70px",
  width: "450px",
  height:"10px",
  content: "This is line 1"
},
{
  startlocx: "132px",
  startlocy: "70px",
  width: "450px",
  height:"10px",
  content: "This is line 2"
}] 

function Test(info){
    
    
    return(
        
       <>
       {ocr.map((line, index) =>
       <div key={index} className="ocr-div" title={line.content} style={{top: `${line.startlocx}`, left: `${line.startlocy}` ,width: `${line.width}`, height: `${line.height}`}}></div>    
       )}
      <img width={"600px"} height={"600px"} src="ocr test.png"></img>
       </>
        
    );
            }
export default Test;