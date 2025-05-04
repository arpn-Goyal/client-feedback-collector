import { Routes, Route } from 'react-router-dom';
import ClientFeedbackForm from './pages/feedback/ClientFeedbackForm';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound'; // Optional 404

function App() {
  return (
    <Routes>
      <Route path="/feedback" element={<ClientFeedbackForm />} />
      {/* Optional fallback */}
      <Route path="*" element={<NotFound />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;