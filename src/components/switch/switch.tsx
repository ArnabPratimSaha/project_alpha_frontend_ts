import React,{useState,useEffect, FC} from 'react'
import './switch.css';
interface SwitchInterface{
    left:string|'left',
    right:string|'right,'
    position:'left'|'right',
    onChange?:()=>void
}

const Switch:FC<SwitchInterface>=({left,right,position,onChange})=> {
    const handleToggler: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        onChange && onChange()
    }
    return (
        <div className='switch-fulldiv'>
            <div className='switch-left-div'>
                <p>{left}</p>
                <div className='switch-bottombar' style={{transform:position==='left'?'scaleX(1)':'scaleX(0)'}}></div>
            </div>
            <div className='switch-div-switch' onClick={handleToggler}>
                <div className='switch-bar'></div>
                <div className='switch-toggeler' style={{transform:position==='left'?'translate(0px,-50%)':'translate(40px,-50%)'}}></div>
            </div>
            <div className='switch-right-div'>
                <p>{right}</p>
                <div className='switch-bottombar' style={{transform:position==='right'?'scaleX(1)':'scaleX(0)'}}></div>
            </div>
        </div>
    )
}

export default Switch
