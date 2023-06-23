import { truncate } from "../Home-functions/truncation";
function Directoryline(props) {
    return (<>
        {props.hidarr.map(directory => <div className="col-2" key={directory.hid}>
            <button className="dir-button" onClick={() => props.DirButton(directory)}>{truncate(directory.name, 10)}</button>
            {props.hidarr.length !== 1 && <img src={require('../image/dir-arrow.png')} alt="arrowlol" style={{
                height: "2vh",
                width: "1.5vw",
                position: "absolute",
                top: "12.1vh"
            }}></img>}
        </div>)}
    </>);
}
export {Directoryline};