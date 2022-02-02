import React, { FC } from 'react'
import './input.css';
import { BsSearch } from 'react-icons/bs';
import { MODETYPE } from '../../../../hooks/useMode';

interface InputInterface{
    className?:string,
    mode?:`${MODETYPE.DARK}`|`${MODETYPE.LIGHT}`,
    value?:string,
    onChange?:(event:React.ChangeEvent<HTMLInputElement>)=>void,
    placeholder?:string
}
const Input:FC<InputInterface>=({mode,className,value,onChange,placeholder})=> {
    return (
        <div className={`input-component-fulldiv ${className}`} >
            <div className='input-component-icons' style={{background:mode===MODETYPE.DARK?'#666':'#cacaca',color:mode===MODETYPE.DARK?'#cacaca':'#222'
            ,boxShadow:mode===MODETYPE.DARK?'2px 2px 4px #333':'2px 2px 4px #666'}}>
                <BsSearch />
            </div>
            <input style={{color:mode===MODETYPE.DARK?'#fff':'#222'}} value={value} onChange={(e)=>{onChange &&  onChange(e)}} placeholder={placeholder}></input>
        </div>
    )
}

export default Input
