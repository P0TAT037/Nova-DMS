import { truncate } from "../Home-functions/truncation";
function Directoryline(props) {
    return (<>
    <div className="col-9" >
        {props.hidarr.map(directory => 
        <>
            <button key={directory.hid} className="dir-button" onClick={() => props.DirButton(directory)}>{truncate(directory.name, 10)}</button>
            {props.hidarr.length !== 1 && <img src={require('../image/dir-arrow.png')} alt="" style={{height: "2vh", width: "1.5vw",marginBottom: "1vh"}}></img>}
            </>    
            )}
            
        </div>
    </>);
}
export {Directoryline};