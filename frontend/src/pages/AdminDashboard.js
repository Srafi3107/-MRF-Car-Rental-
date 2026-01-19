import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./AdminDashboard.css";

function AdminDashboard() {

  const cars = [
    { id: 1, name: "Toyota Corolla", price: 1800, status: "Available" },
    { id: 2, name: "Hyundai Creta", price: 2500, status: "Rented" },
    { id: 3, name: "Maruti Swift", price: 1400, status: "Available" }
  ];

  const bookings = [
    { id: 1, customer: "Alice", car: "Toyota Corolla", days: 3, status: "Active" },
    { id: 2, customer: "Bob", car: "Hyundai Creta", days: 2, status: "Completed" }
  ];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar role="ADMIN" />

      {/* Main content */}
      <div className="content-area">
        {/* Navbar */}
        <Navbar />

        <main className="page-content">

          {/* METRICS */}
          <section className="metrics">
            <div className="metric">
              <span>Total Cars</span>
              <h2>{cars.length}</h2>
            </div>

            <div className="metric">
              <span>Total Bookings</span>
              <h2>{bookings.length}</h2>
            </div>

            <div className="metric">
              <span>Active Rentals</span>
              <h2>{bookings.filter(b => b.status === "Active").length}</h2>
            </div>
          </section>

          {/* MANAGE CARS */}
          <section className="cars-section">
            <header>
              <h1>Manage Cars</h1>
              <p>View and manage all cars in the fleet</p>
            </header>

            <div className="car-grid-table">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Car Name</th>
                    <th>Price / Day</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map(car => (
                    <tr key={car.id}>
                      <td>{car.name}</td>
                      <td>₹{car.price}</td>
                      <td>{car.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* BOOKINGS */}
          <section className="cars-section">
            <header>
              <h1>Recent Bookings</h1>
              <p>View all recent bookings</p>
            </header>

            <div className="car-grid-table">
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
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td>{b.customer}</td>
                      <td>{b.car}</td>
                      <td>{b.days}</td>
                      <td>
                        <span className={`status ${b.status === "Active" ? "active" : "inactive"}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
