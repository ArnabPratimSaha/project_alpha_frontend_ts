import React, { FC } from 'react';
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
    message:string
}
const getTime=(date:Date):string=>{
    return `${date.getHours()}:${date.getMinutes()<10?`0${date.getMinutes()}`:date.getMinutes()}`
}
const Message:FC<MessageInterface>=({mode,members,author,message})=> {
    return (
        <div className={`message-fulldiv ${mode}-discord ${author && `message-label`}` }>
            <div className="message-left-div">
                <img src={no_image} alt='img'/>
            </div>
            <div className="message-right-div">
                <div className="message-right-div-name">
                    <h1>VIVI</h1>
                    <span className='message-right-div__bot'>BOT</span>
                    <span className='message-right-div__time'>{`Today at ${getTime(new Date())}`}</span>
                </div>
                <div className="message-right-div-mentions">
                    {members.map(m=><MemberButton mode={mode} id={m.id} key={m.id} name={m.name} isAdmin={m.isAdmin} nickName={m.name} roles={m.roles} tag={m.tag} avatar={m.avatar} />)}
                </div>
                <div className='message-right-div_message'>
                    <span>{message.trim()}</span>
                    <div></div>
                </div>
                {author && <div className='message-right-div-author'> 
                    <p>{`Message Created by @${author.nickName||author.name}`}</p>
                </div> }
                <div className={`message-right-div-footer ${mode}-discord_embeded`}>
                    <h1>{`Message Created by Arnab Using VIVI`}</h1>
                    <p>{`Created By VIVI •${`Today at ${getTime(new Date())}`}`}</p>
                </div>
            </div>
        </div>
    )
}

export default Message
const role:Role={
    name:'dadad',
    id:'dawdad',
    isAdmin:true,
    color:'00bfff'
  }
  const me:Member={
    name:"arnab",
    nickName:'alapon',
    id:'adadadadawda',
    isAdmin:true,
    avatar:'dad',
    tag:'dada',
    roles:[role,role,role,role]
  }