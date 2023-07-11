import { useState } from "react";
import { useEffect } from "react";
function Imageenhancement(props){
    const [loading,setIsloading] = useState(true);
    const [enhancedimage , setEnhancedimage] = useState();
    const [blob,setBlob] = useState();
    const endpoint = process.env.REACT_APP_ENDPOINT_URL +'getText/enhance';
    const headers = {
        'accept': '*/*',
        'Authorization': `Bearer ${props.token}`,
      };
      const formData = new FormData();
      formData.append("image", props.image);
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
            return response.blob();
          })
          .then(data => {
            console.log(data)
            setIsloading(false);
            setTimeout(() => {
                const imageUrl = URL.createObjectURL(data);
                setBlob(data);
                document.getElementById("frame-id").src = imageUrl;
              }, 300);
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
    }, []);
    const useimage = () =>{
      let reader = new FileReader();
      reader.readAsArrayBuffer(blob);
      reader.onload = function() {
        let arrayBuffer = reader.result;
        let newBlob = new Blob([arrayBuffer], {type: blob.type});
        let newFile = new File([newBlob], "enhancedimage", {type: blob.type});
        props.useEnccontent(newFile);
      };
    }
    return(
        <>
        <div  className={`popup-ocr`}>
            {loading === false && (
                <>
                <div className="div-popup-title">
                <span style={{fontSize:"1.4rem" , marginLeft:"1.3vw"}}> Image enhancement</span>
                <button  className="btn-popup-close" onClick={props.closewindow}>X</button>
                </div>
                <iframe style={{height:"75vh" , width:"64vw" }} id = "frame-id" src=""></iframe>
                    <button style={{position:"absolute", top:"81vh", right:"12vw", width:"10vw"}} id="con-button" className="pop-button" onClick={() => {useimage();}} >Use This Image</button>
                </>
            )}
            {
            loading === true &&(
                <>
                <div className="div-popup-title">
                <span style={{fontSize:"1.4rem" , marginLeft:"1.3vw"}}> Image enhancement</span>
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
export {Imageenhancement}