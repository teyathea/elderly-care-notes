import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AcceptInvite = ({ onLogin }) => {
  const [message, setMessage] = useState("Verifying invite...");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
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

        if (!isMounted) return;

        // Save user data & token to localStorage
        localStorage.setItem("userToken", res.data.token);
        localStorage.setItem("userFullname", res.data.fullname);
        localStorage.setItem("userEmail", res.data.email);
        localStorage.setItem("userRole", res.data.role);

        // Notify parent app user is logged in
        onLogin();

        setMessage("Redirecting...");
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } catch (error) {
        if (!isMounted) return;
        setMessage(error.response?.data?.message || "Invalid or expired token.");
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [navigate, onLogin]);

  return <p>{message}</p>;
};

export default AcceptInvite;
