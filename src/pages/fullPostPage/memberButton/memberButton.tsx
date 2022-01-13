import React, { FC } from 'react'
import { MODETYPE } from '../../../hooks/useMode';
import './memberButton.css';
interface MemberbuttonInterface{
    mode: `${MODETYPE.DARK}` | `${MODETYPE.LIGHT}`,
    userName:string,
    userTag:string,
    avater:string
}
const MemberButton:FC<MemberbuttonInterface>=({mode,userName,userTag,avater}) =>{
    return (
        <div className='member-button-fulldiv'>
            <div className='memberButton-left-div'>
                <img src={avater} alt=''></img>
            </div>
            <div className='memberButton-right-div'>
                <div className='memberButton-userName'>
                    <h3 style={{ color: mode === MODETYPE.DARK ? '#f8f8f8' : '#333' }}>{userName}</h3>
                </div>
                <div className='memberButton-userTag'>
                    <p style={{ color: mode === MODETYPE.DARK ? '#cacaca' : '#333' }}>{userTag}</p>
                </div>
            </div>
        </div>
    )
}

export default MemberButton
