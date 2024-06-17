import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getEnv } from '../utils/getEnv';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const { apiUrl } = getEnv();

  // Log token to verify it's being received
  console.log("Received token:", token);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/auth/reset-password/${token}`, { password });
      setMessage('Password has been reset');
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Error resetting password');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
