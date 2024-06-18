import './App.css';
import { Route,Routes } from 'react-router-dom';
import Manager_login from './components/login/Manager_login';
import Tester_login from './components/login/Tester_login';
import Manager_work from './components/Manager/Manager_pages/Manager_work';
import Manager_home from './components/Manager/Manager_pages/Manager_home';
import Manager_requests from './components/Manager/Manager_pages/Manager_requests';
import Manager_customers from './components/Manager/Manager_pages/Manager_customers';
import Manager_testers from './components/Manager/Manager_pages/Manager_testers';
import Manager_completed from './components/Manager/Manager_pages/Manager_completed';
import Tester_home from './Tester/Tester_pages/Tester_home'
import Tester_details from './Tester/Tester_pages/Tester_details';
import Tester_bugCreate from './Tester/Tester_pages/Tester_bugCreate';
import Tester_bugManagement from './Tester/Tester_pages/Tester_bugManagement';


function App() {
  return (
    <Routes>
      <Route path='/' element={<Tester_login/>}/>
      <Route path='/Manager_login' element={<Manager_login/>}/>
      <Route path='/Tester_login' element={<Tester_login/>}/>
      <Route path='/Manager_work' element={<Manager_work/>}/>
      <Route path='/Manager_home' element={<Manager_home/>}/>
      <Route path='/Manager_completed' element={<Manager_completed/>}/>
      <Route path='/Manager_testers' element={<Manager_testers/>}/>
      <Route path='/Manager_customers' element={<Manager_customers/>}/>
      <Route path='/Manager_requests' element={<Manager_requests/>}/>
      <Route path='/Tester_home' element={<Tester_home/>}/>
      <Route path='/Tester_details' element={<Tester_details/>}/>
      <Route path="/Tester_bugCreate" element={<Tester_bugCreate/>}/>
      <Route path='/Tester_bugManagement' element={<Tester_bugManagement/>}/>


    </Routes>
  );
}

export default App;
