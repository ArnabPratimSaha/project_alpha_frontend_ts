import React, { FC } from 'react'
import './server.css';
import discordlogo from '../../images/discord-logo.png'
import { MdVerified,MdOutlineSupervisorAccount } from 'react-icons/md';
import { VscDebugBreakpointDataUnverified} from 'react-icons/vsc';
import { MODETYPE } from '../../../../hooks/useMode';
interface ServerInterface{
    img?:string,
    isPartnered?:boolean,
    name:string,
    membercount:string,
    mode:MODETYPE
}
const Server:FC<ServerInterface>=({img,isPartnered,name,membercount,mode})=> {
    return (
        <div className='server-fulldiv' style={{backgroundColor:mode===MODETYPE.DARK?"#cacaca":'#666'}}>
            <div className='server-image-div'>
                <img src={img?img:discordlogo} alt='alter'/>
            </div>
            <div className='server-info-div' style={{color:mode===MODETYPE.DARK?"#000":'#fff'}}>
                <div className='server-info-name'>
                    {isPartnered&&<MdVerified className='server-info-logo'/>}
                    {!isPartnered&&<VscDebugBreakpointDataUnverified/>}
                    <p>{name}</p>
                </div>
                <div className='server-info-count'>
                    <MdOutlineSupervisorAccount className='server-info-logo'/>
                    <p>{membercount}</p>
                </div>
            </div>
        </div>
    )
}
export default Server;