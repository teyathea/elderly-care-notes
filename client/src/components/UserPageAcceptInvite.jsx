import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AcceptInvite = ({ onLogin }) => {
  const [message, setMessage] = useState("Verifying invite...");
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const token = new URLSearchParams(window.location.search).get("token");
      if (!token) {
        setMessage("Missing token.");
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:8000/api/contactusers/accept-invite?token=${token}`
        );

        // Save user data & token to localStorage
        localStorage.setItem("userToken", res.data.token);
        localStorage.setItem("userFullname", res.data.fullname);
        localStorage.setItem("userEmail", res.data.email);
        localStorage.setItem("userRole", res.data.role);

        // Notify parent App that user is logged in
        onLogin();

        setMessage("Redirecting...");
        navigate("/home");
      } catch (error) {
        setMessage(error.response?.data?.message || "Invalid or expired token.");
      }
    };

    verify();
  }, [navigate, onLogin]);

  return <p>{message}</p>;
};

export default AcceptInvite;
