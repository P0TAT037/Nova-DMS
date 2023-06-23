import { useState } from "react";
import { Searchbyfilters } from "../Home-functions/Searchbyfilters";
import data from '../Endpoint-url.json';
import { truncate } from "../Home-functions/truncation";


function OCROutput(info){
  const [imgWidth,setImageiwdth] = useState(0)
  const [imgheight,setImageheight] = useState(0)
  var ocr = `[{"startlocx":297,"startlocy":643,"width":591,"height":660,"content":"Disadvantages system is quite slow it taken AY total of ow minutes and how second to produces the"},{"startlocx":295,"startlocy":627,"width":593,"height":643,"content":"output of that times ow minutest and how seconds are take up bow theW character recognize"},{"startlocx":377,"startlocy":598,"width":526,"height":616,"content":"optimization of thei business Processes Via Automatic integration witl the Document"},{"startlocx":96,"startlocy":375,"width":701,"height":392,"content":"Management system admire Djedovit emir unit Dino aii Sami Omanovid and ali"},{"startlocx":95,"startlocy":353,"width":773,"height":371,"content":"Karabegovid in 2016141 thisis paper Discusses howW activities inside thei BPMtBusines process"},{"startlocx":93,"startlocy":289,"width":193,"height":307,"content":"Management while integrated with an ed's Can beA decreased duration wise based on aW data"},{"startlocx":96,"startlocy":268,"width":773,"height":284,"content":"warehouse model based on an analytical approach otis fastertcs establish connection to thew draw"},{"startlocx":96,"startlocy":247,"width":771,"height":265,"content":"witl the used and await important fieldslsl to bes filled rather than accepting filled documents tom be"},{"startlocx":96,"startlocy":225,"width":773,"height":245,"content":"uploaded also theW paper advises thai theI database becomes united between thev blow andlWWWWW ed's"},{"startlocx":96,"startlocy":205,"width":773,"height":223,"content":"father thar having separate Database odd foil all one and discusses that integration process as"},{"startlocx":96,"startlocy":183,"width":773,"height":201,"content":"what bottlenecks then performance of theW draw using automatic integration aiding the processes"},{"startlocx":95,"startlocy":163,"width":773,"height":181,"content":"performance"},{"startlocx":95,"startlocy":141,"width":771,"height":160,"content":"Results Automatic integration reduces the time needed from checking the account status to"},{"startlocx":95,"startlocy":121,"width":773,"height":138,"content":"submission of theW reauesil the entire process bow AV noticeable amount AS shown itWWWWWW fig ow"},{"startlocx":96,"startlocy":99,"width":769,"height":117,"content":"ASTEZJSJ JZGASQASGBI"},{"startlocx":95,"startlocy":32,"width":701,"height":50,"content":"film ZI rimetwll execution jaw theW proceseill are minimized zfterjl"},{"startlocx":95,"startlocy":10,"width":769,"height":28,"content":"automatic integration between bum and zDMSW systems"}]`
  var image= localStorage.getItem("thumbnail");
  var output= localStorage.getItem("ocroutput");
  var hlep = JSON.parse(output)
  var img = new Image();
  img.src = image;
  img.onload = function() {
    setImageiwdth(img.width);
    setImageheight(img.height);
  };
    return(
        
       <>
       <div style={{width: "100vw" , height: "100vh" , overflow: "auto"}}>
        {hlep.map((line, index) =>
        
    <div key={index} className="ocr-div" title={hlep[hlep.length - (index + 1)].content} style={{ marginTop: `${line.startlocy}px`, marginLeft: `${line.startlocx}px` ,width: `${line.width - line.startlocx}px`, height: `${line.height - line.startlocy}px`}}></div> 
    
    )}
    
      <img alt="" width={imgWidth} height={imgheight} src={image}></img>
      
      </div>
     
       </>
        
    );
            }
            
export default OCROutput;