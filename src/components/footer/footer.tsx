import React, { FC } from 'react'
import { MODETYPE } from '../../hooks/useMode';
import RobotHead from '../robotHead/robotHead'
import './footer.css';
interface FooterInterface{
    mode:MODETYPE
}
const Footer:FC<FooterInterface>=({mode})=> {
    return (
        <div className='footer-fulldiv' style={{background:mode===MODETYPE.DARK?'#222':'#acacac'}}>
            <div className='footer-left-div'>
                <div className='left-div-robot-div' style={{textShadow:mode===MODETYPE.DARK?'2px 2px 10px #00bfff':'2px 2px 10px #444'}}>
                    <RobotHead/>
                    <h1 style={{color:mode===MODETYPE.DARK?'#fff':'#000'}}>VIVI</h1>
                </div>
                <p style={{color:mode===MODETYPE.DARK?'#cacaca':'#222'}}>Bot for sending message to your channel and other people.</p>
                <p className='copyright-section' style={{color:mode===MODETYPE.DARK?'#fff':'#000'}}>{`Copyright © ${new Date().getFullYear()} - ${new Date().getFullYear()+1} All Right Reserved`}</p>
            </div>
            <div className='footer-right-div' style={{color:mode===MODETYPE.DARK?'#fff':'#000'}}>
                <div className='footer-right-div__one'>
                    <p >Heading Placeholder</p>
                    <a href="#">Placeholder</a>
                    <a href="#">Placeholder</a>
                    <a href="#">Placeholder</a>
                </div>
                <div className='footer-right-div__two' style={{color:mode===MODETYPE.DARK?'#fff':'#000'}}>
                    <p >Heading Placeholder</p>
                    <a href="#">Placeholder</a>
                    <a href="#">Placeholder</a>
                    <a href="#">Placeholder</a>
                </div>
                <div className='footer-right-div__three' style={{color:mode===MODETYPE.DARK?'#fff':'#000'}}>
                    <p >Heading Placeholder</p>
                    <a href="#">Placeholder</a>
                    <a href="#">Placeholder</a>
                    <a href="#">Placeholder</a>
                </div>
            </div>
        </div>
    )
}

export default Footer
