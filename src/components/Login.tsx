import React, { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getEnv } from '../utils/getEnv';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const { apiUrl } = getEnv();
  const navigate = useNavigate();

  useEffect(() => {
    const loadReCAPTCHAScript = () => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=6LfwFfwpAAAAAD6hRv66k4ODK_iPIWrnM-aDMqoZ`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    loadReCAPTCHAScript();
  }, []);

  const handleCaptcha = async () => {
    if ((window as any).grecaptcha) {
      const token = await (window as any).grecaptcha.execute(
        "6LfwFfwpAAAAAD6hRv66k4ODK_iPIWrnM-aDMqoZ",
        { action: "login" }
      );
      setCaptchaToken(token);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleCaptcha();
    if (!captchaToken) {
      setError('Please complete the CAPTCHA');
      return;
    }

    console.log('Sending login request with email:', email, 'and password:', password);

    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        email,
        password,
        captcha: captchaToken
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
