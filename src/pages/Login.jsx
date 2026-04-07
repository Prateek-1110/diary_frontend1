import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ServerWarmupDialog from "../components/ServerWarmupDialog";
import useAuthStore from "../store/authStore";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [warming, setWarming]   = useState(false);
  const [loading, setLoading]   = useState(false);   // ← added

  const { setAuth } = useAuthStore();        // ← match your actual store
  const navigate = useNavigate();

  const handleSubmit = async (e) => {                 // ← renamed to match form
    e.preventDefault();
    setError("");
    setLoading(true);

    const warmupTimer = setTimeout(() => setWarming(true), 3000);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login/`,  // ← VITE_API_URL
        { username, password },
        { withCredentials: true }
      );
      clearTimeout(warmupTimer);
      setWarming(false);
      setLoading(false);
     setAuth(res.data.user ?? { username }, res.data.access);            // ← store the JWT
      navigate("/");
    } catch (err) {
      clearTimeout(warmupTimer);
      setWarming(false);
      setLoading(false);
      if (!err.response) {
        setError("Server took too long to respond. Please try again.");
      } else {
        setError("Invalid username or password.");
      }
    }
  };

 return (
  <>
    <ServerWarmupDialog visible={warming} />
    <div className="login-root">
      <div className="login-left">
        <div className="login-brand">ours</div>
        <p className="login-tagline">your little world,<br />together.</p>
      </div>

      <div className="login-right">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="login-heading">Welcome back</h2>
          <p className="login-sub">Sign in to your shared space</p>

          <div className="login-field">
            <label className="login-label">Username</label>
            <input
              type="text"
              placeholder="your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="login-input"
            />
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  </>
);
}