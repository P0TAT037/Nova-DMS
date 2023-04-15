import {Route,Routes} from 'react-router-dom';
import {Home} from'./HomeComponent.js';
import Notfound from './Notfound.js'
import LoginPageContainer from './LoginpageContainer.js';
function App() {
    return (
      <div>
        <Routes>
          <Route path="/home" element={<Home/>}/>
          <Route path='/' element={<LoginPageContainer/>}/>
          <Route path='*' element={<Notfound/>}/>
        </Routes>
      </div>
    );
  
  };

export default App;