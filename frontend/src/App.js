import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';


import Profile from './pages/Profile';

const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};


const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {user && <Sidebar />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: user ? '250px' : '0' }}>
        {user && <TopBar />}
        <div style={{ flex: 1, padding: '20px', background: '#f8fafc' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <PrivateRoute role="ADMIN">
                <AdminDashboard />
              </PrivateRoute>
            } />

            {/* Customer Routes */}
            <Route path="/dashboard/*" element={
              <PrivateRoute role="CUSTOMER">
                <CustomerDashboard />
              </PrivateRoute>
            } />

            {/* Profile Route */}
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />

            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
