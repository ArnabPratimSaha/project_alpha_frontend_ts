
import axios, { AxiosRequestHeaders } from "axios";
import Cookies from "js-cookie";

import React, { useRef, useState, useEffect } from 'react'
import { idText } from "typescript";
import { useAppDispatch, useAppSelector } from "../redux/hook/hook";
import { RootState } from "../redux/reducers/allReducer";
import { userActions } from '../redux/reducers/userReducer';
enum STATUS {
    TEMPORARY = 'temporary',
    PERMANENT = 'permanent',
    NOT_AUTHORIZED = 'notauthorized'
}
interface HeaderInterface {
    id: string, accesstoken: string, refreshtoken: string
}
const useAuthentication=()=> {
    const dispatch=useAppDispatch();
    const { status }=useAppSelector((state:RootState)=>state.user);
    
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    useEffect(() => {
        const accesstoken=Cookies.get('accesstoken')
        const id=Cookies.get('id')
        const refreshtoken=Cookies.get('refreshtoken')
        
        if(!id || !accesstoken ||!refreshtoken){
            dispatch(userActions.logout());
            return;
        }
        const header: AxiosRequestHeaders = {
            ['id']: id?.toString() || '',
            ['accesstoken']: accesstoken?.toString() || '',
            ['refreshtoken']: refreshtoken?.toString() || ''
        }
        axios({
            url: `${process.env.REACT_APP_BACKENDAPI}user/info`,
            headers: header
        }).then(res => {
            if (res.status === 200) {
                const data = res.data;
                dispatch(userActions.update({
                    status:'PERMANENT',
                    id:data.userId,
                    name:data.userName,
                    tag:data.userTag,
                    did:data.discordId,
                    avatar:data.avatar,
                    accesstoken:data.accesstoken,
                    refreshtoken:refreshtoken||null,
                }))
            }else
                dispatch(userActions.logout())
        }).catch(err => {
            dispatch(userActions.logout())
            if (axios.isAxiosError(err)) {

            }
        })
        return () => {
        }
    }, [status])
}

export default useAuthentication
export { STATUS }
