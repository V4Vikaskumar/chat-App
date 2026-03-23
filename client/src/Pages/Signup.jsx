import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/AuthProvider";
import "../cssFolder/signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const { user, signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      await signup({ name, email, password });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Account</h2>

        <form onSubmit={signupHandler}>

          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>

        </form>

        <p className="signin-text">
          Already have an account?
          <span onClick={() => navigate("/signin")}> Sign In</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;