import { truncate } from "../Home-functions/truncation";
import { convertdate } from "../Home-functions/convertdate";
function Filetree(props) {
    return (<>
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
                <div className="row btn-files m-1" style={{}} onClick={() => props.Getfiles(folder.hid, folder.name, "true", tree => {
                        props.setFileclicked(true);
                        props.setclickedfileid(folder.id);
                    })}>
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
        </>);
}
export {Filetree}; 