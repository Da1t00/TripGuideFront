import './Button.css'


export default function Button(props)
{
    return(
        <button className={props.class} onClick={props.onClick}>{props.icon}{props.text}</button>

    )
}