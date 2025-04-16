import React, { useState } from "react";
import * as I from "lucide-react";
import "./Auth.css";

export default function Authorize({ onClose }) {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({
    nickname: "",
    email: "",
    password: ""
  });

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing again
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      nickname: "",
      email: "",
      password: ""
    };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be at least 8 characters with uppercase letters and numbers";
      isValid = false;
    }

    // Nickname validation (only when registering)
    if (activeTab === "register") {
      if (!formData.nickname) {
        newErrors.nickname = "Nickname is required";
        isValid = false;
      } else if (formData.nickname.length > 20) {
        newErrors.nickname = "Nickname must be less than 20 characters";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Submit the form if all validations pass
      console.log("Form submitted:", formData);
      // Here you would typically call an API to handle authentication
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>✕</button>

        <div className="tabs">
          <button
            className={activeTab === "login" ? "tab active" : "tab"}
            onClick={() => setActiveTab("login")}
          >
            Sign In
          </button>
          <button
            className={activeTab === "register" ? "tab active" : "tab"}
            onClick={() => setActiveTab("register")}
          >
            Sign Up
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {activeTab === "register" && (
            <div className="form-group">
              <div className="input-field">
                <input 
                  type="text" 
                  name="nickname" 
                  placeholder="Nickname" 
                  value={formData.nickname}
                  onChange={handleChange}
                  className={errors.nickname ? "error-input" : ""}
                />
              </div>
              {errors.nickname && <div className="error-message">{errors.nickname}</div>}
            </div>
          )}
          
          <div className="form-group">
            <div className="input-field">
              <input 
                type="text" 
                name="email" 
                placeholder="Email" 
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error-input" : ""}
              />
            </div>
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error-input" : ""}
              />
              <button
                type="button"
                className="eye-button"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <I.EyeOff size={20} color="#8d8b8b"/> : <I.Eye size={20} color="#8d8b8b"/>}
              </button>
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <button type="submit" style={{background: "#CD853F"}}>
            {activeTab === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}