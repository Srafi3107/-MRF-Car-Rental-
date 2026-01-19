import { useState } from "react";
import "./CarCard.css";

function CarCard({ car }) {
  const [days, setDays] = useState(1);

  const total = days * car.price;

  const handleRent = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch("http://localhost:8080/rent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: user.email,
        carName: car.name,
        days: days
      })
    })
      .then(res => res.text())
      .then(msg => alert("Car rented successfully"))
      .catch(err => console.error(err));
  };

  return (
    <div className="car-card">
      <img src={car.image} alt={car.name} />

      <div className="car-info">
        <h3>{car.name}</h3>
        <p className="type">{car.type}</p>

        <div className="price-row">
          <span>৳{car.price} / day</span>
        </div>

        {/* DAYS SELECT */}
        <div className="days-row">
          <label>Days</label>
          <input
            type="number"
            min="1"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          />
        </div>

        {/* TOTAL */}
        <div className="total-row">
          <span>Total</span>
          <strong>৳{total}</strong>
        </div>

        <button className="rent-btn" onClick={handleRent}>
          Rent Now
        </button>
      </div>
    </div>
  );
}

export default CarCard;
