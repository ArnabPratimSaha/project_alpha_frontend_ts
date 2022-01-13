import React,{useState,useEffect, FC} from 'react'
import './searchBar.css'
import { BiSearchAlt } from 'react-icons/bi';
import { MODETYPE } from '../../hooks/useMode';
interface SearchBarInterface{
    onChange:(value:string)=>void,
    mode:`${MODETYPE.DARK}`|`${MODETYPE.LIGHT}`,
}
const SearchBar:FC<SearchBarInterface>=({onChange,mode})=> {
    const [inputValue, setInputValue] = useState<string>('')
    const [isInputFocused, setIsInputFocused] = useState(false)
    useEffect(() => {
        onChange && onChange(inputValue)
    }, [inputValue])
    return (
        <div className='searchbar-fulldiv' style={{color:mode===MODETYPE.DARK?'#fff':'#222'}}>
            <BiSearchAlt className='searchbar-icon'/>
            <div className='searchbar-input-div' >
                <input placeholder='type' style={{color:mode===MODETYPE.DARK?'#fff':'#222'}} value={inputValue} onChange={(e)=>{setInputValue(e.target.value)}} onFocus={()=>{setIsInputFocused(true)}} onBlur={()=>{setIsInputFocused(false)}}/>
                <span style={{transform:isInputFocused || inputValue!=''?'translateY(-150%)':'translateY(-50%)'}}>{`Search by server`}</span>
            </div>
        </div>
    )
}

export default SearchBar
