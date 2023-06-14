import { useState } from "react";
import { Searchbyfilters } from "../Home-functions/Searchbyfilters";
import data from '../Endpoint-url.json';
import { truncate } from "../Home-functions/truncation";

function Test(info){
    
  const [selectedOption, setSelectedOption] = useState('');
  
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  function lol(){
    var temp = document.getElementById("dropdown").value;
    console.log(temp);
  }
    return(
      <>
      {truncate("nooooo")}
      </>
    );
            }
export default Test;