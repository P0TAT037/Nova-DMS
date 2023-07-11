import { Searchinput } from "./Searchbyinput";
import { Searchbyfilters } from "./Searchbyfilters";
import { useState } from "react";
function SearchFunction(props){
    const [searchmode,setSearchmode] = useState(1);
    function handleresultsclick(results){
        props.onClick(results)
    }
    function switchsearch(mode){
        setSearchmode(mode)
    }
    return(
        <>
        {searchmode === 1 &&(
            <>
            <Searchinput token={props.token} onClick ={handleresultsclick} switchsearch={switchsearch}/>
            </>
        )}
        
        {searchmode === 2 &&(
            <>
            <Searchbyfilters token={props.token} onClick ={handleresultsclick} switchsearch={switchsearch}/>
            </>
        )}
            
        </>
        
    )
}
export {SearchFunction};