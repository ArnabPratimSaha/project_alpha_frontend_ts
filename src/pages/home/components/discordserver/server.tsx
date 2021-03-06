import React, { FC } from 'react'
import './server.css';
import discordlogo from '../../images/discord-logo.png'
import { MdVerified,MdOutlineSupervisorAccount } from 'react-icons/md';
import { VscDebugBreakpointDataUnverified} from 'react-icons/vsc';
import { MODETYPE } from '../../../../hooks/useMode';
import { modeType } from '../../../../redux/reducers/modeReducer';
interface ServerInterface{
    img?:string,
    isPartnered?:boolean,
    name:string,
    membercount:string,
    mode:modeType
}
const Server:FC<ServerInterface>=({img,isPartnered,name,membercount,mode})=> {
    return (
        <div className='server-fulldiv' style={{backgroundColor:mode==='dark'?"#cacaca":'#666'}}>
            <div className='server-image-div'>
                <img src={img?img:discordlogo} alt='alter'/>
            </div>
            <div className='server-info-div' style={{color:mode==='dark'?'#fff':'#222'}}>
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