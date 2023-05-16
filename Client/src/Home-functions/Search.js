import { Searchinput } from "./Searchbyinput";
function SearchFunction(props){
    function handlelocationclick(location){
        console.log(location)
        props.onClick(location)
    }
    return(
        <>
            <Searchinput token={props.token} onClick={handlelocationclick}/>
            <div className="col-1"><button>search by filters</button></div>
        </>
        
    )
}
export {SearchFunction};