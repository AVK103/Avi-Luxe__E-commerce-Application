import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, authLoading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      mobile: form.mobile,
      address: { line1: form.address },
    });

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="page container narrow">
      <section className="auth-panel">
        <h1>Create account</h1>
        <p>Join Avi Luxe and unlock premium checkout, tracking, and early drops.</p>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Full name
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </label>
          <label>
            Mobile
            <input
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
            />
          </label>
          <label>
            Address
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Street, city"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
            />
          </label>
          <button className="btn btn-primary wide" type="submit" disabled={authLoading}>
            {authLoading ? "Creating account..." : "Create account"}
          </button>
        </form>
        {error ? <p className="banner danger">{error}</p> : null}
        <p className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </div>
  );
};

export default RegisterPage;
