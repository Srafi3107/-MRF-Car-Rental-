import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/common/Layout';

// Pages
import Home from './pages/Home';
import Fleet from './pages/Fleet';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ui/ErrorBoundary';

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role) {
    const userRole = user.role?.toLowerCase();
    const requiredRole = role.toLowerCase();
    if (userRole !== requiredRole) {
      return <Navigate to={userRole === 'admin' ? '/admin' : '/dashboard'} />;
    }
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/fleet" element={<Fleet />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

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

              {/* Shared Protected Routes */}
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />

              {/* Catch All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;
