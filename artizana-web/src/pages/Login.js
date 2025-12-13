// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Use same style as SignUp: API base from env + /api prefix
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("buyer@example.com");
  const [password, setPassword] = useState("Password123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Login failed");
        return;
      }

      // store token + user for later use (role-based redirects etc)
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      setUser(data.user);

      // KAN-6: redirect to role-specific dashboard AFTER successful login
      const role = data.user?.role;

      if (role === "Buyer") navigate("/buyer-dashboard", { replace: true });
      else if (role === "Artisan") navigate("/artisan-dashboard", { replace: true });
      else if (role === "NGO/Edu Partner") navigate("/ngo-dashboard", { replace: true });
      else setError("Unknown role. Contact support.");
    } catch (err) {
      console.error("Login request failed", err);
      setError("Could not connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  // After successful login, show a simple success card
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
          <p className="text-sm text-gray-700">
            You are logged in as <b>{user.role}</b>
          </p>
        </div>
      </div>
    );
  }

  // Default login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-4">Artizana Login</h1>
        <p className="text-sm text-gray-600 mb-6">
          Log in to manage your Artizana account.
        </p>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="buyer@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Password123"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-gray-50"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded-full hover:bg-green-600 disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
