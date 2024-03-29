import {Route,Routes} from 'react-router-dom';
import {Home} from'../Containers/HomepageContainer.js';
import Notfound from '../Misc/Notfound.js'
import LoginPageContainer from '../Containers/LoginpageContainer.js';
import OCROutput from '../Tests/test.js';
function App() {
    return (
      <div>
        <Routes>
          <Route path="/home" element={<Home/>}/>
          <Route path='/' element={<LoginPageContainer/>}/>
          <Route path='*' element={<Notfound/>}/>
          <Route path='/OCR' element={<OCROutput />}/>
        </Routes>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    );
  
  };

export default App;