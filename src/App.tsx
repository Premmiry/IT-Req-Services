import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Content from './components/Content';
import Footer from './components/Footer';
import Services from './components/it-services/ITServices';
import ITHardware from './components/ITHardware';
import ITDevelopment from './components/ITDevelopment';
import DataGridUAT from './components/DataGridUAT';
import ListServices from './components/it-services/ListServices';
import ServiceDetails from './components/it-services/ServiceDetails';
import ITAdminForm from './components/it-services/ITAdminForm';
import ManagerApprovePage from './components/it-services/ManagerApprove';
import TaskManagementMockup from './components/it-services/task-management';
import Manager_Approve from './components/it-services/ITManage_Approve';
import Openjob from './components/it-services/IT_OpenJob';
import Closejob from './components/it-services/IT_CloseJob';


function App() {
  return (
    <Router>
      <Navbar />
      <br />
      <Routes>
      ITManage_Approve.tsx
        <Route path="/" element={<ListServices />} />
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
      </Routes>
      <br />
      {/* <Footer /> */}
    </Router>
  );
}

export default App;