import { useState } from "react";
import { useEffect } from "react";

function OcrWindow(props){
    const [isloading,setIsloading] = useState(true);
    const formData = new FormData();
    const reader = new FileReader();
    console.log(props.image)
    reader.readAsDataURL(props.image);
    reader.addEventListener('load', () => {
        localStorage.setItem('thumbnail', reader.result);
    });
    formData.append("image", props.image);
    const endpoint = process.env.REACT_APP_ENDPOINT_URL +'getText';
        const headers = {
          'accept': '*/*',
          'Authorization': `Bearer ${props.token}`,
        };
        useEffect(() => {
            fetch(endpoint, {
                method: 'POST',
                headers: headers,
                body: formData
              })
             
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then(data => {
                localStorage.setItem('ocroutput', JSON.stringify(data));
                  setTimeout(() => {
                    data.map((line) => (
                      document.getElementById("content-textarea").textContent += line.content + "\n"
                    ))
                  }, 400);
                  setTimeout(() => {
                    setIsloading(false);
                  }, 300);
                    
                
                console.log(data);
                
              })
              .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
              });

        }, []);
            
    function handleUsecontent(){
      var content = document.getElementById("content-textarea").textContent
      props.useOcrcontent(content)
    }
        
    return(
        <>
        <div  className={`popup-ocr`}>
            {isloading === false && (
                <>
                <div className="div-popup-title">
                <span style={{fontSize:"1.4rem" , marginLeft:"1.3vw"}}> OCR Detection</span>
                <button  className="btn-popup-close" onClick={props.closewindow}>X</button>
                </div>
                <iframe style={{width:"44vw" , height: "80vh" , marginTop: "1vh", marginLeft:"1vw", border:"3px solid black", overflow: "auto"}} title="ocr" src="http://localhost:3000/OCR"></iframe>
                <div style={{float:"right"}}>
                <span style={{position: "absolute" , marginLeft: "0.7vw"}}>Content:</span>
                <textarea id="content-textarea" style={{ height:"70vh" , width:"33vw" , marginRight:"1vw", marginTop:"6vh"}} className="pop-textarea">
                    </textarea>
                    <button style={{position:"absolute", top:"81vh", right:"12vw", width:"10vw"}} className="pop-button" onClick={() => handleUsecontent()}>Use This Content</button>
                    </div>
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