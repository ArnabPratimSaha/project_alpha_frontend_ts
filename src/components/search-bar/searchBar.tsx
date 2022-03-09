import React,{useState,useEffect, FC} from 'react'
import './searchBar.css'
import { BiSearchAlt } from 'react-icons/bi';
import { MODETYPE } from '../../hooks/useMode';
interface SearchBarInterface{
    onChange:(value:string)=>void,
    mode:`${MODETYPE.DARK}`|`${MODETYPE.LIGHT}`,
    placeholder?:string
}
const SearchBar:FC<SearchBarInterface>=({onChange,mode,placeholder})=> {
    const [inputValue, setInputValue] = useState<string>('')
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false)
    useEffect(() => {
        onChange && onChange(inputValue.trim())
    }, [inputValue])
    return (
        <div className='searchbar-fulldiv' style={{color:mode===MODETYPE.DARK?'#fff':'#222'}}>
            <BiSearchAlt className='searchbar-icon'/>
            <div className='searchbar-input-div' >
                <input placeholder={placeholder} style={{color:mode===MODETYPE.DARK?'#fff':'#222'}} value={inputValue} onChange={(e)=>{setInputValue(e.target.value)}} onFocus={()=>{setIsInputFocused(true)}} onBlur={()=>{setInputValue(s=>s.trim());setIsInputFocused(false)}}/>
                <span className={`${isInputFocused || inputValue.length>0?'span-focus':'span-unfocus'}`}>{placeholder}</span>
            </div>
        </div>
    )
}

export default SearchBar
