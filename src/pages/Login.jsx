import { useState } from "react";
import axios from "axios";
import ServerWarmupDialog from "../components/ServerWarmupDialog";
import useAuthStore from "../store/authStore";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [warming, setWarming]   = useState(false);
  const { setAuth } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Show warmup dialog after 3s of waiting
    const warmupTimer = setTimeout(() => setWarming(true), 3000);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login/`,
        { username, password },
        { withCredentials: true }
      );
      clearTimeout(warmupTimer);
      setWarming(false);
      setAuth(res.data.user ?? { username });
      // navigate to home
    } catch (err) {
      clearTimeout(warmupTimer);
      setWarming(false);
      // "invalid credentials" during cold start = network timeout, not bad password
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
      {
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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
      }
    </>
  );
}