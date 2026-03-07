import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const result = await login(email, password);

    if (result.success) {
      setMessage("Welcome back.");
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="page container narrow">
      <section className="auth-panel">
        <h1>Login</h1>
        <p>Access your premium shopping dashboard.</p>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
            />
          </label>
          <button className="btn btn-primary wide" type="submit" disabled={authLoading}>
            {authLoading ? "Signing in..." : "Login"}
          </button>
        </form>
        {error ? <p className="banner danger">{error}</p> : null}
        {message ? <p className="banner success">{message}</p> : null}
        <p className="muted">
          New here? <Link to="/register">Create account</Link>
        </p>
      </section>
    </div>
  );
};

export default LoginPage;
