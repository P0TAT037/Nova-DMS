function Showfile(props){
    var fileurl = ""
        if(props.clicked !== false){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (this.readyState === 4 && this.status === 200) {
                console.log(this.responseText);
                fileurl = this.responseText
                document.getElementById("iframe").innerHTML=`<iframe src="${fileurl}" style="height:84vh;width:64vw;" title="description"></iframe>`
              }
            }
            xhttp.open("GET", `https://localhost:7052/node?id=${props.fileid}` , true);
            xhttp.setRequestHeader("Authorization", `Bearer ${props.token}`);
            xhttp.send();
          }
          

    return(
        props.clicked !== false &&
        <div className="div-showfile-popup z-index-2" >
            <button className="btn-popup-close" onClick={() => props.onClick(false)}>X</button>
            <div id="iframe"></div>
        </div>
        
    )
}
export {Showfile}