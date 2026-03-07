import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="page container narrow">
    <section className="empty-state">
      <h1>404</h1>
      <h3>Page not found</h3>
      <p>The destination you requested is unavailable.</p>
      <Link className="btn btn-primary" to="/">
        Back to home
      </Link>
    </section>
  </div>
);

export default NotFoundPage;
