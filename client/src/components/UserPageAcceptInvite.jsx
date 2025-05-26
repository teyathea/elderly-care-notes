import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SidebarContext } from "./Sidebar";

const AcceptInvite = ({ onLogin }) => {
  const { updateUserInfo } = useContext(SidebarContext);
  const [message, setMessage] = useState("Verifying invite...");
  const [tokenValid, setTokenValid] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordSetMessage, setPasswordSetMessage] = useState("");
  const [settingPassword, setSettingPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setMessage("Missing token.");
      return;
    }

    axios
      .get(`http://localhost:8000/api/contactusers/accept-invite?token=${token}`)
      .then((res) => {
        const { token, fullname, email, role, id } = res.data;

        localStorage.setItem("userToken", token);

        const userInfo = { fullname, email, role, id: id || null };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        updateUserInfo(userInfo);

        setMessage("Invite accepted! Please set your password.");
        setTokenValid(true);
      })
      .catch((error) => {
        setMessage(error.response?.data?.message || "Invalid or expired token.");
      });
  }, [updateUserInfo]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (password.trim().length < 6) {
      setPasswordSetMessage("Password must be at least 6 characters.");
      return;
    }

    setSettingPassword(true);
    setPasswordSetMessage("");

    try {
      const token = localStorage.getItem("userToken");
      await axios.post(
        `http://localhost:8000/api/contactusers/set-password`,
        { password: password.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPasswordSetMessage("Password set successfully! Redirecting...");
      
      // Ensure isLoggedIn state is set to true here before redirecting
      if (onLogin) onLogin(); // Updates login state in App component

      setTimeout(() => navigate("/home"), 1500);
    } catch (error) {
      setPasswordSetMessage(error.response?.data?.message || "Failed to set password.");
      setSettingPassword(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-md bg-white text-center">
        <p className="text-lg text-red-600">{message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-md bg-white">
      <p className="mb-6 text-center text-lg text-gray-800">{message}</p>
      <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
        <label htmlFor="password" className="font-semibold text-gray-700">
          Set Password:
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          placeholder="Enter new password"
          disabled={settingPassword}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          type="submit"
          disabled={settingPassword}
          className={`py-2 rounded-md text-white font-semibold transition-colors ${
            settingPassword ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {settingPassword ? "Setting..." : "Set Password"}
        </button>
      </form>
      {passwordSetMessage && (
        <p
          className={`mt-4 text-center ${
            passwordSetMessage.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {passwordSetMessage}
        </p>
      )}
    </div>
  );
};

export default AcceptInvite;
