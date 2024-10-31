import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Services from './components/it-services/ITServices';
import ITHardware from './components/ITHardware';
import ITDevelopment from './components/ITDevelopment';
import DataGridUAT from './components/DataGridUAT';
import ListServices from './components/it-services/ListServices';
import ServiceDetails from './components/it-services/ServiceDetails';
import ITAdminForm from './components/it-services/ITAdminForm';
import ManagerApprovePage from './components/it-services/ManagerApprove';
import Manager_Approve from './components/it-services/ITManage_Approve';
import Openjob from './components/it-services/IT_OpenJob';
import Closejob from './components/it-services/IT_CloseJob';
import ITServicesComponent from './components/it-services/dashboard-component';
import ITServicesDashboard from './components/it-services/it-services-dashboard';
import RequestForm from './components/component-all/Paper/RequestForm';
import RequestList from './components/component-all/Paper/RequestList';
import Login from './components/component-all/Login/Login';
import NoUser from './components/component-all/Login/NoUser';

function App() {
  return (
    <Router>
      <Navbar />
      <br />
      <Routes>
      ITManage_Approve.tsx
        <Route path="/" element={<Login />} />
        <Route path="request-list" element={<RequestList />} />
        {/* <Route path="/" element={<TaskManagementMockup/>} /> */}
        <Route path="/list-services" element={<ListServices />} />
        <Route path="/it-services" element={<Services />} />
        <Route path="/service/:id" element={<ServiceDetails />} />
        <Route path="/it-admin" element={<ITAdminForm />} />
        <Route path="/it-manager" element={<ManagerApprovePage />} />
        <Route path="/it-manager_approve" element={<Manager_Approve />} />
        <Route path="/it-hardware" element={<ITHardware />} />
        <Route path="/it-development" element={<ITDevelopment />} />
        <Route path="/DataGridUAT" element={<DataGridUAT />}  />
        <Route path="/it_services_open" element={<Openjob />}  />
        <Route path="/it_services_close" element={<Closejob />}  />
        <Route path="/it_services_C" element={<ITServicesComponent />}  />
        <Route path="/it_services_db" element={<ITServicesDashboard />}  />
        <Route path="/request" element={<RequestForm />}  />
        <Route path="/edit-request/:id" element={<RequestForm />} />
        <Route path="/nouserad" element={<NoUser type="AD" />} />
        <Route path="/nouseryh" element={<NoUser type="YH" />} />
      </Routes>
      <br />
      {/* <Footer /> */}
    </Router>
  );
}

export default App;