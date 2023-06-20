import { truncate } from "../Home-functions/truncation";
function Filetree(props) {
    return (<div className="row">
        {props.filetree.map(folder => <div className="col-3" key={folder.hid}>
            {folder.metadata.type === "folder" && <div>
                <button className="btn-folders" onClick={() => props.Getfiles(folder.hid, folder.name, "true", tree => {
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
                <button className="btn-files" onClick={() => {
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
        </div>)}</div>);
}
export {Filetree}; 