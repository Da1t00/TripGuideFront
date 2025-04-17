import { useState } from 'react';
import logo from '/logo.png';
import './Header.css'; 
import Button from '../Button/Button';
import * as I from 'lucide-react';  

export default function Header({ onSignInClick, isAuthenticated }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };
    
    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };
    
    return (
        <header className={`header ${mobileMenuOpen ? 'mobileMenuOpen' : ''}`}>
            <img className='logo' src={logo} alt="logo" />
            
            <div className="buttonContainer">
                <Button 
                    class="button" 
                    text="Home" 
                    icon={<I.Home size={20} color="#FDF6E3" />} 
                />
                <Button 
                    class="button" 
                    text="Search" 
                    icon={<I.Search size={20} color="#FDF6E3" />} 
                />
                <Button 
                    class="button" 
                    text="Catalog" 
                    icon={<I.Layers  size={20} color="#FDF6E3" />} 
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
                        />
                        <Button 
                            class="Ibutton" 
                            text="" 
                            icon={<I.LogOut size={24} color="#FDF6E3" />} 
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
                        text="Home" 
                        icon={<I.Home size={20} color="#FDF6E3" />} 
                        onClick={closeMobileMenu}
                    />
                    <Button 
                        class="button" 
                        text="Search"
                        icon={<I.Search size={20} color="#FDF6E3" />} 
                        onClick={closeMobileMenu}
                    />
                    <Button 
                        class="button" 
                        text="Catalog" 
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
                            <Button 
                                class="button" 
                                text="Profile" 
                                icon={<I.User size={20} color="#FDF6E3" />} 
                                onClick={closeMobileMenu}
                            />
                            <div className="menuDivider"></div>
                            <Button 
                                class="button" 
                                text="Log Out" 
                                icon={<I.LogOut size={20} color="#FDF6E3" />} 
                                onClick={closeMobileMenu}
                            />
                            
                        </>
                    ) : (
                        <Button 
                            class="Sbutton" 
                            text="Sign In" 
                            icon={<I.LogIn size={20} color="#FDF6E3" />} 
                            onClick={(e) => {
                                closeMobileMenu();
                                onSignInClick(e);
                            }}
                        />
                    )}
                </div>
            </div>
            
            {mobileMenuOpen && (
                <div className="menuOverlay" onClick={closeMobileMenu}></div>
            )}
        </header>
    );
}