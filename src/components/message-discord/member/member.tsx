import React, { FC,useState ,useRef,useEffect} from 'react'
import {Member as MemberInterface} from '../../../interface/schema';
import './member.css';
import image from '../images/no-image.png';
import { MODETYPE } from '../../../hooks/useMode';
interface MemberComponentInterface extends MemberInterface {
    mode: `${MODETYPE.DARK}` | `${MODETYPE.LIGHT}`,
}
const Member:FC<MemberComponentInterface>=({name,nickName,id,isAdmin,roles,tag,avatar,mode})=> {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const handleClick=()=>{
        setIsVisible(s=>!s);
    }
    return (
        <button type='button'  onBlur={()=>{setIsVisible(false);} }  title={nickName||name} className='discord-member-fulldiv'>
            <span className='discord-member-fulldiv_button' onClick={handleClick} >{`@${nickName || name}`}</span>
            <div className={`discord-member-overlay ${mode}-shadder ${mode}-card`} style={{ display: isVisible ? 'flex' : 'none' }}>
                <div className="discord-member-overlay_top">
                    <img src={avatar||image} alt='dada' style={{ borderColor: mode==='dark'?'#18191c':'#ffff' }}></img>
                </div>
                <div className="discord-member-overlay_info">
                    <div className="discord-member-overlay_info_user">
                        {nickName && <h2>{nickName}</h2>}
                        {!nickName && <h2>{`${name}#${tag}`}</h2>}
                        <h3>{`${name}#${tag}`}</h3>
                    </div>
                    <span className='discord-member-overlay_underline'></span>
                    <div className="discord-member-overlay_roles">
                        {roles.map(r => <div className='discord-member-overlay_roles__role'>
                            <span style={{ background: `${r.color}` }} />
                            <p>{r.name}</p>
                        </div>)}
                    </div>
                </div>
            </div>
        </button>
    )
}
export default Member;