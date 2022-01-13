import React, { FC } from 'react'
import './customButton.css'
import ErrorComponent from '../../../../components/errorComponent/errorComponent'
import { MODETYPE } from '../../../../hooks/useMode';

interface CustombuttonInterface{
    mode?:`${MODETYPE.DARK}`|`${MODETYPE.LIGHT}`,
    style?:React.CSSProperties,
    onClick?:(id:string)=>void,
    id:string,
    name?:string,
    count?:string,
    error?:boolean,
    className?:string
}
const CustomButton:FC<CustombuttonInterface>=({style,count,onClick,id,error,className,children})=> {
    return (
        <div className={className} onClick={()=>{onClick && onClick(id)}}  style={style}>
                {count && <div className='custom-button-count-div'>{count}</div>}
                {error && <div className='custom-button-error'><ErrorComponent/></div>}
              {children}
        </div>
    )
}

export default CustomButton
