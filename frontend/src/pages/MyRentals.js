import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./MyRentals.css";

function MyRentals() {
  const [rentals, setRentals] = useState([]);

  // Fetch rentals for logged-in user
  const fetchRentals = () => {
    const userData = localStorage.getItem("user");
    if (!userData) return;

    const user = JSON.parse(userData);

    fetch(`http://localhost:8080/myrentals?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched rentals:", data);
        setRentals(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  // Complete a rental
  const completeRental = (carName) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    fetch("http://localhost:8080/completeRental", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, carName }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to complete rental");
        return res.text();
      })
      .then(() => {
        // Update rentals after completion
        fetchRentals();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar role="CUSTOMER" />

      {/* Main content */}
      <div className="content-area">
        <Navbar />

        <main className="page-content">
          <h2 className="page-title">My Rentals</h2>

          {rentals.length === 0 ? (
            <p className="no-rentals">You haven't rented any cars yet.</p>
          ) : (
            <div className="rentals-table-container">
              <table className="rentals-table">
                <thead>
                  <tr>
                    <th>Car</th>
                    <th>Days</th>
                    <th>Total (৳)</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {rentals.map((r, index) => (
                    <tr key={index}>
                      <td>{r.carName}</td>
                      <td>{r.days}</td>
                      <td className="money">{r.total}</td>
                      <td>
                        <span
                          className={`status ${
                            r.status === "ACTIVE" ? "active" : "completed"
                          }`}
                        >
                          {r.status}
                        </span>

                        {r.status === "ACTIVE" && (
                          <button
                            className="complete-btn"
                            onClick={() => completeRental(r.carName)}
                          >
                            Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default MyRentals;
