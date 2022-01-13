import React, { FC, useState } from 'react'
import './channelButton.css'
import { AiFillPlusSquare } from 'react-icons/ai';
import { MODETYPE } from '../../../../hooks/useMode';

interface CustombuttonInterface{
    mode?:`${MODETYPE.DARK}`|`${MODETYPE.LIGHT}`,
    style?:React.CSSProperties,
    onClick?:(id:string)=>void,
    id:string,
    name:string,
}
const  ChannelButton:FC<CustombuttonInterface>=({mode,style,id,onClick,name})=> {
    const [hovered,setHovered]=useState(false);
    return (
        <div className='channelbutton-fulldiv' style={{background:mode===MODETYPE.DARK?'#444':'#666',color:'#fff',...style}}>
            <h2>{name}</h2>
            <AiFillPlusSquare onClick={()=>{onClick && onClick(id)}} onMouseEnter={()=>{setHovered(true)}} onMouseLeave={()=>{setHovered(false)}} style={{color:hovered?'#cacaca':'white',cursor:'pointer',...style}}/>
        </div>
    )
}

export default ChannelButton
