import React,{FC, useEffect} from 'react'
import './guildButton.css'
import { MODETYPE } from '../../../../hooks/useMode';

interface GuildbuttonInterface{
    mode:`${MODETYPE.DARK}`|`${MODETYPE.LIGHT}`,
    onClick?:(id:string)=>void,
    id:string,
    avatar?:string,
    guildName:string
}
const GuildButton:FC<GuildbuttonInterface>=({mode,onClick,id,avatar,guildName})=> {
    return (
        <div className='guild-button-fulldiv' onClick={()=>{onClick && onClick(id)}} style={{background:mode===MODETYPE.DARK?'#555':'#656565'}}>
            {avatar && <img src={avatar} alt=''></img>}
            {!avatar && <span>{guildName.slice(0,1).toUpperCase()}</span>}
            <h3>{guildName}</h3>
        </div>
    )
}
export default GuildButton