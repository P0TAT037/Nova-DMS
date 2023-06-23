import { useState } from "react";
import { useEffect } from "react";
function Imageenhancement(props){
    const [loading,setIsloading] = useState(true);
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
    const imageElement = document.createElement("img-div");
    imageElement.src = imageUrl;
              }, 300);
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });

    }, []);
    return(
        <>
        <div  className={`popup-ocr`}>
            {loading === false && (
                <>
                <div className="div-popup-title">
                <span style={{fontSize:"1.4rem" , marginLeft:"1.3vw"}}> Image enhancement</span>
                <button  className="btn-popup-close" onClick={props.closewindow}>X</button>
                </div>
                <img id="img-div">

                </img>
                    <button style={{position:"absolute", top:"81vh", right:"12vw", width:"10vw"}} className="pop-button" >Use This Image</button>
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