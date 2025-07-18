import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import GroupsManagement from './pages/admin/GroupsManagement';
import NewsManagement from './pages/admin/NewsManagement';
import MaterialsManagement from './pages/admin/MaterialsManagement';
import News from './pages/portal/News';
import Materials from './pages/portal/Materials';
import Simulator from './pages/portal/Simulator';
import PowerBI from './pages/portal/PowerBI';
import FormProposal from './pages/portal/FormProposal';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/PublicLayout';
import UserPortalLayout from './components/UserPortalLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><UsersManagement /></ProtectedRoute>} />
        <Route path="/admin/groups" element={<ProtectedRoute><GroupsManagement /></ProtectedRoute>} />
        <Route path="/admin/news" element={<ProtectedRoute><NewsManagement /></ProtectedRoute>} />
        <Route path="/admin/materials" element={<ProtectedRoute><MaterialsManagement /></ProtectedRoute>} />
        <Route path="/portal" element={<ProtectedRoute><UserPortalLayout /></ProtectedRoute>}>
          <Route index element={<News />} />
          <Route path="materials" element={<Materials />} />
          <Route path="simulator" element={<Simulator />} />
          <Route path="powerbi" element={<PowerBI />} />
          <Route path="form" element={<FormProposal />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
