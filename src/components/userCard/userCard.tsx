import React, { FC } from 'react'
import './userCard.css'
import { BsXCircleFill } from "react-icons/bs";
import { MODETYPE } from '../../hooks/useMode';
interface UserCardInterface{
    mode?:`${MODETYPE.DARK}`|`${MODETYPE.LIGHT}`,
    logoStyle?:React.CSSProperties,
    style?:React.CSSProperties,
    title?:any,
    img?:string,
    classNameFullDiv?:string,
    classNameIcon?:string,
    id:string,
    onClick?:(id:string)=>void
}
const UserCard:FC<UserCardInterface>=({style,logoStyle,classNameFullDiv,classNameIcon,img,id,mode,onClick,title})=> {
    return (
        <div className={`usercard-fulldiv ${mode}-fulldiv ${classNameFullDiv} `}>
            {img &&<img src={img} alt='alt'></img>}
            <p style={style}>{title} <BsXCircleFill onClick={()=>{onClick && onClick(id)}} className={`usercard-closeDiv ${classNameIcon}`} style={logoStyle} /></p>
        </div>
    )
}

export default UserCard
