import { truncate } from "../Home-functions/truncation";
import { convertdate } from "../Home-functions/convertdate";
function Filetree(props) {
    return (<>
        {props.filetree.map(folder => <div  key={folder.hid}>
            {folder.metadata.type === "folder" && <>
            <div className="container-getfiles">
                <div className="btn-folders" style={{}} onClick={() => props.Getfiles(folder.hid, folder.name, "true", tree => {
                    props.setFiletree(tree);
                })}>
                    <span className="span-getfiles">Name: {truncate(folder.name, 25)} </span> <span className="span-getfiles">Author: {folder.metadata.author}</span> <span className="span-getfiles">Edited by :{folder.metadata.editedBy}</span> <span className="span-getfiles">Created: {convertdate(folder.metadata.created)}</span>
                </div>
                <button className="btn-metadata" onClick={() => {
                    props.setMetadataclicked(true);
                    props.setMetadata(folder.metadata);
                    props.setSelectedhid(folder.hid);
                }}>...</button>
                </div>
            </>}
            {folder.metadata.type !== "folder" && <>
            <div className="container-getfiles">
            <div className="btn-folders" style={{}} onClick={() => props.Getfiles(folder.hid, folder.name, "true", tree => {
                    props.setFileclicked(true);
                    props.setclickedfileid(folder.id);
                })}>
                    <span className="span-getfiles">Name: {truncate(folder.name, 25)} </span> <span className="span-getfiles">Author: {folder.metadata.author}</span> <span className="span-getfiles">Edited by :{folder.metadata.editedBy}</span> <span className="span-getfiles">Created: {convertdate(folder.metadata.created)}</span>
                </div>
                <button className="btn-metadata" onClick={() => {
                    props.setMetadataclicked(true);
                    props.setMetadata(folder.metadata);
                    props.setSelectedhid(folder.hid);
                }}>...</button></div>
            </>}
        </div>)}</>);
}
export {Filetree}; 