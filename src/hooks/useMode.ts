import {  useState ,FC, Children, ReactElement} from 'react';

//this hook allows user to  change theme of the window
enum MODETYPE  {
    LIGHT = 'light',
    DARK = 'dark'
}
const getMode=():MODETYPE=>{
    if(localStorage.getItem('MODE')===MODETYPE.LIGHT.toString()){
        return MODETYPE.LIGHT;
    }
    return MODETYPE.DARK;
}

const useMode = () => {
    const [mode, setMode] = useState<MODETYPE>(getMode())
    const changeMode = () => {
        if (mode === MODETYPE.DARK) localStorage.setItem('MODE', MODETYPE.LIGHT);
        else localStorage.setItem('MODE', MODETYPE.DARK);
        setMode((m) => {
            if (m === MODETYPE.DARK) return MODETYPE.LIGHT;
            return MODETYPE.DARK;
        })
    }
    const updateMode = () => {
        setMode(getMode())
    }
    return {mode,changeMode}
}
export default useMode ;
export {MODETYPE}
