const EmailInput = ({ email, setEmail }) => {
  return (
    <div className="form-group">
      <label htmlFor="email">Notification Email: </label>
      <input
        type="email"
        id="email"
        className="form-control decorated-input"
        value={email}
        placeholder="Enter Email Address"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>
  );
};

export default EmailInput;
