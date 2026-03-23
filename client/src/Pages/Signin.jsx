import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/AuthProvider";
import "../cssFolder/signin.css";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signin, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  const signhandler = async (e) => {
    e.preventDefault();
    await signin({ email, password });
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2>Welcome Back</h2>

        <form onSubmit={signhandler}>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter Your Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Your Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          <button type="submit" className="signin-btn">
            Sign In
          </button>

        </form>

        <p className="signup-text">
          Don’t have an account?
          <span onClick={() => navigate("/signup")}> Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default Signin;