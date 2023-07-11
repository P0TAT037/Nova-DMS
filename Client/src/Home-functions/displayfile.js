import data from "../Endpoint-url.json"
function Showfile(props){
    var fileurl = "";
    var versionfile = "";
        if(props.clicked !== false){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (this.readyState === 4 && this.status === 200) {
                fileurl = this.responseText
                console.log(fileurl)
                document.getElementById("iframe").innerHTML=`<iframe src="${fileurl}" style="height:84vh;width:64vw;" title="description"></iframe>`
              }
            }
            xhttp.open("GET", process.env.REACT_APP_ENDPOINT_URL +`node?id=${props.fileid}` , true);
            xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
            xhttp.send();
          }
          
          else if(props.versionclicked !== null){
            var xhttp2 = new XMLHttpRequest();
            xhttp2.onreadystatechange = function() {
              if (this.readyState === 4 && this.status === 200) {
                const rawfile = this.responseText
                const blob = new Blob([rawfile], { type: `${props.filetype}` }); 
                const url = URL.createObjectURL(blob);
                console.log(url);
                document.getElementById("iframeversion").innerHTML=`<iframe src="${url}" style="height:84vh;width:64vw;" title="description"></iframe>`
              }
            }
            xhttp2.open("GET", process.env.REACT_APP_ENDPOINT_URL +`${props.versionclicked}?id=${props.idOfGetversion}` , true);
            xhttp2.setRequestHeader("Authorization", `Bearer ${props.token}`);
            xhttp2.send();
          }
    return(
      <>
        {props.clicked !== false && (<>
        <div className="div-showfile-popup z-index-2" >
        <div className="div-popup-title">
                 <span className="pop-span" style={{fontSize:"1.2rem" , marginLeft:"1.3vw" , color: "white"}}> File name</span>
                 <button className="btn-popup-close" onClick={() => props.onClick(false)}>X</button>
                </div>
            
            <div id="iframe"></div>
        </div>
        </>)}
        {
          props.versionclicked !== null && (
        <div className="div-showfile-popup z-index-2" >
            <button className="btn-popup-close" onClick={() => props.closeversiondisplay(null)}>X</button>
            <div id="iframeversion"></div>
        </div>
          )
        }
        </>
        
        
    )
}
export {Showfile}