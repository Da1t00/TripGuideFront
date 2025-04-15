import logo from '/logo.png'
import './Header.css' 
import Button from '../Button/Button'
import * as I from 'lucide-react';
export default function Header()
{
    return(
        <header className='header'>
            <img className='logo' src={logo} alt="logo" />
            <div className='buttonContainer'>
                <Button class = 'button' text= 'Главная' icon = {<I.Home color='#FDF6E3 '/>}> </Button>
                <Button class = 'button' text= 'Поиск' icon = {<I.Search color='#FDF6E3 '/>}> </Button>
                <Button class = 'button' text= 'Каталог' icon = {<I.Layers color='#FDF6E3 '/>}>  </Button>
            </div>
            <div className="profile">
                <Button class ='Ibutton' text= '' icon = {<I.Bell size={24} color='#FDF6E3 '/>}> </Button>
                <Button class ='Ibutton' text= '' icon = {<I.Plus size={24} color='#FDF6E3 '/>}> </Button>
                <Button class ='Ibutton' text= '' icon = {<I.User size={24} color='#FDF6E3 '/>}> </Button>
            </div>

        </header>
    )
}