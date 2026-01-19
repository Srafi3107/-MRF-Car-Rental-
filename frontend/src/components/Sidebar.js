import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ role }) {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      {/* LOGO */}
      <div className="sidebar-header">
        <h2>CarRent</h2>
        <p className="tagline">Dashboard</p>
      </div>

      {/* MENU */}
      <ul className="sidebar-menu">
        <li onClick={() => navigate(role === "ADMIN" ? "/admin" : "/customer")}>
          Dashboard
        </li>

        {role === "ADMIN" && (
          <>
               <li onClick={() => window.location.href = "/manage-cars"}>Manage Cars</li>
            <li onClick={() => window.location.href = "/view-bookings"}>View Bookings</li>
          </>
        )}

        {role === "CUSTOMER" && (
          <>
            <li onClick={() => navigate("/myrentals")}>My Rentals</li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
