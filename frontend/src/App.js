import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import MyRentals from "./pages/MyRentals";
import ManageCars from "./pages/ManageCars";
import ViewBookings from "./pages/ViewBookings";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/myrentals" element={<MyRentals />} />
        <Route path="/manage-cars" element={<ManageCars />} />
        <Route path="/view-bookings" element={<ViewBookings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
