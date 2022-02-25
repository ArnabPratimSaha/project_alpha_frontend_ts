import React, { FC, useEffect } from 'react';
import { MODETYPE } from '../../hooks/useMode';
import './message.css';
import no_image from './images/no-image.png'
import { Member } from '../../interface/schema';
import MemberButton from './member/member';
import {Role} from '../../interface/schema'
interface MessageInterface{
    mode:`${MODETYPE.DARK}` | `${MODETYPE.LIGHT}`,
    members:Array<Member>,
    author?:Member,
    message:string,
    time?:Date,
    roles:Array<Role>,
    title?:string
}
const getTime=(date:Date):string=>{
    return ` ${date.toDateString()} ${date.getHours()}:${date.getMinutes()<10?`0${date.getMinutes()}`:date.getMinutes()}`
}
const Message:FC<MessageInterface>=({mode,members,author,message,time,roles,title})=> {
    useEffect(()=>{
        console.log(message);
    },[message])
    return (
        <div className={`message-fulldiv ${mode}-discord ${author && `message-label`}` }>
            <div className="message-left-div">
                <img src={no_image} alt='img'/>
            </div>
            <div className="message-right-div">
                <div className="message-right-div-name">
                    <h1>VIVI</h1>
                    <span className='message-right-div__bot'>BOT</span>
                    <span className='message-right-div__time'>{`${getTime(time||new Date())}`}</span>
                </div>
                <div className="message-right-div-mentions">
                    {roles.map(r=><div className='role-memtion-div' style={{color:r.color}}><div className='role-memtion-div__overlay' style={{background:r.color}}/>{`@${r.name}`}</div>)}
                    {members.map(m=><MemberButton mode={mode} id={m.id} key={m.id} name={m.name} isAdmin={m.isAdmin} nickName={m.name} roles={m.roles} tag={m.tag} avatar={m.avatar} />)}
                </div>
                <div className='message-right-div_message'>
                    {title&&<p className={`${mode}-discord_embeded`}>{title}</p>}
                    <span>{message.trim()}</span>
                    <div></div>
                </div>
                {author && <div className='message-right-div-author'> 
                    <p>{`Message Created by @${author.nickName||author.name}`}</p>
                </div> }
                <div className={`message-right-div-footer ${mode}-discord_embeded`}>
                    <h1>{`Message Created by Arnab Using VIVI`}</h1>
                    <p>{`Created By VIVI •${`${getTime(time||new Date())}`}`}</p>
                </div>
            </div>
        </div>
    )
}

export default Message