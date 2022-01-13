import React,{useState,useEffect, FC} from 'react'
import './pageToggler.css';
import { AiOutlineClockCircle,AiFillStar } from 'react-icons/ai';
interface PageTogglerinterface{
    type?:'LEFT'|"RIGHT",
    onChange?:(type:'LEFT'|'RIGHT')=>void
}
const PageToggler:FC<PageTogglerinterface>=( {type,onChange})=> {
    return (
        <div className='pagetoggler-fulldiv'>
            <div className='pagetoggler-history' onClick={()=>{onChange && onChange('LEFT')}} style={{transform:type==='LEFT'?'scale(1)':'scale(.8)'}}>
                <AiOutlineClockCircle className='pagetoggler-icons' />
            </div>
            <div className='pagetoggler-favourite' onClick={()=>{onChange && onChange('RIGHT')}} style={{transform:type==='RIGHT'?'scale(1)':'scale(.8)'}}>
                <AiFillStar className='pagetoggler-icons' />
            </div>
        </div>
    )
}

export default PageToggler
