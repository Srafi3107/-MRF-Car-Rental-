import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./Dashboard.css";

function ManageCars() {
  return (
    <div className="app-layout">
      <Sidebar role="ADMIN" />
      <div className="content-area">
        <Navbar />
        <main className="page-content">
          <h2>Manage Cars</h2>

          <form className="car-form">
            <input type="text" placeholder="Car Name" />
            <input type="text" placeholder="Type" />
            <input type="number" placeholder="Price / Day" />
            <button type="submit">Add Car</button>
          </form>

          <table className="data-table">
            <thead>
              <tr>
                <th>Car Name</th>
                <th>Price / Day</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Toyota Corolla</td>
                <td>₹1800</td>
                <td>Available</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}

export default ManageCars;
