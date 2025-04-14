import './Button.css'


export default function Button(props)
{
    return(
        <button className={props.class}>{props.icon}{props.text}</button>

    )
}