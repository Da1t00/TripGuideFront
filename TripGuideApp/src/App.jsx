import './App.css'
import React, { useState } from "react";

import Header from './components/Header/Header'
import WorldMap from './components/Map'
import Authorize from './components/Auth/Auth'

import SwiperBanner from './components/Swiper/Swiper'


export default function App() {

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
  <>
    <Header onSignInClick={() => setIsAuthOpen(true)} />
      {isAuthOpen && (
        <Authorize onClose={() => setIsAuthOpen(false)} />
      )}
    <div style={{marginTop:"80px"}}>
      <div style={{backgroundColor:"#FDF6e3"}}><SwiperBanner/></div>
      <div style={{backgroundColor:"#708090"}}><WorldMap/></div>
    </div>
  </>
  )
}

