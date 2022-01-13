import React,{useState,useEffect,useRef, FC} from 'react'
import './bar.css';
import { FiExternalLink } from 'react-icons/fi';
import { AiFillStar,AiOutlineStar,AiFillCheckCircle,AiFillClockCircle,AiFillWarning } from 'react-icons/ai';
import { MODETYPE } from '../../hooks/useMode';
enum STATUS{
    PROCESSING='PROCESSING',
    CANCELLED='CANCELLED',
    SENT='SENT',
}
const discordDivStyle=(s:`${STATUS.CANCELLED}`|`${STATUS.PROCESSING}`|`${STATUS.SENT}`)=>{
    if(s===STATUS.SENT)
    return {backgroundColor:'#81B214',borderColor:'#81B214'}
    else if(s===STATUS.CANCELLED)
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
interface NewbarInterface{
    time:Date,
    status:`${STATUS.CANCELLED}`|`${STATUS.PROCESSING}`|`${STATUS.SENT}`,
    fav:boolean,
    guildName:string,
    icon:string,
    mode:`${MODETYPE.DARK}`|`${MODETYPE.LIGHT}`,
    title:string,
    uid?:string,
    did?:string,
    mid:string,
    onStarClick?:(mid:string,to:boolean)=>void,
    parentRef?:React.LegacyRef<HTMLDivElement>
}
const NewBar:FC<NewbarInterface>=({time,status,fav,guildName,mode,title,icon,uid,did,mid,onStarClick,parentRef}) =>{
    const [size, setSize] = useState(false)
    const [star, setStar] = useState<boolean>(false)
    const [remainingTime, setRemainingTime] = useState<number>(new Date(time).getTime()-new Date().getTime())
    const [remainingTimeString, setRemainingTimeString] = useState('')
    const [hover, setHover] = useState(fav);
    const [ticking, setTicking] = useState<number>(1);
    useEffect(() => {
        if (status === STATUS.PROCESSING) {
            if (time) {
                setRemainingTime(new Date(time).getTime() - new Date().getTime())
            }
            let timer = setInterval(() => {
                setTicking((s) => s + 1)
            }, 1000);
            return () => {
                if (timer)
                    clearInterval(timer)
            }
        }
    }, [time])
    useEffect(() => {
        if (status === STATUS.PROCESSING) {
            if (time)
                setRemainingTime(new Date(time).getTime() - new Date().getTime())
        }
    }, [ticking])
    useEffect(() => {
        if(fav)
            setStar(fav)
    }, [fav])
    useEffect(() => {
        if (status === STATUS.PROCESSING) {
            if (remainingTime >= 0) {

                let days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
                let hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let mins = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                let secs = Math.floor((remainingTime % (1000 * 60)) / 1000);
                setRemainingTimeString(`${days}D ${hours}H ${mins}MM ${secs}S`)
            }
        }
    }, [remainingTime])
    const handleStarClick:React.MouseEventHandler<SVGElement>=()=>{
        setStar((s)=>!s)
        onStarClick && onStarClick(mid,!star)
    }
    return (
        <div ref={parentRef} className='bar-fulldiv' onMouseEnter={()=>{setHover(true)}} onMouseLeave={()=>{setHover(false)}}>
            <div className='bar-bardiv' onClick={()=>{setSize((s)=>!s)}} style={{backgroundColor:mode===MODETYPE.DARK?'#222':'#cacaca',borderColor:mode===MODETYPE.DARK?'#555':'#666'}}>
                <div className='discord-div'style={{backgroundColor:mode===MODETYPE.DARK?'#333':'#666'}} >
                    <div className='discord-div-pic'>
                        {!icon && <div>{makeGuildIcon(guildName)}</div> }
                        {icon && <img src={icon} alt=''/>}
                    </div>
                    <p>{guildName}</p>
                </div>
                <div className='message-div' onClick={()=>{window.location.href=`/post/${uid}/null/${did}/${mid}`}} style={{color:mode===MODETYPE.DARK?'#fff':'#000'}}>
                    <p>{title}</p>
                </div>
                <div className='status-div'  style={{...discordDivStyle(status)}}>
                   {status===STATUS.CANCELLED && <div className='cancel-div'  >
                       <AiFillWarning className='status-icon'/>
                       <p>cancelled</p>
                   </div> }
                   {status===STATUS.SENT && <div className='done-div' >
                       <AiFillCheckCircle className='status-icon'/>
                       <p>sent</p>
                   </div> }
                   {status===STATUS.PROCESSING && <div className='ongoing-div'>
                        <AiFillClockCircle className='status-icon'/>
                        <p>{remainingTimeString}</p>
                    </div>}
                </div>
                <div className='status-div-icon-div' style={{color:mode===MODETYPE.DARK?'#fff':'#222'}}>
                    <FiExternalLink className='bar-icon' onClick={()=>{}}/>
                    {star?<AiFillStar  className='bar-icon' style={{color:'yellow'}} onClick={handleStarClick}/>:<AiOutlineStar className='bar-icon' onClick={handleStarClick}/>}
                </div>
            </div>
        </div>
    )
}
export default NewBar
