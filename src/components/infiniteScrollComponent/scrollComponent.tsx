import React,{useRef,useEffect,useState, FC} from 'react'
import { MODETYPE } from '../../hooks/useMode'
import './scrollComponent.css'

interface ScrollComponentInterface {
    mode: `${MODETYPE.DARK}` | `${MODETYPE.LIGHT}`,
    hasMore: boolean,
    className?: string,
    triggerHeight?: number,
    onIntersect?: () => void
}

const ScrollComponent: FC<ScrollComponentInterface> = ({ hasMore, mode, children, className, triggerHeight, onIntersect }) => {
    const trigger = useRef<HTMLDivElement>(null)
    const state = useRef(false)

    useEffect(() => {
        const intersection = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting ) {
                onIntersect && onIntersect()
            }
        });
        if (trigger.current) intersection.observe(trigger.current)
        // return () => {
        //     if(trigger.current)intersection.unobserve(trigger.current)
        // }
    }, [])
    return (
        <div className='scrollComponent-fulldiv'>
            <div className={`scrollcomponent-outputdiv ${className}`}>
                {children}
                <div ref={trigger} className='scrollcomponent-triggerdiv' style={{ height: triggerHeight ? triggerHeight : '2rem', background: 'red' }} ></div>
            </div>
        </div>
    )
}

export default ScrollComponent
