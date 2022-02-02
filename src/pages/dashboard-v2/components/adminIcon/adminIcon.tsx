import React, { FC } from 'react'
import { MODETYPE } from '../../../../hooks/useMode'

interface AdminInterface{
    mode?:`${MODETYPE.DARK}`|`${MODETYPE.LIGHT}`,
    style?:React.CSSProperties
}
const  AdminIcon:FC<AdminInterface>=({style})=> {
    return (
        <p style={{background:'#545454',color:'#fff',margin:'0 5px',display:'inline',padding:'0 2px',border:'1px solid transparent',borderRadius:'2px',...style}}>A</p>
    )
}

export default AdminIcon
