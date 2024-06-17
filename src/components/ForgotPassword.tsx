import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { getEnv } from '../utils/getEnv';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const { apiUrl } = getEnv();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
      setMessage('Password reset email sent.');
    } catch (error) {
      setMessage('Error sending password reset email.');
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <button type="submit">Send Password Reset Email</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
