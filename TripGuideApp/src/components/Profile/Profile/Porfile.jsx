import React from 'react';
import './Profile.css';

export default function ProfilePage(){



    return(
        <div className="profile-page">
            <div className="profile-header">
                <h1>Profile</h1>
            </div>
            <div className="profile-content">
                <div className="profile-info">
                    <h2>User Information</h2>
                    {/* User information goes here */}
                </div>
                <div className="profile-settings">
                    <h2>Settings</h2>
                    {/* Settings options go here */}
                </div>
            </div>
        </div>
    )
}