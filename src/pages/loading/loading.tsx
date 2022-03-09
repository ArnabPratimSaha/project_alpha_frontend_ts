import React,{FC} from 'react'
import { MODETYPE } from '../../hooks/useMode';
import { useAppSelector } from '../../redux/hook/hook';
import './loading.css';
import type { RootState } from '../../redux/reducers/allReducer';
import { modeType } from '../../redux/reducers/modeReducer';
// import Navbar from '../../component/navbar/navbar';
const Loading=()=> {
    const mode:modeType=useAppSelector((state:RootState)=>state.mode.mode)
    return (
        <div className='loading-topdiv' style={{ backgroundColor: mode === 'dark' ? '#444' : '#cacaca' }}>
            {/* <Navbar mode={mode} MODETYPE={MODETYPE} updateMode={updateMode} onStatusChange={onStatusChange}/> */}
            <div className='loading-spinner' style={{ background:mode === 'dark' ? '#444' : '#cacaca',color: mode === 'dark' ? '#fff' : '#444' }}>
                <span>V</span>
                <span>I</span>
                <span>V</span>
                <span>I</span>
            </div>
            <div className='loading__loading'  style={{ color: mode === 'dark' ? '#fff' : '#444' }}>
                <p>Loading</p>
                <p className='loading-dot'>...</p>
            </div>
        </div>
    )
}
const Authenticating=()=>{
    const mode:modeType=useAppSelector((state:RootState)=>state.mode.mode)
    return (
        <div className='loading-topdiv' style={{ backgroundColor: mode === 'dark' ? '#444' : '#cacaca' }}>
            <div className='loading-spinner' style={{ background: mode === 'dark' ? '#444' : '#cacaca', color: mode === 'dark' ? '#fff' : '#444' }}>
                <span>V</span>
                <span>I</span>
                <span>V</span>
                <span>I</span>
            </div>
            <div className='loading__loading' style={{ color: mode === 'dark' ? '#fff' : '#444' }}>
                <p >Authenticating</p>
                <p className='loading-dot'>...</p>
            </div>
        </div>
    )
}
export { Loading, Authenticating }
