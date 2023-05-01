import { useState } from "react";

function Uploadfunc(info){
    const formData = new FormData();
    const [ispressed,setIspressed] = useState(false);

    function handlebuttonclick(){
        setIspressed(true);
        //console.log(info.level,info.dir,info.id)
        
    }
    function handleexitclick(){
        setIspressed(false);
    }
    function handleFileChange(event) {
        const file = event.target.files[0];
        console.log(file.type,file.name);
        document.getElementById("upload-file-name").value=file.name;
        formData.append("file", file);
        //console.log(formData);
    }
    function handleuploadclick(){
    formData.append("UserId", "0");
    formData.append("Dir", "/");
    formData.append("Name", "test5");
    formData.append("Description", "test objecto 5");
    formData.append("Type", "image/png");
    formData.append("Content", "imaaagee");
    formData.append("DefaultPerm", "true");

    fetch("https://localhost:7052/node", {
        method: "POST",
        headers: {
            "accept": "*/*",
          "Authorization": `Bearer ${info.token}`,
          "Content-Type": "multipart/form-data"
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    }
    //this was used to test the api, but it sends back "bad request"

    

    
    return(
        
        <div>
            <button onClick={handlebuttonclick}>+</button>
            {ispressed !== false &&(
            <div className="div-popup z-index-2">
                <input type="file" onChange={handleFileChange}></input>
                <button className="btn-popup-close" onClick={handleexitclick}>X</button>
                <br></br>
                File Name: <input id ="upload-file-name" type="text"></input>
                <br></br>
                Description: <input type="text"></input>
                <br></br>
                Content: <input type="text"></input>
                {info.level !== "0" &&(
                    <div>
                    <input type="radio" id="read-radio" name="age" value="30"></input>
                    <label htmlFor="age1">Read </label>
                    <br></br>
                    <input type="radio" id="write-radio" name="age" value="60"></input>
                    <label htmlFor="age2">Write </label>
                    <br></br>
                    <input type="radio" id="rw-radio" name="age" value="100"></input>
                    <label htmlFor="age3">Read and Write </label>
                    <br></br>
                    <button onClick={handleuploadclick}>Upload</button>
                    </div>
                )}
                    
                    
            </div>
        )}
        </div>
        
    );
}

export default Uploadfunc;