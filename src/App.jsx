import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './screens/UploadPage';
import ToastMaster from './components/ToastContainer';
import LoginPage from './screens/LoginPage';
import { useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute'
import UploadNewPage from './screens/NewUpload';
import StorageDashboard from './screens/StorageDashboard';

function App() {
  const universitiesList = ['Harvard', 'MIT', 'Stanford'];

  const [userRole, setUserRole] = useState(() => {
    return sessionStorage.getItem('userRole') || null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = sessionStorage.getItem('isAuthenticated');
    return storedAuth === 'true';
  });

  const handleLogin = (role) => {
  setIsAuthenticated(true);
  setUserRole(role);
  sessionStorage.setItem('isAuthenticated', 'true');
  sessionStorage.setItem('userRole', role);
  };

  return (
    <Router>
      <ToastMaster />
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UploadPage userRole={userRole} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UploadPage userRole={userRole} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-upload"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UploadNewPage universities={universitiesList} userRole={userRole} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/storage"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <StorageDashboard userRole={userRole} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
