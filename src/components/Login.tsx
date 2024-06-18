import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getEnv } from '../utils/getEnv';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const { apiUrl } = getEnv();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Sending login request with email:', email, 'and password:', password);

    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        email,
        password,
      });
      console.log('Login successful:', response.data);
      login(response.data.token);
      if (response.data.isProfileComplete) {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Error during login:', err.response ? err.response.data : err.message);
      } else {
        console.error('Error during login:', err);
      }
      setError('Invalid email or password');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <a href="/#/forgot-password">Forgot Password?</a>
    </div>
  );
};

export default Login;
