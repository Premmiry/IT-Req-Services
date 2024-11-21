import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import Navbar from './components/Navbar';
import RequestForm from './components/component-all/Paper/RequestForm';
import RequestList from './components/component-all/Paper/RequestList';
import RequestListIT from './components/component-all/Paper/RequestListIT';
import Login from './components/component-all/Login/Login';
import NoUser from './components/component-all/Login/NoUser';
import RequestDetail from './components/component-all/Paper/RequestDetail';
import UAT from './components/component-all/ContentTypeR/boxUAT';
import { SelectPriority } from './components/component-all/Select/select-priority'
import Boxsubtask from './components/component-all/Paper/SubtaskList';
function App() {
  return (
    <UserProvider>
      <Router>
      <br />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="request-list" element={
          <>
            <Navbar />
            <br />
            <RequestList/> 
          </>
        } />
        <Route path="request-list-it" element={
          <>
            <Navbar />
            <br />
            <RequestListIT/> 
          </>

        } />
        <Route path="/request" element={
          <>
            <Navbar />
            <br />
            <RequestForm />
          </>
        }  />
        <Route path="/edit-request/:id" element={
          <>
            <Navbar />
            <br />
            <RequestForm />
          </>
        } />
        <Route path="/request-detail/:id" element={<RequestDetail id={0} />} />
        <Route path="/nouserad" element={<NoUser type="AD" />} />
        <Route path="/nouseryh" element={<NoUser type="YH" />} />
        <Route path="/boxUAT/:id" element={<UAT id={0} username={''} department={0} status={0} />} />
        <Route path="/priority/:id" element={<SelectPriority id={0} id_priority={0} />} />
        <Route path="/subtask" element={<Boxsubtask />} />
      </Routes>
      <br />
      {/* <Footer /> */}
    </Router>
    </UserProvider>
  );
}

export default App;