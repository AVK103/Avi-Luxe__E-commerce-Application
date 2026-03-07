const Spinner = ({ label = "Loading..." }) => (
  <div className="spinner-wrap" role="status">
    <span className="spinner" />
    <p>{label}</p>
  </div>
);

export default Spinner;
