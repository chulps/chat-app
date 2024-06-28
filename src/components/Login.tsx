<<<<<<< HEAD
import React, { useState, FormEvent } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getEnv } from "../utils/getEnv";
import styled from "styled-components";

const LoginScreen = styled.div`
  display: flex;
  flex-direction: column;
  max-width: var(--space-7);
  margin: 0 auto;
  gap: var(--space-3);
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding-top: var(--space-2);
`;

const ErrorMessage = styled.data`
  color: var(--danger-400);
  padding-top: var(--space-1);
  padding-bottom: var(--space-2);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-1);
  flex-wrap: wrap;
  width: 100%;
  margin: 0 auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: var(--space-3);
  padding-top: var(--space-2);
  align-items: center;

  @media screen and (min-width: 768px) {
    flex-direction: row;
  }
`;

const HorizontalDivider = styled.hr`
  width: 100%;
`

const SignUp = styled.p`
  text-align: center;
`


const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
=======
import React, { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getEnv } from '../utils/getEnv';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
>>>>>>> origin/video-chat-frontend
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
<<<<<<< HEAD
    console.log(
      "Sending login request with email:",
      email,
      "and password:",
      password
    );
=======
    await handleCaptcha();
    if (!captchaToken) {
      setError('Please complete the CAPTCHA');
      return;
    }

    console.log('Sending login request with email:', email, 'and password:', password);
>>>>>>> origin/video-chat-frontend

    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        email,
        password,
        captcha: captchaToken
      });
      console.log("Login successful:", response.data);
      login(response.data.token);
      if (response.data.isProfileComplete) {
        navigate("/dashboard");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Error during login:",
          err.response ? err.response.data : err.message
        );
      } else {
        console.error("Error during login:", err);
      }
      setError("Invalid email or password");
    }
  };

  return (
    <LoginScreen>
      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <h2>Login</h2>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="•••••••••••••"
            required
          />
        </div>
        <ButtonContainer>
          <a href="/#/forgot-password">Forgot Password?</a>
          <button type="submit">Login</button>
        </ButtonContainer>
      </Form>
      <HorizontalDivider />
      <SignUp>
        Don't have an account? <Link to="/register">Sign up!</Link>
      </SignUp>
    </LoginScreen>
  );
};

export default Login;
