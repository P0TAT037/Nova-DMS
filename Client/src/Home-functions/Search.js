import { Searchinput } from "./Searchbyinput";
function SearchFunction(props){
    function handlelocationclick(location){
        console.log(location)
        props.onClick(location)
    }
    return(
        <>
            <Searchinput token={props.token} onClick={handlelocationclick}/>
            <div className="col-1"><button className="filters-button"title="Search By Filters"></button></div>
        </>
        
    )
}
export {SearchFunction};