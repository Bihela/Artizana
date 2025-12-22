// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

// Use same style as SignUp: API base from env + /api prefix
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/api";

function Login() {


  const [email, setEmail] = useState("buyer@example.com");
  const [password, setPassword] = useState("Password123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const idToken = credential.idToken; // Send Google ID Token, not Firebase ID Token

      const response = await fetch(`${API_BASE_URL}/auth/google-web`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Google login failed");
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      setUser(data.user);

      // Redirect logic
      if (!data.user.role) {
        // New user needing role selection
        navigate(`/complete-profile?token=${data.token}`);
      } else {
        const from = location.state?.from?.pathname ||
          (data.user.role === 'Buyer' ? '/buyer-dashboard' : '/artisan-dashboard');
        navigate(from);
      }

    } catch (err) {
      console.error("Google login error", err);
      setError(err.message || "Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

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

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 p-2 rounded-full hover:bg-gray-50 transition shadow-sm text-sm font-medium text-gray-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
