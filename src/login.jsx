import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import "./design.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { sendPasswordResetEmail } from "firebase/auth";

const Login = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleForgotPass = async () => {
    if (!email) {
      alert("Enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent.");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="modal-header">
          <h2>Welcome back 💸</h2>
        </div>
        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-wrapper">
            <input
              type={showPassword ? "text": "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="auth-options">
            <button type="button" className="forgot-password" onClick={handleForgotPass}>
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="signin-btn">Log in</button>
        </form>

        <div className="divider">Or login with</div>
        <div className="google-login">
          <button className="google-button" onClick={handleGoogleLogin}>
            <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" alt="Google icon" className="provider-icon" />
            Google
          </button>
        </div>
      </div>
      </div>
  );
};

export default Login;
