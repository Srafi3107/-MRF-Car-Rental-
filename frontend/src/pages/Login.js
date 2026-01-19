import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// Import local image
import loginImage from "../assets/car.jpg";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }) // or username/password if your backend uses that
    });

    if (!response.ok) {
      alert("Login failed");
      return;
    }

    const user = await response.json();

    // ✅ Save the full user info in localStorage, including email
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,  // important for My Rentals
        role: user.role
      })
    );

    // Navigate based on role
    if (user.role === "ADMIN") navigate("/admin");
    else navigate("/customer");

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};


  return (
    <div className="login-page">

      {/* LEFT */}
      <div className="login-left">
        <div className="login-box">
          <h1>Car Rental System</h1>
          <p>Login to continue</p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>Login</button>
        </div>
      </div>

      {/* RIGHT */}
      <div
        className="login-right"
        style={{ backgroundImage: `url(${loginImage})` }}
      ></div>

    </div>
  );
}

export default Login;
