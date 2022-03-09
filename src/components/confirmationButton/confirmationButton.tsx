import React ,{FC,useState}from 'react'
import './confirmationButton.css';
interface ConfirmationButtonInterface{
  title:string,
  options:Array<string>,
  className?:string,
  optionClass?:string,
  onClick?:(index:number)=>void
}
const ConfirmationButton:FC<ConfirmationButtonInterface>=({title,options,className,optionClass,onClick}) =>{
  const [isClicked,setIsClicked]= useState<boolean>(false);
  const handleOptionClick=(index:number)=>{
    setIsClicked(false);
    onClick && onClick(index);
  }
  return (
      <button className={`confirmationButton-fulldiv `} title={title} type='button' onBlur={()=>setIsClicked(false)}>
        <div className="confirmationButton-option">
          {isClicked&& options.map((o,i)=><span className={`${optionClass}`} key={i} onClick={()=>handleOptionClick(i)}>{o}</span>)}
        </div>
        <span className={`confirmationButton-button ${className||'default'}`} title={title} onClick={()=>setIsClicked(true)}>{title}</span>
      </button>
  )
}

export default ConfirmationButton