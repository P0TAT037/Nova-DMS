import { useState } from "react";
import { Searchbyfilters } from "../Home-functions/Searchbyfilters";
import data from '../Endpoint-url.json';

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
      <div>
      <label htmlFor="dropdown">Select an option:</label>
      <select id="dropdown" value={"false"} onChange={handleOptionChange}>
        <option value="">nooooo</option>
        <option value="true">Read and Write</option>
        <option value="false">Read only</option>
        <option value="null">Only User</option>
      </select>
      <p>You selected: {selectedOption}</p>
      <button onClick={() => lol()}>lol</button>
    </div>
      </>
    );
            }
export default Test;