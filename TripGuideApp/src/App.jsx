import './App.css'
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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
import 'react-toastify/dist/ReactToastify.css';
import Recs from './components/Recomendations';

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
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
              <div style={{backgroundColor:"#FDF6e3"}}><WorldMap/></div>

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