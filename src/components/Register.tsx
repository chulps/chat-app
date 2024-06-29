import React, { useState, FormEvent } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { getEnv } from "../utils/getEnv";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: var(--space-7);
  margin: 0 auto;
  gap: var(--space-2);
`;

const ErrorMessage = styled.div`
  color: var(--danger-400);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: var(--space-3);
  padding-top: var(--space-2);

  @media screen and (min-width: 768px) {
    flex-direction: row;
  }
`;

const TermsAndConditions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding-inline-start: var(--space-2);
  input {
    width: unset;
  }
`;

const GoToLogin = styled.div`
  display: flex;
  justify-content: center;
`;

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { apiUrl } = getEnv();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const isFormValid = () => {
    return (
      username &&
      email &&
      password &&
      validateEmail(email) &&
      validatePassword(password) &&
      agreeTerms
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!agreeTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long");
      return;
    }



    try {
      const response = await axios.post(`${apiUrl}/api/auth/register`, {
        username,
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/profile"); // Redirect to profile creation after registration
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.msg || "Registration failed. Please try again.";
        setError(errorMessage);
      } else {
        setError("Registration failed");
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <h1>Create an account</h1>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          placeholder="@example"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          placeholder="email@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          placeholder="•••••••••••••"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <ButtonContainer>
        <TermsAndConditions>
          <input
            id="agreeTerms"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
          />
          I agree to the <Link to="/terms-and-conditions">terms and conditions</Link>
        </TermsAndConditions>
        <button type="submit"  disabled={!isFormValid()}>
          Register
        </button>
      </ButtonContainer>
      <hr style={{ marginBlock: "var(--space-2)" }} />
      <GoToLogin>
        Already have an account?&nbsp;<Link to="/login">Login</Link>
      </GoToLogin>
    </Form>
  );
};

export default Register;
