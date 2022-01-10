import React, { FC } from 'react'
import './button.css';
interface ButtonInterface{
    onClick?:()=>void,
    name:string,
    style?:React.CSSProperties
}
const Button:FC<ButtonInterface>=({onClick,style,name})=> {
    return (
        <button className='button-component' onClick={()=>onClick && onClick()} style={{backgroundColor:'#00bfff',...style}}>{name}</button>
    )
}

export default Button
