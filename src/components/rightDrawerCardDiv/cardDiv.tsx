import React, { FC } from 'react'
import './cardDiv.css';
import { TiArrowSortedDown } from "react-icons/ti";
import { MODETYPE } from '../../hooks/useMode';

interface CardInterface{
    mode?:`${MODETYPE.DARK}`|`${MODETYPE.LIGHT}`,
    label?:string,
    classLabeldiv?:string,
    classFulldiv?:string,
    top?:string,
    zIndex?:string,
    textColor?:string,
    isOpen?:true|false,
    headerTitle?:string,
    backgroundColor?:string,
    contentHeight?:string,
    onClick?:()=>void,
    headerColor?:string,
    headerBackgroundColor?:string
}
const CardDiv:FC<CardInterface>=({mode,top,zIndex,children,headerTitle,contentHeight,backgroundColor,isOpen,onClick,headerColor,textColor,headerBackgroundColor})=> {
    return (
        <div className='card-fulldiv' style={{top:top,zIndex:zIndex}}>
            <div className='card-header' style={{backgroundColor:headerBackgroundColor,color:headerColor,borderBottomColor:'#fff',borderTopColor:'#fff'}}>
                <div style={{position:'absolute',zIndex:2,width:'100%',height:'100%',cursor:'pointer'}} onClick={onClick} ></div>
                <h2 style={{color:textColor}}>{headerTitle}</h2>
                <TiArrowSortedDown style={{transform:isOpen?'rotateZ(180deg)':'rotateZ(0deg)',color:textColor}} className='card-header-logo'/>
            </div>
            <div className='card-content' style={{backgroundColor:backgroundColor,height:contentHeight}}>
                {children}
            </div>
        </div>
    )
}

export default CardDiv
