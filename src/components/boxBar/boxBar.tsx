import React,{useState,useEffect,useRef, FC} from 'react'
import './boxBar.css';
import { FiExternalLink } from 'react-icons/fi';
import { IoPersonSharp } from 'react-icons/io5';
import { AiFillStar,AiOutlineStar,AiFillCheckCircle,AiFillClockCircle,AiFillWarning } from 'react-icons/ai';
import { MODETYPE } from '../../hooks/useMode';
import './color.css';
import ConfirmationButton from '../confirmationButton/confirmationButton';
import { Log } from '../../interface/schema';
import { GiOfficeChair, GiWifiRouter } from "react-icons/gi";
import { GoPrimitiveDot } from "react-icons/go";
import HintText from '../hint text/hintText';
import useRequest from '../../hooks/useRequest';
import { STATUS } from '../../hooks/useAuthentication';
import axios,{AxiosRequestHeaders} from 'axios';
enum MessageStatus{
    PROCESSING='PROCESSING',
    CANCELLED='CANCELLED',
    SENT='SENT',
}
const discordDivStyle=(s:`${MessageStatus.CANCELLED}`|`${MessageStatus.PROCESSING}`|`${MessageStatus.SENT}`):React.CSSProperties=>{
    if(s===MessageStatus.SENT)
    return {backgroundColor:'#81B214',borderColor:'#81B214'}
    else if(s===MessageStatus.CANCELLED)
    return {backgroundColor:'#B61919',borderColor:'#B61919'}
    else 
    return {backgroundColor:'#2541B2',borderColor:'#2541B2'}
}

