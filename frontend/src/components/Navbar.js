import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        {user && (
          <div className="user-info">
            <span className="username">{user.username}</span>
            <span className="role">{user.role}</span>
          </div>
        )}

        <div className="avatar">
          {user?.username?.charAt(0)}
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
