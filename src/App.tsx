import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RequestForm from './components/component-all/Paper/RequestForm';
import RequestList from './components/component-all/Paper/RequestList';
import RequestListIT from './components/component-all/Paper/RequestListIT';
import Login from './components/component-all/Login/Login';
import NoUser from './components/component-all/Login/NoUser';
import RequestDetail from './components/component-all/Paper/RequestDetail';
import UAT from './components/component-all/ContentTypeR/boxUAT';
import Priority from './components/component-all/ContentTypeR/boxAssignedP';
function App() {
  return (
    <Router>
      <Navbar />
      <br />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="request-list" element={<RequestList />} />
        <Route path="request-list-it" element={<RequestListIT />} />
        <Route path="/request" element={<RequestForm />}  />
        <Route path="/edit-request/:id" element={<RequestForm />} />
        <Route path="/request-detail/:id" element={<RequestDetail id={0} />} />
        <Route path="/nouserad" element={<NoUser type="AD" />} />
        <Route path="/nouseryh" element={<NoUser type="YH" />} />
        <Route path="/boxUAT/:id" element={<UAT id={0} username={''} department={0} status={0} />} />
        <Route path="/priority/:id" element={<Priority id={0} username={''} department={0} status={0} />} />
      </Routes>
      <br />
      {/* <Footer /> */}
    </Router>
  );
}

export default App;