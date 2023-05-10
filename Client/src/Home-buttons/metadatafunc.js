function Getmetadata(props){
    if(props.clicked !== false){
    document.getElementById("main-coloumn").className="col-9 col-home-base";
    document.getElementById("input-search").className="input-search-aftermeta";
    }
    var metadata = props.metadata
    return(
        console.log(props.metadata),
        props.clicked !== false &&
        <div id="metadata-column" className="col-3 col-home-base">
            <div className="row">
            <div className="col-1"><button>Delete</button></div>
            <div className="col-1"></div>
                <div className="col-1">
            <button className="btn-popup-close" onClick={() => {props.onClick(false); document.getElementById("main-coloumn").className="col-12 col-home-base";
            document.getElementById("input-search").className="input-search"; }}>X</button>
            </div>
            </div>
            <p>ID: {metadata.id}</p>
      <p>Name: {metadata.name}</p>
      <p>Type: {metadata.type}</p>
      <p>Description: {metadata.description}</p>
      <p>Content: {metadata.content}</p>
      <p>Author: {metadata.author}</p>
      <p>Created: {metadata.created}</p>
      <p>Updated: {metadata.updated}</p>
      <p>Edited By: {metadata.editedBy}</p>
      <p>Version: {metadata.version}</p>
        
        </div>
        
    )
}

export {Getmetadata};