import React, { FC, useEffect, useState } from 'react'
import { MODETYPE } from '../../hooks/useMode';
import './styles.css';

interface MultilineInputComponentInterface{
    mode?:`${MODETYPE.DARK}`|`${MODETYPE.LIGHT}`,
    isFocused?:true|false,
    label?:string,
    classLabeldiv?:string,
    classFulldiv?:string,
}
const MultilineInputComponent:FC<MultilineInputComponentInterface>=({isFocused,label,classLabeldiv,mode,children,classFulldiv}) =>{
    return (
        <div style={
            {
                borderWidth: isFocused ? '2px' : '1px',
                borderColor: isFocused ? '#fff' : '#000',
                boxShadow: isFocused ? '2px 2px 5px #444' : 'none',
                backgroundColor: isFocused ? mode === MODETYPE.DARK ? '#555' : '#cacaca' : 'inherit'
            }
        } className={`InputComponent_fulldiv ${classFulldiv}`}>
            {label && <div style={{
                backgroundColor: mode === 'dark' ? '#555' : '#cacaca',
                color: mode === 'dark' ? '#fff' : '#000',
                width: isFocused ? '6rem' : '10rem',
            }}
                className={`InputComponentLabelDiv ${classLabeldiv}`}><p>{label}</p></div>}

            {children}
        </div>
        
    )
}
export default MultilineInputComponent
