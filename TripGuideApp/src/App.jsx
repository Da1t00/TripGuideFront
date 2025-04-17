import './App.css'
import React, { useState, useEffect } from "react";

import Header from './components/Header/Header'
import WorldMap from './components/Map'
import Authorize from './components/Auth/Auth'

import SwiperBanner from './components/Swiper/Swiper'

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the screen size is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // Common breakpoint for mobile devices
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Check authentication status when the component mounts
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    setIsAuthenticated(!!accessToken);
  }, []);

  const handleAuthClose = () => {
    setIsAuthOpen(false);
    // Check if user got authenticated after modal closes
    const accessToken = localStorage.getItem('accessToken');
    setIsAuthenticated(!!accessToken);
  };

  return (
    <>
      <Header 
        onSignInClick={() => setIsAuthOpen(true)} 
        isAuthenticated={isAuthenticated}
      />
      {isAuthOpen && (
        <Authorize onClose={handleAuthClose} />
      )}
      <div style={{marginTop:"80px"}}>
        <div style={{backgroundColor:"#FDF6e3"}}><SwiperBanner/></div>
        {!isMobile && (
          <div style={{backgroundColor:"#FDF6e3"}}><WorldMap/></div>
        )}
      </div>
    </>
  )
}