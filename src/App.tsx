import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RequestForm from './components/component-all/Paper/RequestForm';
import RequestList from './components/component-all/Paper/RequestList';
import RequestListIT from './components/component-all/Paper/RequestListIT';
import Login from './components/component-all/Login/Login';
import NoUser from './components/component-all/Login/NoUser';
import RequestDetail from './components/component-all/Paper/RequestDetail';

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
        <Route path="/request-detail/:id" element={<RequestDetail />} />
        <Route path="/nouserad" element={<NoUser type="AD" />} />
        <Route path="/nouseryh" element={<NoUser type="YH" />} />
      </Routes>
      <br />
      {/* <Footer /> */}
    </Router>
  );
}

export default App;