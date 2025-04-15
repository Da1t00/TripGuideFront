import logo from '/logo.png'
import './Header.css' 
import Button from '../Button/Button'
import * as I from 'lucide-react';  
export default function Header({ onSignInClick })
{
    return(
        <header className='header'>
            <img className='logo' src={logo} alt="logo" />
            <div className='buttonContainer'>
                <Button class = 'button' text= 'Home' icon = {<I.Home color='#FDF6E3 '/>}> </Button>
                <Button class = 'button' text= 'Search' icon = {<I.Search color='#FDF6E3 '/>}> </Button>
                <Button class = 'button' text= 'Catalog' icon = {<I.Layers color='#FDF6E3 '/>}>  </Button>
            </div>
            <div className="profile">
                {/* <Button class ='Ibutton' text= '' icon = {<I.Bell size={24} color='#FDF6E3 '/>}> </Button>
                <Button class ='Ibutton' text= '' icon = {<I.Plus size={24} color='#FDF6E3 '/>}> </Button>
                <Button class ='Ibutton' text= '' icon = {<I.User size={24} color='#FDF6E3 '/>}> </Button> */}
                <Button
                        class='Sbutton'
                        text='Sign In'
                        icon={<I.LogIn color='#FDF6E3' />}
                        onClick={onSignInClick}
                        />            
            </div>

        </header>
    )
}