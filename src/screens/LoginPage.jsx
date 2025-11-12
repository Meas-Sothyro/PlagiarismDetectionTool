import { useState } from 'react';
import { toast } from 'react-toastify';
import '../css/login.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      const data = await res.json();
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('userRole', data.role); // "admin" or "user"
      onLogin(data.role); // You can still pass it if needed
      navigate("/");
    } else {
      toast.error('Invalid username or password');
    }
  } catch (error) {
    console.error('Login error:', error);
    toast.error('Login request failed');
    }
  };

  return (
    <div className="login-container">
      <img src="/images/moeys.png" alt="Platform Logo" />
      <h1>Plagiarism Checker Platform</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input type="submit" value="Login" />
      </form>
    </div>
  );
};

export default LoginPage;
