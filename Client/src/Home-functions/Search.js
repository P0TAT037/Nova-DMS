import { Searchinput } from "./Searchbyinput";
import { Searchbyfilters } from "./Searchbyfilters";
function SearchFunction(props){
    function handleresultsclick(results){
        props.onClick(results)
    }
    return(
        <>
            <Searchinput token={props.token} onClick ={handleresultsclick}/>
            <Searchbyfilters token={props.token}/>
        </>
        
    )
}
export {SearchFunction};