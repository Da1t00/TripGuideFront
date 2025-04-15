import React, { useState } from "react";
import * as I from "lucide-react"; // импорт нужных иконок
import "./Auth.css";

export default function Authorize({ onClose }) {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>✕</button>

        <div className="tabs">
          <button 
            className={activeTab === "login" ? "tab active" : "tab"}
            onClick={() => setActiveTab("login")}
          >
            Вход
          </button>
          <button
            className={activeTab === "register" ? "tab active" : "tab"}
            onClick={() => setActiveTab("register")}
          >
            Регистрация
          </button>
        </div>

        <form className="form">
          {activeTab === "register" && <input type="text" placeholder="Имя" />}
          <input type="email" placeholder="Email" />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Пароль"
            />
            <button
                
              type="button"
              className="eye-button"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <I.EyeOff size={20} color="#8d8b8b"/> : <I.Eye size={20} color="#8d8b8b"/>}
            </button>
          </div>

          <button type="submit" style={{background: "#CD853F"}}>
            {activeTab === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>
      </div>
    </div>
  );
}
