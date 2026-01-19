import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CarCard from "../components/CarCard";
import "./Dashboard.css";

function CustomerDashboard() {
  const cars = [
    {
      id: 1,
      name: "Toyota Corolla",
      type: "Sedan • Petrol • Manual",
      price: 1000,
      image: "https://images.unsplash.com/photo-1626072557464-90403d788e8d"
    },
    {
      id: 2,
      name: "Hyundai Creta",
      type: "SUV • Diesel • Automatic",
      price: 1500,
      image: "https://images.unsplash.com/photo-1748214547184-d994bfe53322"
    },
    {
      id: 3,
      name: "Maruti Swift",
      type: "Hatchback • Petrol • Manual",
      price: 800,
      image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a"
    }
  ];

  return (
    <div className="app-layout">
      {/* Sidebar fixed left */}
      <Sidebar role="CUSTOMER" />

      {/* Main content area */}
      <div className="content-area">
        {/* Navbar fixed on top */}
        <Navbar />

        {/* Page content */}
        <main className="page-content">


          {/* CARS */}
          <section className="cars-section">
            <header>
              <h1>Available Cars</h1>
              <p>Select a car and rent instantly</p>
            </header>

            <div className="car-grid">
              {cars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

export default CustomerDashboard;
