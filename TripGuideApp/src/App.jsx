import './App.css'
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from './components/Header/Header'
import WorldMap from './components/Map'
import Authorize from './components/Auth/Auth'
import SwiperBanner from './components/Swiper/Swiper'
import ProfileSettings from './components/Profile/Profile' // Импортируем компонент профиля
import refreshToken from './utils/refreshToken'

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    setIsAuthenticated(!!accessToken);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken();
    },25 * 60 * 1000); // 25 минут

    return () => clearInterval(interval);
  }, []);

  const handleAuthClose = () => {
    setIsAuthOpen(false);
    const accessToken = localStorage.getItem('accessToken');
    setIsAuthenticated(!!accessToken);
  };

  // Компонент для защищенных маршрутов
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Header 
        onSignInClick={() => setIsAuthOpen(true)} 
        isAuthenticated={isAuthenticated}
      />
      {isAuthOpen && (
        <Authorize onClose={handleAuthClose} />
      )}
      
      <div style={{marginTop:"80px"}}>
        <Routes>
          <Route path="/" element={
            <>
              <div style={{backgroundColor:"#FDF6e3"}}><SwiperBanner/></div>
              {!isMobile && (
                <div style={{backgroundColor:"#FDF6e3"}}><WorldMap/></div>
              )}
            </>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <ProfileSettings/>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <div style={{backgroundColor:"#FDF6e3", padding: "20px"}}>
                <h1>Профиль</h1>
                <p>Страница настроек в разработке</p>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}