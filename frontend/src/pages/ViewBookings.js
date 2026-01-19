import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./Dashboard.css";

function ViewBookings() {
  return (
    <div className="app-layout">
      <Sidebar role="ADMIN" />
      <div className="content-area">
        <Navbar />
        <main className="page-content">
          <h2>View Bookings</h2>

          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Car</th>
                <th>Days</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Alice</td>
                <td>Toyota Corolla</td>
                <td>3</td>
                <td>Active</td>
              </tr>
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}

export default ViewBookings;
