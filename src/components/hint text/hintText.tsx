import React, { FC, useState } from 'react';
import './hintText.css';
interface HintTextInterface{
  hint:string,
  className?:string
}

const HintText:FC<HintTextInterface>=({children,hint,className})=> {
  const [hover,setHover]= useState<boolean>(false);
  return (
    <div className={`hinttext-fulldiv`}>
      <span  className={`hintText-hint`} style={{display:hover?'block':'none'}}>{hint}</span>
      <div className={`hinttext-children ${className}`} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
        {children}
      </div>
    </div>
  )
}

export default HintText