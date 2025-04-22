import React, { useState, useEffect } from "react";
import * as I from "lucide-react";
import "./Auth.css";
import axios from "axios";

export default function Authorize({ onClose }) {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    verification_code: "",
    login: "" // New field for combined email/nickname login
  });
  const [errors, setErrors] = useState({
    nickname: "",
    email: "",
    password: "",
    verification_code: "",
    login: "",
    server: "" // For server-side errors
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // "info", "success", "error"
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);

  // Check for pending verification on component mount
  useEffect(() => {
    const pendingVerification = localStorage.getItem('pendingVerification');
    if (pendingVerification) {
      try {
        const verificationData = JSON.parse(pendingVerification);
        if (verificationData && verificationData.email && verificationData.nickname) {
          // Set verification mode automatically
          setActiveTab("register");
          setIsVerifying(true);
          
          // Populate form with stored data
          setFormData(prev => ({
            ...prev,
            email: verificationData.email,
            nickname: verificationData.nickname,
            verification_code: ""
          }));
        }
      } catch (error) {
        console.error("Error parsing pending verification data:", error);
        localStorage.removeItem('pendingVerification');
      }
    }
  }, []);

  // Функция для получения данных пользователя с бэкенда
  const fetchUserData = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        console.error("No access token found");
        return;
      }
      
      const response = await axios.get('http://localhost:8000/user/get_info', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      const userData = {
        age: response.data.age === "None" ? 0 : Number(response.data.age),
        cof: response.data.cof === "None" ? 0 : Number(response.data.cof),
        username: response.data.username ?? null,
        gender: response.data.gender ?? null,
        about: response.data.about ?? null,
        nickname: response.data.nickname ?? null,
      };
      localStorage.setItem("userData", JSON.stringify(userData));

      
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Если токен недействителен или истек
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setErrorMessage("Session expired. Please login again.");
      }
    }
  };

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
    
    // Also clear any error messages when user makes changes
    setMessage("");
  };

  // Save verification details to localStorage
  const savePendingVerification = (email, nickname) => {
    const verificationData = {
      email,
      nickname,
      timestamp: new Date().getTime()
    };
    localStorage.setItem('pendingVerification', JSON.stringify(verificationData));
  };

  // Clear verification details from localStorage
  const clearPendingVerification = () => {
    localStorage.removeItem('pendingVerification');
  };

  // Detect if login input is email or nickname
  const isEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      nickname: "",
      email: "",
      password: "",
      verification_code: "",
      login: "",
      server: ""
    };

    // Login field validation (for login tab)
    if (activeTab === "login") {
      if (!formData.login) {
        newErrors.login = "Email or nickname is required";
        isValid = false;
      }
    } else {
      // Email validation (for registration tab)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email) {
        newErrors.email = "Email is required";
        isValid = false;
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = "Invalid email format";
        isValid = false;
      }
      
      // Nickname validation (for registration tab)
      if (!isVerifying) {
        if (!formData.nickname) {
          newErrors.nickname = "Nickname is required";
          isValid = false;
        } else if (formData.nickname.length > 20) {
          newErrors.nickname = "Nickname must be less than 20 characters";
          isValid = false;
        }
      }
    }

    // Password validation (only for login and register)
    if (!isVerifying) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!formData.password) {
        newErrors.password = "Password is required";
        isValid = false;
      } else if (!passwordRegex.test(formData.password)) {
        newErrors.password = "Password must be at least 8 characters with uppercase letters and numbers";
        isValid = false;
      }
    }

    // Verification code validation
    if (isVerifying) {
      if (!formData.verification_code) {
        newErrors.verification_code = "Verification code is required";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const setErrorMessage = (message) => {
    setMessage(message);
    setMessageType("error");
    setShowVerificationSuccess(false);
  };

  const setSuccessMessage = (message) => {
    setMessage(message);
    setMessageType("success");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("info");
    setShowVerificationSuccess(false);

    if (validateForm()) {
      try {
        if (activeTab === "login") {
          // Determine if login is email or nickname
          const loginField = formData.login;
          const loginData = {
            password: formData.password
          };

          // Set either email or nickname based on input format
          if (isEmail(loginField)) {
            loginData.email = loginField;
            loginData.nickname = '';
          } else {
            loginData.nickname = loginField;
            loginData.email = '';
          }

          // Handle login
          const response = await axios.post('http://localhost:8000/auth/login', loginData);
          
          // Store tokens in localStorage or a secure storage
          localStorage.setItem('accessToken', response.data.access_token);
          localStorage.setItem('refreshToken', response.data.refresh_token);
          
          // Clear any pending verification data
          clearPendingVerification();
          
          // Получаем данные пользователя сразу после успешной авторизации
          await fetchUserData();
          
          setSuccessMessage("Login successful!");
          // Close modal or redirect after successful login
          setTimeout(() => onClose(), 1000);
          
        } else if (activeTab === "register" && !isVerifying) {
          // Handle registration
          await axios.post('http://localhost:8000/auth/register', {
            email: formData.email,
            nickname: formData.nickname,
            password: formData.password
          });
          
          // Save verification details to localStorage
          savePendingVerification(formData.email, formData.nickname);
          
          setIsVerifying(true);
          
        } else if (isVerifying) {
          // Handle verification
          await axios.post('http://localhost:8000/auth/verify', {
            email: formData.email,
            nickname: formData.nickname,
            verification_code: formData.verification_code
          });
          
          // Clear pending verification data from localStorage
          clearPendingVerification();
          
          // Show verification success notification
          setSuccessMessage("Account verified successfully! You can now log in.");
          setShowVerificationSuccess(true);
          
          // Wait for 2 seconds before switching to login tab
          setTimeout(() => {
            setIsVerifying(false);
            setActiveTab("login");
            
            // Reset form for login
            setFormData(prev => ({
              ...prev,
              login: formData.email, // Pre-fill login with email for convenience
              password: "",
              verification_code: ""
            }));
            setShowVerificationSuccess(false);
          }, 2000);
        }
      } catch (error) {
        console.error("Auth error:", error);
        
        if (error.response) {
          // Extract error message from server response
          const errorMessage = error.response.data.detail || "Authentication failed";
          
          // Display all server errors in the top message component
          setErrorMessage(errorMessage);
          
          // Format specific error messages for better readability
          if (errorMessage.includes("email already exists")) {
            setErrorMessage("User with this email already exists");
          } else if (errorMessage.includes("nickname already exists")) {
            setErrorMessage("User with this nickname already exists");
          } else if (errorMessage.includes("Invalid credentials")) {
            setErrorMessage("Invalid credentials. Please check your email/nickname and password.");
          } else if (errorMessage.includes("not found")) {
            setErrorMessage("User not found. Please check your credentials.");
          } else if (errorMessage.includes("Invalid verification code")) {
            setErrorMessage("Invalid verification code. Please try again.");
          } else if (errorMessage.includes("Incorrect password")) {
            setErrorMessage("Login failed. Incorrect password");
          }
          
        } else if (error.request) {
          // The request was made but no response was received
          setErrorMessage("Error: No response from server. Please try again later.");
        } else {
          setErrorMessage(`Error: ${error.message}`);
        }
      }
    }
  };

  const handleTabChange = (tab) => {
    // Only allow tab change if not in verification mode
    if (!isVerifying) {
      setActiveTab(tab);
      setMessage("");
      setErrors({
        nickname: "",
        email: "",
        password: "",
        verification_code: "",
        login: "",
        server: ""
      });
      
      if (tab === "login") {
        setFormData(prev => ({
          ...prev,
          login: "",
          password: ""
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          email: "",
          nickname: "",
          password: ""
        }));
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>✕</button>

        <div className="tabs">
          <button
            className={activeTab === "login" ? "tab active" : "tab"}
            onClick={() => handleTabChange("login")}
            disabled={isVerifying}
          >
            Sign In
          </button>
          <button
            className={activeTab === "register" ? "tab active" : "tab"}
            onClick={() => handleTabChange("register")}
            disabled={isVerifying}
          >
            Sign Up
          </button>
        </div>

        {/* Verification success notification with enhanced styling */}
        {showVerificationSuccess && (
          <div className="verification-success">
            <I.CheckCircle size={24} color="#4CAF50" />
            <span>Verification successful! Redirecting to login...</span>
          </div>
        )}

        {/* All server errors will be displayed here */}
        {message && <div className={`message ${messageType}`}>{message}</div>}

        <form className="form" onSubmit={handleSubmit}>
          {/* Login form */}
          {activeTab === "login" && !isVerifying && (
            <>
              <div className="form-group">
                <div className="input-field">
                  <input 
                    type="text" 
                    name="login" 
                    placeholder="Email or Nickname" 
                    value={formData.login}
                    onChange={handleChange}
                    className={errors.login ? "error-input" : ""}
                  />
                </div>
                {errors.login && <div className="error-message">{errors.login}</div>}
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
            </>
          )}

          {/* Registration form */}
          {activeTab === "register" && !isVerifying && (
            <>
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
            </>
          )}

          {/* Verification form */}
          {isVerifying && (
            <>
              <div className="verification-info">
                <I.Info size={20} color="#1976D2" />
                <span>Enter verification code sent to: {formData.email.length > 7 ? formData.email.slice(0,2) + '***' + formData.email.slice(-5) : formData.email}</span>
              </div>
              
              <div className="form-group">
                <div className="input-field">
                  <input 
                    type="text" 
                    name="verification_code" 
                    placeholder="Verification Code" 
                    value={formData.verification_code}
                    onChange={handleChange}
                    className={errors.verification_code ? "error-input" : ""}
                  />
                </div>
                {errors.verification_code && <div className="error-message">{errors.verification_code}</div>}
              </div>
            </>
          )}

          <button type="submit" style={{background: "#CD853F"}}>
            {activeTab === "login" ? "Sign In" : isVerifying ? "Verify" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}