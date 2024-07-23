import React, { useState, FormEvent } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBomb, faCheck } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash.debounce";
import { getEnv } from "../utils/getEnv";
import { useAuth } from "../contexts/AuthContext";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: var(--space-7);
  margin: 0 auto;
  gap: var(--space-2);
`;

const ErrorMessage = styled.div`
  color: var(--danger-400);
  font-family: var(--font-family-data);
  border-radius: 0.5em;
  font-size: var(--font-size-small);
`;

const SuccessMessage = styled.div`
  color: var(--success-400);
  font-family: var(--font-family-data);
  border-radius: 0.5em;
  font-size: var(--font-size-small);
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
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [usernameSuccess, setUsernameSuccess] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string[]>([]);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { apiUrl } = getEnv();
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters long" },
      { regex: /[0-9]/, text: "Contains at least one number" },
      { regex: /[A-Z]/, text: "Contains at least one uppercase letter" },
      { regex: /[a-z]/, text: "Contains at least one lowercase letter" },
      { regex: /[^A-Za-z0-9]/, text: "Contains at least one special character" },
    ];

    const satisfied = requirements.filter((req) => req.regex.test(password));
    const notSatisfied = requirements.filter((req) => !req.regex.test(password));

    return {
      satisfied: satisfied.map((req) => req.text),
      requirements: notSatisfied.map((req) => req.text),
    };
  };

  const checkUsername = debounce(async (username: string) => {
    try {
      const response = await axios.post(`${apiUrl}/api/auth/check-username`, { username });
      if (response.data.exists) {
        setUsernameError("Username already exists");
        setUsernameSuccess(null);
      } else {
        setUsernameError(null);
        setUsernameSuccess("Username is available");
      }
    } catch (err) {
      setUsernameError("Error checking username");
      setUsernameSuccess(null);
    }
  }, 1000);

  const checkEmail = debounce(async (email: string) => {
    try {
      const response = await axios.post(`${apiUrl}/api/auth/check-email`, { email });
      if (response.data.exists) {
        setEmailError("Email already exists");
        setEmailSuccess(null);
      } else {
        setEmailError(null);
        setEmailSuccess("Email is available");
      }
    } catch (err) {
      setEmailError("Error checking email");
      setEmailSuccess(null);
    }
  }, 1000);

  const isFormValid = () => {
    return (
      username &&
      email &&
      password &&
      !usernameError &&
      !emailError &&
      validateEmail(email) &&
      validatePassword(password).requirements.length === 0 &&
      agreeTerms
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGeneralError(null); // Reset general error message
    setTermsError(null); // Reset terms error message

    if (!agreeTerms) {
      setTermsError("You must agree to the terms and conditions");
      return;
    }

    const { satisfied, requirements } = validatePassword(password);
    if (requirements.length > 0) {
      setPasswordError("Password does not meet all requirements");
      setPasswordSuccess(satisfied);
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/auth/register`, {
        username,
        email,
        password,
      });
      login(response.data.token);
      navigate("/profile/me"); // Redirect to profile creation after registration
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.msg || "Registration failed. Please try again.";
        setGeneralError(errorMessage);
      } else {
        setGeneralError("Registration failed");
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h1>Create an account</h1>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          placeholder="@example"
          onChange={(e) => {
            setUsername(e.target.value);
            setUsernameError(null);
            setUsernameSuccess(null);
            checkUsername(e.target.value);
          }}
        />
        {usernameError && (
          <ErrorMessage>
            <FontAwesomeIcon icon={faBomb} /> {usernameError}
          </ErrorMessage>
        )}
        {usernameSuccess && (
          <SuccessMessage>
            <FontAwesomeIcon icon={faCheck} /> {usernameSuccess}
          </SuccessMessage>
        )}
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          placeholder="email@example.com"
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(null);
            setEmailSuccess(null);
            checkEmail(e.target.value);
          }}
        />
        {emailError && (
          <ErrorMessage>
            <FontAwesomeIcon icon={faBomb} /> {emailError}
          </ErrorMessage>
        )}
        {emailSuccess && (
          <SuccessMessage>
            <FontAwesomeIcon icon={faCheck} /> {emailSuccess}
          </SuccessMessage>
        )}
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          placeholder="•••••••••••••"
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(null);
            setPasswordSuccess([]);
          }}
        />
        {password && (
          <>
            {validatePassword(password).requirements.map((req) => (
              <ErrorMessage key={req}>
                <FontAwesomeIcon icon={faBomb} /> {req}
              </ErrorMessage>
            ))}
            {passwordError && (
              <ErrorMessage>
                <FontAwesomeIcon icon={faBomb} /> {passwordError}
              </ErrorMessage>
            )}
            {validatePassword(password).satisfied.map((satisfy) => (
              <SuccessMessage key={satisfy}>
                <FontAwesomeIcon icon={faCheck} /> {satisfy}
              </SuccessMessage>
            ))}
          </>
        )}
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
        <button type="submit" disabled={!isFormValid()}>
          Register
        </button>
      </ButtonContainer>
      {termsError && (
        <ErrorMessage>
          <FontAwesomeIcon icon={faBomb} /> {termsError}
        </ErrorMessage>
      )}
      {generalError && (
        <ErrorMessage>
          <FontAwesomeIcon icon={faBomb} /> {generalError}
        </ErrorMessage>
      )}
      <hr style={{ marginBlock: "var(--space-2)" }} />
      <GoToLogin>
        Already have an account?&nbsp;<Link to="/login">Login</Link>
      </GoToLogin>
    </Form>
  );
};

export default Register;
