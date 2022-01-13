import React, { FC } from 'react'
import './errorComponent.css'
import { RiErrorWarningFill } from 'react-icons/ri';
import { MODETYPE } from '../../hooks/useMode';

interface ErrorInterface{
    mode?:`${MODETYPE.DARK}`|`${MODETYPE.LIGHT}`,
    style?:React.CSSProperties,
}
const ErrorComponent:FC<ErrorInterface>=({style})=> {
    return (
        <div className='error-component-fulldiv' style={{fontSize:'1rem',color:'red',...style}}>
            <RiErrorWarningFill/>
        </div>
    )
}

export default ErrorComponent
