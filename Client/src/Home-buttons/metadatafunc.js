function Getmetadata(props){
    if(props.clicked !== false){
    document.getElementById("main-coloumn").className="col-9 col-home-base";
    document.getElementById("input-search").className="input-search-aftermeta";
    }
    else if(props.clicked !== true){
        document.getElementById("main-coloumn").className="col-12 col-home-base";
        document.getElementById("input-search").className="input-search"; 
    }
    return(
        props.clicked !== false &&
        <div id="metadata-column" className="col-3 col-home-base">metadata here
        <button className="btn-popup-close" onClick={() => props.onClick(false)}>X</button>
        </div>
        
    )
}

export {Getmetadata};