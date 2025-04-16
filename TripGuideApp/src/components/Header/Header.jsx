import { useState } from 'react';
import logo from '/logo.png';
import './Header.css'; 
import Button from '../Button/Button';
import * as I from 'lucide-react';  

export default function Header({ onSignInClick }) {
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
            
            {/* Кнопка для мобильного меню */}
            <button 
                className='mobileMenuBtn'
                onClick={toggleMobileMenu}
                aria-label="Мобильное меню"
            >
                {mobileMenuOpen ? <I.X color='#FDF6E3' /> : <I.Menu color='#FDF6E3' />}
            </button>
            
            {/* Основная навигация видима только на десктопе */}
            <div className='buttonContainer'>
                <Button class='button' text='Home' icon={<I.Home color='#FDF6E3' />} />
                <Button class='button' text='Search' icon={<I.Search color='#FDF6E3' />} />
                <Button class='button' text='Catalog' icon={<I.Layers color='#FDF6E3' />} />
            </div>
            
            {/* Кнопка входа отображается на десктопе, но скрывается на мобильных */}
            <div className="profile">                
                <Button
                    class='Sbutton'
                    text='Sign In'
                    icon={<I.LogIn color='#FDF6E3' />}
                    onClick={onSignInClick}
                />            
            </div>
            
            {/* Правое выдвижное мобильное меню со всеми кнопками включая Sign In */}
            <div className='mobileMenu'>
                <div className='mobileMenuHeader'>
                    <h3></h3>
                    <button 
                        className='closeMenuBtn'
                        onClick={closeMobileMenu}
                        aria-label="Закрыть меню"
                    >
                        <I.X color='#FDF6E3' size={24} />
                    </button>
                </div>
                
                <div className='mobileMenuContent'>
                    <Button class='button' text='Home' icon={<I.Home color='#FDF6E3' />} />
                    <div className='menuDivider'></div>
                    
                    <Button class='button' text='Search' icon={<I.Search color='#FDF6E3' />} />
                    <div className='menuDivider'></div>
                    
                    <Button class='button' text='Catalog' icon={<I.Layers color='#FDF6E3' />} />
                    <div className='menuDivider'></div>
                    
                    <Button
                        class='Sbutton'
                        text='Sign In'
                        icon={<I.LogIn color='#FDF6E3' />}
                        onClick={(e) => {
                            closeMobileMenu();
                            onSignInClick && onSignInClick(e);
                        }}
                    />
                </div>
            </div>
            
            {/* Overlay для закрытия меню при клике вне */}
            {mobileMenuOpen && (
                <div className="menuOverlay" onClick={closeMobileMenu}></div>
            )}
        </header>
    );
}