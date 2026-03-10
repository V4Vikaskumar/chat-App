import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/AuthProvider";
import '../cssFolder/setting.css'
import { updateEmail, updateName, updatePassword } from "../Apis/Auth";
const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [editField, setEditField] = useState(null);

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (field) => {
    if(field == "name"){
      await updateName({name : formData.name});
    }else if(field == 'email'){
      await updateEmail({email : formData.email})
    }else if(field == 'password'){
      await updatePassword({password : formData.password});
      // console.log(formData)
    }
    setEditField(null);
  };

  return (
    <div className="settings-container">
      <div className="settings-card">

        <h2>⚙ Account Settings</h2>

        {/* NAME */}
        <div className="setting-item">
          <label>Your Name</label>

          {editField === "name" ? (
            <div className="edit-section">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <button onClick={() => handleSave("name")}>Save</button>
            </div>
          ) : (
            <div className="display-section">
              <span>{formData.name}</span>
              <button onClick={() => setEditField("name")}>✏️</button>
            </div>
          )}
        </div>

        {/* EMAIL */}
        <div className="setting-item">
          <label>Your Email</label>

          {editField === "email" ? (
            <div className="edit-section">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <button onClick={() => handleSave("email")}>Save</button>
            </div>
          ) : (
            <div className="display-section">
              <span>{formData.email}</span>
              <button onClick={() => setEditField("email")}>✏️</button>
            </div>
          )}
        </div>

        {/* PASSWORD */}
        <div className="setting-item">
          <label>Password</label>

          {editField === "password" ? (
            <div className="edit-section">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
              />
              <button onClick={() => handleSave("password")}>Save</button>
            </div>
          ) : (
            <div className="display-section">
              <span>********</span>
              <button onClick={() => setEditField("password")}>✏️</button>
            </div>
          )}
        </div>

        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back To Chat
        </button>

      </div>
    </div>
  );
};

export default Settings;