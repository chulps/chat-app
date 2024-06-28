import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { getEnv } from "../utils/getEnv";

const VerifyEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState<string>("");
  const { apiUrl } = getEnv();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/auth/verify-email/${token}`);
        setMessage(response.data.msg);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        setMessage("Email verification failed.");
      }
    };
    verifyEmail();
  }, [token, apiUrl, navigate]);

  return (
    <div>
      <h2>Email Verification</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
