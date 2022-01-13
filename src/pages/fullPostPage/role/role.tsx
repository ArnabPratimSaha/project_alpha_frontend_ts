import React, { FC } from 'react'
import { MODETYPE } from '../../../hooks/useMode';
import './role.css';
interface RoleInterface{
    mode: `${MODETYPE.DARK}` | `${MODETYPE.LIGHT}`,
    isAdmin:boolean,
    name?:string
}

const Role:FC<RoleInterface>=({mode,name,isAdmin})=> {
    return (
        <div style={{backgroundColor:mode===MODETYPE.DARK?'#fff':'#cacaca'}} className='role-view-fulldiv'>
            {isAdmin&&<div className='role-admin-div'>
                <span>A</span>
            </div>}
            {!name&&<p style={{color:'#333'}} className='role-deleted-role'>deleted role</p>}
            {name&&<p style={{color:'#333'}} className='role-role-name'>{name}</p>}
        </div>
    )
}

export default Role