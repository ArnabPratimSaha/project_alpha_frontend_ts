import React,{useRef,useEffect,useState, FC} from 'react'
import './brightup.css'

interface BrightupInterface{
    delay?:number,
    type?:string,
    direction?:string
}
const Brightup:FC<BrightupInterface>=({delay,type,direction,children}) =>{
    const component = useRef(null)
    const isDone=useRef(false);
    const [isIntersecting, setIsIntersecting] = useState(false)
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isDone.current) {
                isDone.current = true;
                if(delay)
                {
                    setIsIntersecting(true);
                    setTimeout(() => {
                    }, delay);
                }
                else
                    setIsIntersecting(true);
            }
        });
        if(component.current)observer.observe(component.current)
        return ()=>{component.current && observer.unobserve(component.current);}
    }, [])

    return (
        <div ref={component} className='brightup-full-div' style={{transform:isIntersecting?`translate${type}(0)`:`translate${type}(${direction?direction:'+'}2rem)`,opacity:isIntersecting?1:0}}>
            {children}
        </div>
    )
}

export default Brightup