const makeGuildIcon=(s:string)=>{
    let array=s.split(/\s+/g);
    let icon='';
    array.forEach(e=>{icon=`${icon}${e.slice(0,1).toUpperCase()}`})
    return icon;
}
interface NewbarInterface {
    log:Log,
    status: `${STATUS.TEMPORARY}` | `${STATUS.NOT_AUTHORIZED}` | `${STATUS.PERMANENT}`,
    mode: `${MODETYPE.DARK}` | `${MODETYPE.LIGHT}`,
    updateAccesstoken: (token: string) => void,
    onStarClick?:(mid:string,to:boolean)=>void,
    parentRef?:React.LegacyRef<HTMLDivElement>,
    userId?: string,
    accesstoken?: string,
    refreshtoken?: string
}
const NewBar:FC<NewbarInterface>=({userId,accesstoken,refreshtoken,mode,log,onStarClick,parentRef,status,updateAccesstoken}) =>{
    const { makeRequst, loading } = useRequest(status, updateAccesstoken);
    const [messageStatus,setMessageStatus]=useState< "CANCELLED" | "PROCESSING" | "SENT">(log.status);
    const [star, setStar] = useState<boolean>(log.favourite)
    const [remainingTime, setRemainingTime] = useState<number>(new Date(log.delivertime).getTime()-new Date().getTime())
    const [remainingTimeString, setRemainingTimeString] = useState('')
    const [hover, setHover] = useState(log.favourite);
    const [ticking, setTicking] = useState<number>(1);
    useEffect(() => {
        if (messageStatus === MessageStatus.PROCESSING) {
            if (log.delivertime) {
                setRemainingTime(new Date(log.delivertime).getTime() - new Date().getTime())
            }
            let timer = setInterval(() => {
                setTicking((s) => s + 1)
            }, 1000);
            return () => {
                if (timer)
                    clearInterval(timer)
            }
        }
    }, [log.delivertime])
    useEffect(() => {
        if (messageStatus === MessageStatus.PROCESSING) {
            if (log.delivertime)
                setRemainingTime(new Date(log.delivertime).getTime() - new Date().getTime())
        }
    }, [ticking])
    useEffect(() => {
        if (messageStatus === MessageStatus.PROCESSING) {
            if (remainingTime >= 0) {

                let days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
                let hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let mins = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                let secs = Math.floor((remainingTime % (1000 * 60)) / 1000);
                setRemainingTimeString(`${days}D ${hours}H ${mins}MM ${secs}S`)
            }
        }
    }, [remainingTime])
    const handleStarClick=async(change:boolean)=>{
        setStar(change)
        onStarClick && onStarClick(log.messageId,!star)
        if (status === STATUS.NOT_AUTHORIZED) return;
        const header: AxiosRequestHeaders = {
            ['id']: userId?.toString() || '',
            ['accesstoken']: accesstoken?.toString() || '',
            ['refreshtoken']: refreshtoken?.toString() || ''
        }
        try {
            const res = await makeRequst(`${process.env.REACT_APP_BACKENDAPI}message/favourite`, {
                method: 'patch',
                headers: header,
                body:{mid:log.messageId}
            });
            if(res?.status===200){
                setStar(s=>res.data.message.favourite||s)
            }
        } catch (error) {
        }
    }
    const handleOptionClick:((index: number) => void)=async(index:number)=>{
        if(index===1){
            if (status === STATUS.NOT_AUTHORIZED) return;
            const header: AxiosRequestHeaders = {
                ['id']: userId?.toString() || '',
                ['accesstoken']: accesstoken?.toString() || '',
                ['refreshtoken']: refreshtoken?.toString() || ''
            }
            try {
                const res = await makeRequst(`${process.env.REACT_APP_BACKENDAPI}message/`, {
                    method: 'DELETE',
                    headers: header,
                    body:{mid:log.messageId}
                });
                if(res?.status===200){
                    const message=res.data.message;
                    if(message && message.status)
                        setMessageStatus(message.status)
                }
            } catch (error) {
                
            }
        }
    }
    return (
        <div ref={parentRef} className={`bar-fulldiv ${mode}-boxcard`} onMouseEnter={()=>{setHover(true)}} onMouseLeave={()=>{setHover(false)}}>
            <div className="boxbar-topdiv">
                <div className="barbox-top-left">
                    <div className='discord-div-pic'>
                        {!log.guildData?.icon && <div className={`discord-div-pic__custom ${mode}-2`}>{makeGuildIcon(log.guildData?.name||'n a')}</div>}
                        {log.guildData?.icon && <img src={log.guildData?.icon} alt='' />}
                    </div>
                    <span className='discord-div-name'>{`${log.guildData?.name}`.slice(0,20)}{`${log.guildData?.name}`.slice(20)&&`...`}</span>
                </div>
                <div className="barbox-top-right">
                    <div className={`status-div ${mode}-status-div`}  style={{...discordDivStyle(messageStatus)}}>
                        {messageStatus===MessageStatus.CANCELLED && <div className='cancel-div'  >
                            <AiFillWarning className='status-icon'/>
                            <p>cancelled</p>
                        </div> }
                        {messageStatus===MessageStatus.SENT && <div className='done-div' >
                            <AiFillCheckCircle className='status-icon'/>
                            <p>sent</p>
                        </div> }
                        {messageStatus===MessageStatus.PROCESSING && <div className='ongoing-div'>
                                <AiFillClockCircle className='status-icon'/>
                                <p>{remainingTimeString}</p>
                        </div>}
                    </div>
                </div>
            </div>
            <div className="boxbar-title">
                <span>{log.title.length===0&&`[No Title]`}</span>
                <span>{log.title.slice(0,30)}{log.title.slice(30)&&'...'}</span>
            </div>
            <div className='boxbar-message-info'>
                {log.members && log.members.length>0 &&<div className="info-member">
                    <IoPersonSharp/>
                    <span>{log.members.length}</span>
                </div>}
                {log.roles && log.roles.length>0 &&<div className="info-member">
                    <GiOfficeChair/>
                    <span>{log.roles.length}</span>
                </div>}
            </div>
            <div className="boxbar-bottom-bar">
                <div className="boxbar-bottombar__left">
                    <span className='boxbar-bottom-bar-type'>{log.type}</span>
                    <GoPrimitiveDot/>
                    {star?
                        <HintText hint='remove from favourite'>
                            <AiFillStar className='boxbar-star boxbar-fill-star' onClick={()=>handleStarClick(false)} />
                        </HintText>
                        :   
                        <HintText hint='set as favourite'>
                            <AiOutlineStar onClick={()=>handleStarClick(true)} className='boxbar-star'/>
                        </HintText>
                    }
                </div> 
                {messageStatus==='PROCESSING'&&<ConfirmationButton  className='danger' title={'cancel'} options={['No','Yes']} onClick={handleOptionClick} />}
            </div>
        </div>
    )
}
export default NewBar
