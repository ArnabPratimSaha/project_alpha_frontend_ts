import React,{FC, useRef} from 'react'
import './memberButton.css'
import { AiFillPlusSquare } from 'react-icons/ai';
import { FaMinusSquare } from 'react-icons/fa';
import { MODETYPE } from '../../../../hooks/useMode';

let name;
enum TYPE {
    add='add',
    remove='remove'
}
interface MemberbuttonInterface{
    id:string,
    onClick:(id:string)=>void,
    img?:string
    nickName?:string,
    userName:string,
    mode?:`${MODETYPE.DARK}`|`${MODETYPE.LIGHT}`,
    userTag:string,
    type: `${TYPE.add}`|`${TYPE.remove}`,
    classNameFullDiv?:string,
    classNameIcon?:string,
    classNameInfoDiv?:string,
    classNameChildrenDiv?:string,
    style?:React.CSSProperties,
    status:'online' | 'idle' | 'dnd'| 'offline'|'invisible'
}
const MemberButton:FC<MemberbuttonInterface>=({nickName,img,userName,status,mode,userTag,children,type,onClick,id,classNameIcon,classNameFullDiv,classNameInfoDiv,classNameChildrenDiv,style})=>{
    return (
        <div className={`memberbutton-fulldiv ${classNameFullDiv} ${mode}-3`} style={{...style}}>
            <div className='memberbutton-imagediv'>
                {img && <img src={img} alt='alt'></img>}
                <div className={`memberbutton-statusdiv status-${status}`}></div>
            </div>
            <div className={`memberbutton-infoDiv ${classNameInfoDiv}`}>
               {nickName && <h6>{nickName}</h6>}
               {!nickName && userName && <h6>{userName}#{userTag}</h6>}
               {nickName && <p>{userName}#{userTag}</p>}
            </div>
            <div className={classNameChildrenDiv}>
                {children}
            </div>
            {
                type===TYPE.add && <AiFillPlusSquare style={{color:mode===MODETYPE.DARK?'#fff':'#333'}} className={`memberbutton-icon ${classNameIcon}`} onClick={() => { onClick(id) }} />
            }
            {
                type===TYPE.remove && <FaMinusSquare style={{color:mode===MODETYPE.DARK?'#fff':'#333'}} className={`memberbutton-icon ${classNameIcon}`} onClick={() => { onClick(id) }} />
            }
        </div>
    )
}

export default MemberButton
