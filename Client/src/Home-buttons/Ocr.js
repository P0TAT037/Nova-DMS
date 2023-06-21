import { useState } from "react";

function OcrWindow(props){
    const [isloading,setIsloading] = useState(true);
    const reader = new FileReader();
    reader.readAsDataURL(props.image);
    reader.addEventListener('load', () => {
        localStorage.setItem('thumbnail', reader.result);
    });
    localStorage.setItem("textvalue","lol")
    setTimeout(() => {
        setIsloading(false);
    }, 300);
    return(
        <>
        <div  className={`popup-ocr`}>
            {isloading === false && (
                <>
                <div className="div-popup-title">
                <span style={{fontSize:"1.4rem" , marginLeft:"1.3vw"}}> OCR Detection</span>
                <button  className="btn-popup-close" onClick={props.closewindow}>X</button>
                </div>
                <iframe style={{width:"50vw" , height: "80vh" , overflow: "auto"}} title="ocr" src="http://localhost:3000/test"></iframe>
                <div style={{float:"right"}}>
                <span style={{position: "absolute" , marginLeft: "0.7vw"}}>Content:</span>
                <textarea style={{ height:"73vh" , width:"27vw" , marginRight:"1vw", marginTop:"6vh"}} className="pop-textarea"></textarea></div>
                </>
            )}
            {
            isloading === true &&(
                <>
                <div className="div-popup-title">
                <span style={{fontSize:"1.4rem" , marginLeft:"1.3vw"}}> OCR Detection</span>
                <button  className="btn-popup-close" onClick={props.closewindow}>X</button>
                </div>
                <span className="pop-span">loading...</span>
                </>
            )
            }
            
                
            </div>
        </>
    )
}

export {OcrWindow};