import { truncate } from "../Home-functions/truncation";
import { convertdate } from "../Home-functions/convertdate";
function Filetree(props) {
    return (<>
    {props.fileview === 0 && (
        <>
        {props.filetree !== [] && (
        <>
        {props.filetree.map(folder => <div  key={folder.hid}>
                {folder.metadata.type === "folder" && <>
                <div className="container-getfiles">
                    <div className="row btn-folders m-1" style={{}} onClick={() => props.Getfiles(folder.hid, folder.name, "true", tree => {
                        props.setFiletree(tree);
                    })}>
                        <span className="col-2 span-getfiles mt-2">Name: {truncate(folder.name, 25)} </span> <span className="col-2 span-getfiles mt-2">Author: {folder.metadata.author}</span> <span className="col-2 span-getfiles mt-2">Edited by: {folder.metadata.editedBy}</span> <span className="col-3 span-getfiles mt-2">Created: {convertdate(folder.metadata.created)}</span>
                    </div>
                    <button className="col-1 btn-metadata" onClick={() => {
                        props.setMetadataclicked(true);
                        props.setMetadata(folder.metadata);
                        props.setSelectedhid(folder.hid);
                    }}>...</button>
                    </div>
                </>}
                {folder.metadata.type !== "folder" && <>
                <div className="container-getfiles">
                <div className="row btn-files m-1" style={{}} onClick={() => {props.setFileclicked(true); props.setclickedfileid(folder.id); }}>
                        <span className="col-2 span-getfiles mt-2">Name: {truncate(folder.name, 25)} </span> <span className="col-2 span-getfiles mt-2">Author: {folder.metadata.author}</span> <span className="col-2 span-getfiles mt-2">Edited by: {folder.metadata.editedBy}</span> <span className="col-3 span-getfiles mt-2">Created: {convertdate(folder.metadata.created)}</span>
                    </div>
                    <button className="col-1 btn-metadata" onClick={() => {
                        props.setMetadataclicked(true);
                        props.setMetadata(folder.metadata);
                        props.setSelectedhid(folder.hid);
                    }}>...</button></div>
                </>}
            </div>)}
        
        </>
    )}
        
        {
        props.filetree === [] && (
            <>
            {console.log("imhere")}
            This Folder is Empty.
            </>
        )
        } 
        </>
    )}
    {props.fileview === 1 && (
        <>
        <div className="row">
        {props.filetree.map(folder => <div className="col-3" key={folder.hid}>
            {folder.metadata.type === "folder" && <div>
                <button className="btn-folders-simple" onClick={() => props.Getfiles(folder.hid, folder.name, "true", tree => {
                    props.setFiletree(tree);
                })}>
                    {truncate(folder.name, 25)}
                </button>
                <button className="btn-metadata" onClick={() => {
                    props.setMetadataclicked(true);
                    props.setMetadata(folder.metadata);
                    props.setSelectedhid(folder.hid);
                }}>...</button>
            </div>}
            {folder.metadata.type !== "folder" && <>
                <button className="btn-files-simple" onClick={() => {
                    props.setFileclicked(true);
                    props.setclickedfileid(folder.id);
                }}>
                    {truncate(folder.name, 25)}
                </button>
                <button className="btn-metadata" onClick={() => {
                    props.setMetadataclicked(true);
                    props.setMetadata(folder.metadata);
                    props.setSelectedhid(folder.hid);
                }}>...</button>
            </>}
        </div>)}</div>
        
        </>
    )}
        </>);
}
export {Filetree}; 