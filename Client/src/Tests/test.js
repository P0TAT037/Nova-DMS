import { useState } from "react";
import { Searchbyfilters } from "../Home-functions/Searchbyfilters";
import data from '../Endpoint-url.json';


function Test(info){
    
    const [isawooged,setIsawooged] = useState(false)
    const [hasRendered, setHasRendered] = useState(false);

    const onAnimationEnd = () => {
      setHasRendered(true);
    };
    return(
        
        <>
      <body>
  <div>
    {isawooged === true &&(
      <div className={`awooga-test${!hasRendered ? '' : 'animated'}`} onAnimationEnd={onAnimationEnd}>awooga</div>
    )}
     <button onClick={() => setIsawooged(true)}>awooga?</button>
     <button onClick={() => setIsawooged(false)}>no awooga?</button>
  </div>
</body>
        </>
        
    );
            }
export default Test;