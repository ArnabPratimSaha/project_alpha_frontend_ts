import React, { FC, useEffect,useRef,useState } from 'react'
import {  useParams } from "react-router-dom";
import './authentication.css';
import axios,{AxiosRequestHeaders} from 'axios';
import Cookie from 'js-cookie';
import { MODETYPE } from '../../hooks/useMode';
interface Authenticationinterface {
    mode:MODETYPE
}

const Authentication:FC<Authenticationinterface>=({mode})=> {
    const {id,accesstoken,refreshtoken}=useParams();
    const [isVerifying, setIsVerifying] = useState(true)
    const [verified, setVerified] = useState(false)
    const [message, setMessage] = useState('verifying')
    const [imageSource,setImageSource]=useState<string|undefined>(undefined);
    const [userName,setUserName]=useState(null);
    const [userTag,setUserTag]=useState(null);
    
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    
    useEffect(() => {
        const header:AxiosRequestHeaders={
            ['id']:id?.toString()||'',
            ['accesstoken']:accesstoken?.toString()||'',
            ['refreshtoken']:refreshtoken?.toString()||''
        }
        axios({
            url: `${process.env.REACT_APP_BACKENDAPI}user/info`,
            headers: header,
            cancelToken: source.token
        }).then(res => {
            if (res.status === 200) {
                setIsVerifying(false);
                setVerified(true);
                const data=res.data;
                console.log(res);
                Cookie.set('id', data.userId, { expires: 365 });
                Cookie.set('accesstoken', data.accesstoken, { expires: 365 });
                Cookie.set('refreshtoken', data.refreshtoken, { expires: 365 });
                setImageSource(data.avatar)
                setUserName(data.userName)
                setUserTag(data.userTag)
                setMessage('redirecting to home')
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            }
            else {
                setIsVerifying(false);
                setVerified(false);
                // window.location=`/error/${res.status}`;
                setMessage('unknown error')
            }
        }).catch(err => {
            if (axios.isAxiosError(err)) {
                //axios error
                setIsVerifying(false);
                setVerified(false);
                setMessage(err.message)
                
            }
        });
        return ()=>source.cancel('cancled the request')
    }, [])
    return (
        <>
            <div className='auth-fulldiv' style={{background:mode===MODETYPE.DARK?'#333':'#f3f3f3'}}>
                <div className='auth-center-div'>
                    {verified && <img src={imageSource} alt='alt'></img>}
                    {verified && <h2>{`Welcome ${userName}#${userTag}`}</h2>}
                    <p>{message}</p>
                </div>
            </div>
        </>
    )
}
export default Authentication
