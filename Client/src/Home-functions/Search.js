import { Searchinput } from "./Searchbyinput";
import { Searchbyfilters } from "./Searchbyfilters";
function SearchFunction(props){
    function handlelocationclick(location){
        props.onClick(location)
    }
    return(
        <>
            <Searchinput token={props.token} onClick ={handlelocationclick}/>
            <Searchbyfilters token={props.token}/>
        </>
        
    )
}
export {SearchFunction};