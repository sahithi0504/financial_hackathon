import React, { useState } from "react";
import Login from "./login";
import Signup from "./signup";
import Logo from "/FF_logo.webp";

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="home-wrapper">
      <nav className="navbar">
        <img src={Logo} alt="FiscalFocus Logo" className="logo" />
        <div className="nav-actions">
          <button onClick={() => setShowLogin(true)} className="primary-btn">Log In</button>
          <button onClick={() => setShowSignup(true)} className="primary-btn">Sign Up</button>
        </div>
      </nav>

      <section className="hero-section 2col">
        <div className="left">
          <h1>Analyzing and Early Identifying Financial Risks In Companies</h1>
          <p>As a financial advisor, you have access to an invoice analyzer,<br /> stock insights like trends and predictions, and profit/loss margins</p>
          <div className="hero-actions">
            <button onClick={() => setShowSignup(true)} className="primary-btn">Get Started Now</button>
          </div>
        </div>
        <div className="right">
          <img src="/finance.jpg" alt="picture" className="image" />
        </div>
      </section>

      <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <Signup isOpen={showSignup} onClose={() => setShowSignup(false)} />
          </div>
  );
};

export default Home;
