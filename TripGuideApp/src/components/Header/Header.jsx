import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '/logo.png';
import './Header.css'; 
import Button from '../Button/Button';
import * as I from 'lucide-react';  

export default function Header({ onSignInClick, isAuthenticated }) {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
    
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
        if (!mobileMenuOpen === false) {
            setMobileProfileOpen(false);
        }
    };
    
    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        setMobileProfileOpen(false);
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };
    
    const toggleProfile = (e) => {
        if (e) e.stopPropagation();
        setProfileOpen(!profileOpen);
    };
    
    const toggleMobileProfile = () => {
        setMobileProfileOpen(!mobileProfileOpen);
    };
    
    const handleNavigation = (path) => {
        navigate(path);
        closeMobileMenu();
        setProfileOpen(false);
    };
    
    return (
        <header className={`header ${mobileMenuOpen ? 'mobileMenuOpen' : ''}`}>
            <img className='logo' src={logo} alt="logo" onClick={() => handleNavigation('/')} style={{cursor: 'pointer'}} />
            
            <div className="buttonContainer">
                <Button 
                    class="button" 
                    text="Home" 
                    icon={<I.Home size={20} color="#FDF6E3" />} 
                    onClick={() => handleNavigation('/')}
                />
                <Button 
                    class="button" 
                    text="Search" 
                    icon={<I.Search size={20} color="#FDF6E3" />} 
                />
                <Button 
                    class="button" 
                    text="Catalog" 
                    icon={<I.Layers size={20} color="#FDF6E3" />} 
                />
            </div>
            
            <div className="profile">
                {isAuthenticated ? (
                    <>
                        <Button 
                            class="Ibutton" 
                            text="" 
                            icon={<I.Bell size={24} color="#FDF6E3" />} 
                        />
                        <Button 
                            class="Ibutton" 
                            text="" 
                            icon={<I.Plus size={24} color="#FDF6E3" />} 
                        />
                        <Button 
                            class="Ibutton" 
                            text="" 
                            icon={<I.User size={24} color="#FDF6E3" />} 
                            onClick={toggleProfile}
                        />
                    </>
                ) : (
                    <Button 
                        class="Sbutton" 
                        text="Sign In" 
                        icon={<I.LogIn size={20} color="#FDF6E3" />} 
                        onClick={onSignInClick}
                    />
                )}
            </div>
            
            <button className="mobileMenuBtn" onClick={toggleMobileMenu}>
                <I.Menu size={24} color="#FDF6E3" />
            </button>
            
            <div className={`mobileMenu ${mobileMenuOpen ? 'mobileMenuOpen' : ''}`}>
                <div className="mobileMenuHeader">
                    <h3>Menu</h3>
                    <button className="closeMenuBtn" onClick={closeMobileMenu}>
                        <I.X size={24} color="#FDF6E3" />
                    </button>
                </div>
                
                <div className="mobileMenuContent">
                    <Button 
                        class="button" 
                        text="Главная" 
                        icon={<I.Home size={20} color="#FDF6E3" />} 
                        onClick={() => handleNavigation('/')}
                    />
                    <Button 
                        class="button" 
                        text="Поиск"
                        icon={<I.Search size={20} color="#FDF6E3" />} 
                        onClick={closeMobileMenu}
                    />
                    <Button 
                        class="button" 
                        text="Каталог" 
                        icon={<I.Layers size={20} color="#FDF6E3" />} 
                        onClick={closeMobileMenu}
                    />
                    
                    <div className="menuDivider"></div>
                    
                    {isAuthenticated ? (
                        <>
                            <Button 
                                class="button" 
                                text="Notifications" 
                                icon={<I.Bell size={20} color="#FDF6E3" />} 
                                onClick={closeMobileMenu}
                            />
                            <Button 
                                class="button" 
                                text="Create" 
                                icon={<I.Plus size={20} color="#FDF6E3" />} 
                                onClick={closeMobileMenu}
                            />
                            <div className="mobileProfileContainer">
                                <Button 
                                    class="button mobileProfileButton" 
                                    text="Profile" 
                                    icon={<I.User size={20} color="#FDF6E3" />} 
                                    onClick={toggleMobileProfile}
                                    rightIcon={mobileProfileOpen ? <I.ChevronUp size={16} color="#FDF6E3" /> : <I.ChevronDown size={16} color="#FDF6E3" />}
                                />
                                
                                {mobileProfileOpen && (
                                    <div className="mobileProfileSubmenu">
                                        <Button 
                                            class="button" 
                                            text="My Profile" 
                                            icon={<I.User size={16} color="#FDF6E3" />} 
                                            onClick={() => handleNavigation('/profile')}
                                        />
                                        <Button 
                                            class="button" 
                                            text="Settings" 
                                            icon={<I.Settings size={16} color="#FDF6E3" />} 
                                            onClick={() => handleNavigation('/settings')}
                                        />
                                        <Button 
                                            class="button" 
                                            text="Log Out" 
                                            icon={<I.LogOut size={16} color="#FDF6E3" />} 
                                            onClick={handleLogout}
                                        />
                                    </div>
                                )}
                            </div>
                            
                            <div className="menuDivider"></div>
                        </>
                    ) : (
                        <Button 
                            class="Sbutton" 
                            text="Log In" 
                            icon={<I.LogIn size={20} color="#FDF6E3" />} 
                            onClick={(e) => {
                                closeMobileMenu();
                                onSignInClick(e);
                            }}
                        />
                    )}
                </div>
            </div>
            
            {profileOpen && isAuthenticated && (
                <div className="profileDropdown">
                    <div className="profileDropdownContent">
                        <Button 
                            class="profileButton" 
                            text="My profile" 
                            icon={<I.User size={16} color="#CD853F" />} 
                            onClick={() => handleNavigation('/profile')}
                        />
                        <Button 
                            class="profileButton" 
                            text="Settings" 
                            icon={<I.Settings size={16} color="#CD853F" />} 
                            onClick={() => handleNavigation('/settings')}
                        />
                        <Button 
                            class="profileButton" 
                            text="Log Out" 
                            icon={<I.LogOut size={16} color="#CD853F" />} 
                            onClick={handleLogout}
                        />
                    </div>
                </div>
            )}
            
            {profileOpen && (
                <div className="profileOverlay" onClick={() => setProfileOpen(false)}></div>
            )}
            
            {mobileMenuOpen && (
                <div className="menuOverlay" onClick={closeMobileMenu}></div>
            )}
        </header>
    );
}