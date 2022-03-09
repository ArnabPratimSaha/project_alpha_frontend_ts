import React, { FC, useEffect, useState } from 'react'
import Owl from '../owlComponent/owl';
import './navbar.css'
import Cookies from 'js-cookie';
import {FaDiscord} from "react-icons/fa";
import BotStatus from '../botStatus/botStaus';
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import { MODETYPE } from '../../hooks/useMode';
import { STATUS } from '../../hooks/useAuthentication';
import { useSelector } from 'react-redux';
import type { RootState} from '../../redux/reducers/allReducer';
import { useAppDispatch, useAppSelector } from '../../redux/hook/hook';
import { change, modeType } from '../../redux/reducers/modeReducer';

const Navbar=({  }) =>{
    const mode:modeType =useAppSelector((state:RootState)=>state.mode).mode;
    const { status, id, did, name, avatar,tag } =useAppSelector((state:RootState)=>state.user);
    const dispatch=useAppDispatch();

    const [isWindowOpen, setIsWindowOpen] = useState(false);
    const [shrink, setShrink] = useState(false);
    const [loadingPercentage, setLoadingPercentage] = useState(0);
    const [mobileSize, setMobileSize] = useState(window.innerWidth < 900 ? true : false);
    const navigate = useNavigate();
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    const handleLogout = () => {

    }
    const handleResize = () => {
        if (window.innerWidth > 900) {
            setIsWindowOpen(false);
            setMobileSize(false);
        } else {
            setMobileSize(true);
        }
    }
    const handleChange = () => {
        // updateMode && updateMode();
        dispatch(change());
    }
    const handleScroll = () => {
        if (window.scrollY > 400) {
            setShrink(true);
        } else {
            setShrink(false)
        }
    }
    const [botStatus, setBotStatus] = useState(Cookies.get('bot-status') ? false : true);
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        return () => {
            source.cancel('cancled the request');
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    useEffect(() => {
        setLoadingPercentage(loadingPercentage)
    }, [loadingPercentage])
    const handleFocus = () => {
        if (window.innerWidth < 900) {
            setIsWindowOpen((s) => !s);
        }
    }
    const handleLogin = () => {
        window.location.href = `${process.env.REACT_APP_BACKENDAPI}auth/discord`
    }
    const handleClose = () => {
        Cookies.set('bot-status', 'done');
    }
    return (
        <div className='navbar-fulldiv'>
            <div className='main-body' style={{ height: shrink ? '3.5rem' : '4rem', backgroundColor: mode === MODETYPE.DARK ? '#222' : '#a8a8a8' }}>
                <div className='navbar-overlay' style={{ backgroundColor: mode === MODETYPE.DARK ? '#222' : '#a8a8a8' }}></div>
                <div className='navbar-svg' style={{ backgroundColor: mode === MODETYPE.DARK ? '#222' : '#a8a8a8' }}>
                    <h1 style={{ color: mode === MODETYPE.DARK ? '#cacaca' : '#333' }}>VIVI</h1>
                </div>
                {mobileSize && <h1 className='navbar-brandname' style={{ backgroundColor: mode === MODETYPE.DARK ? '#222' : '#a8a8a8', color: mode === MODETYPE.DARK ? '#fff' : '#222' }}>ViVI</h1>}
                <div className='navbar-loading-div' style={{ backgroundColor: mode === MODETYPE.DARK ? '#222' : '#a8a8a8' }}>
                    <div className='navbar-loading-bar' style={{ transform: `scaleX(${loadingPercentage})` }}>
                    </div>
                </div>
                <div className='navbar-links' style={{ color: mode === MODETYPE.DARK ? '#fff' : '#222', backgroundColor: mode === MODETYPE.DARK ? '#222' : '#a8a8a8' }}>
                    <NavLink className='navbar-links__link' to={'/'} style={({ isActive }) => isActive ? { color: mode === MODETYPE.DARK ? '#fff' : '#111' } : { color: mode === MODETYPE.DARK ? '#666' : '#555' }}>
                        Home
                    </NavLink>
                    <NavLink className='navbar-links__link' to={`/dashboard/${id}/${did}`} style={({ isActive }) => isActive ? { color: mode === MODETYPE.DARK ? '#fff' : '#111' } : { color: mode === MODETYPE.DARK ? '#666' : '#555' }}>
                        Dashboard
                    </NavLink>
                    <NavLink className='navbar-links__link' to={`/log/${id}/${did}`} style={({ isActive }) => isActive ? { color: mode === MODETYPE.DARK ? '#fff' : '#111' } : { color: mode === MODETYPE.DARK ? '#666' : '#555' }}>
                        Log
                    </NavLink>
                    <NavLink className='navbar-links__link' to={'/learnmore'} style={({ isActive }) => isActive ? { color: mode === MODETYPE.DARK ? '#fff' : '#111' } : { color: mode === MODETYPE.DARK ? '#666' : '#555' }}>
                        Learn About
                    </NavLink>
                </div>
                <div className='navbar-credentials' style={{ color: mode === MODETYPE.DARK ? '#fff' : '#222', backgroundColor: mode === MODETYPE.DARK ? '#222' : '#a8a8a8' }}>
                    {status==='NOT_AUTHORIZED' && <button className='navbar-login' onClick={handleLogin}>Log in</button>}
                    {status !== 'NOT_AUTHORIZED' && <div className='navbar-loggedin-div'>
                        <div className='circle-image' >
                            <div className='circle-image__image'>
                                <img src={avatar||''} onClick={handleFocus} alt='alternate'/>
                                {status==='TEMPORARY' && <FaDiscord className='temp-user-discord-logo' />}
                            </div>
                            {!mobileSize && <span>{`${name} #${tag}`}</span>}
                        </div>
                        {!mobileSize && <button className='navbar-logout' onClick={handleLogout}>Log Out</button>}
                        {isWindowOpen && <div className='navbar-small-window' style={{ backgroundColor: mode === MODETYPE.DARK ? '#000' : '#444' }}>
                            <span >{`${name} #${tag}`}</span>
                            <button className='navbar-logout' onClick={handleLogout}>Log Out</button>
                        </div>}
                    </div>}
                    <div className='navbar-theme-togle' >
                        <Owl onChange={handleChange} mode={mode} />
                    </div>
                </div>
            </div>
            <div className='navlinks-mobile' style={{ height: shrink ? '0' : '2rem', backgroundColor: mode === MODETYPE.DARK ? '#555' : '#ffff', color: mode === MODETYPE.DARK ? '#fff' : '#222', }}>
                <NavLink className='navbar-links__link' to={'/'} style={({ isActive }) => isActive ? { color: mode === MODETYPE.DARK ? '#fff' : '#111' } : { color: mode === MODETYPE.DARK ? '#666' : '#555' }}>
                    Home
                </NavLink>
                <NavLink className='navbar-links__link' to={`/dashboard/${Cookies.get('temp_id') || Cookies.get('id')}/${Cookies.get('temp_discordId') || Cookies.get('discordId')}`} style={({ isActive }) => isActive ? { color: mode === MODETYPE.DARK ? '#fff' : '#111' } : { color: mode === MODETYPE.DARK ? '#666' : '#555' }}>
                    Dashboard
                </NavLink>
                <NavLink className='navbar-links__link' to={`/log/${Cookies.get('temp_id') || Cookies.get('id')}/${Cookies.get('temp_discordId') || Cookies.get('discordId')}`} style={({ isActive }) => isActive ? { color: mode === MODETYPE.DARK ? '#fff' : '#111' } : { color: mode === MODETYPE.DARK ? '#666' : '#555' }}>
                    Log
                </NavLink>
                <NavLink className='navbar-links__link' to={'/learnmore'} style={({ isActive }) => isActive ? { color: mode === MODETYPE.DARK ? '#fff' : '#111' } : { color: mode === MODETYPE.DARK ? '#666' : '#555' }}>
                    Learn About
                </NavLink>
            </div>
            {<BotStatus botStatus={botStatus} onClose={handleClose} />}
        </div>
    )
}
export default Navbar;