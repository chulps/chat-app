import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getEnv } from '../utils/getEnv';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { apiUrl } = getEnv();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/auth/register`, {
        username,
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error}</p>}
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
