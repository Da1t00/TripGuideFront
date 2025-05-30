import './App.css'
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header/Header'
import WorldMap from './components/Map'
import Authorize from './components/Auth/Auth'
import SwiperBanner from './components/Swiper/Swiper'
import ProfileSettings from './components/ProfileSettings/ProfileSettings'
import ProfilePage from './components/Profile/Profile';
import refreshToken from './utils/refreshToken'
import GuideViewer from './components/GuideViewer/GuideViewer';
import CatalogPage from './components/CatalogPage/CatalogPage';
import EditGuide from './components/EditGuide/EditGuide';
import MyGuideViewer from './components/MyGuideViewer/MyGuideViewer';
import Recs from './components/Recomendations';

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
    }, 25 * 60 * 1000); // 25 минут

    return () => clearInterval(interval);
  }, []);

  const handleAuthClose = () => {
    setIsAuthOpen(false);
    const accessToken = localStorage.getItem('accessToken');
    setIsAuthenticated(!!accessToken);
  };

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
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
        style={{ marginTop: '80px' }} 
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
           <Route path="/catalog" element={
            <ProtectedRoute>
              <CatalogPage/>
            </ProtectedRoute>
          } />
          <Route path="/catalog/view_guide/:id" element={
            <ProtectedRoute>
              <GuideViewer/>
            </ProtectedRoute>
            } />
          <Route path="/catalog/my_guide/:id" element={
            <ProtectedRoute>
              <MyGuideViewer/>
            </ProtectedRoute>
            } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <ProfileSettings/>
            </ProtectedRoute>
          } />
          <Route path="/recommendations" element={
            <ProtectedRoute>
              <Recs/>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage/>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}