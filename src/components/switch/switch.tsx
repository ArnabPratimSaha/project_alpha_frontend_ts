import React,{useState,useEffect, FC} from 'react'
import './switch.css';
interface SwitchInterface{
    left:string|'left',
    right:string|'right,'
    position:'left'|'right',
    onChange?:(position:"left" | "right")=>void
}

const Switch:FC<SwitchInterface>=({left,right,position,onChange})=> {
    const [toggler, setToggler] = useState<typeof position>(position)
    const handleToggler: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        let newPosition = toggler;
        setToggler((s) => {
            if (s === 'left') {
                newPosition = 'right';
                return 'right';
            }
            else {
                newPosition = 'left';
                return 'left';
            }
        })
        onChange && onChange(newPosition)
    }
    return (
        <div className='switch-fulldiv'>
            <div className='switch-left-div'>
                <p>{left}</p>
                <div className='switch-bottombar' style={{transform:toggler==='left'?'scaleX(1)':'scaleX(0)'}}></div>
            </div>
            <div className='switch-div-switch' onClick={handleToggler}>
                <div className='switch-bar'></div>
                <div className='switch-toggeler' style={{transform:toggler==='left'?'translate(0px,-50%)':'translate(40px,-50%)'}}></div>
            </div>
            <div className='switch-right-div'>
                <p>{right}</p>
                <div className='switch-bottombar' style={{transform:toggler==='right'?'scaleX(1)':'scaleX(0)'}}></div>
            </div>
        </div>
    )
}

export default Switch
