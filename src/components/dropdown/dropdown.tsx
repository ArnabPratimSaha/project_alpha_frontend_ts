import React,{useState,useEffect, FC} from 'react'
import './dropdown.css';
import { AiOutlineCaretDown } from 'react-icons/ai';
import { MODETYPE } from '../../hooks/useMode';

interface DropdownInterface{
    className?:string,
    options:Array<string>,
    onChange:(index:number)=>void,
    mode:`${MODETYPE.DARK}`|`${MODETYPE.LIGHT}`,
}
const Dropdown:FC<DropdownInterface>=({className,options,onChange,mode})=> {
    const [drawer, setDrawer] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0)
    const handleDropdownClick=()=>{
        setDrawer((s)=>!s);
    }
    useEffect(() => {
        onChange && onChange(selectedIndex)
    }, [selectedIndex])
    return (
        <button className={`dropdown-fulldiv ${className}`} onBlur={()=>{setDrawer(false)}}>
            <div className='dropdown-box' onClick={handleDropdownClick} style={{ borderColor: mode === MODETYPE.DARK ? '#cacaca' : '#555', color: mode === MODETYPE.DARK ? '#fff' : '#222' }}>
                <div className='dropdown-box-selecteditem'>
                    <span>{options && options[selectedIndex]}</span>
                </div>
                <AiOutlineCaretDown className='dropdown-icons' />
            </div>
            <div className='dropdown-option' style={{ display: drawer ? 'block' : 'none', background: mode === MODETYPE.DARK ? '#666' : '#fff', color: mode === MODETYPE.DARK ? '#fff' : '#222' }}>
                {options && options.map((e, index) => {
                    return (
                        <div key={index} className={`dropdown-option-item ${index === options.length - 1 && 'dropdown-option-item__last'}`}
                            onClick={() => {
                                setSelectedIndex(index)
                                setDrawer(false)
                            }}>
                            <span>{e}</span>
                        </div>
                    )
                })}
            </div>
        </button>
    )
}

export default Dropdown