import React from 'react';
import './GuideBanner.css';

export default function GuideBanner({ avatar, author, title, description, date, onButtonClick }){
  return (
    <div className="banner-container">
      <div className="banner">
        <div className="avatar-section">
          <img src={avatar} alt="аватар" className="avatar" />
          <div className="author"><strong>{author}</strong></div>
        </div>
        <div className="content">
          <div className="title">{title}</div>
          <div className="description">{description}</div>
          <button className="arrow-button" onClick={onButtonClick}>
            Читать →
          </button>
        </div>
        <div className="date">{date}</div>
      </div>
    </div>
  );
};


