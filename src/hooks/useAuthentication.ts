
import axios, { AxiosRequestHeaders } from "axios";
import Cookies from "js-cookie";

import React, { useRef, useState, useEffect } from 'react'
import { idText } from "typescript";
enum STATUS {
    TEMPORARY = 'temporary',
    PERMANENT = 'permanent',
    NOT_AUTHORIZED = 'notauthorized'
}
interface HeaderInterface{
    id: string, accesstoken:string, refreshtoken:string
}
function useAuthentication() {
    const [status, setStatus] = useState(Cookies.get('temp_id') ? STATUS.TEMPORARY : Cookies.get('id') ? STATUS.PERMANENT : STATUS.NOT_AUTHORIZED);

    const [userName, setUserName] = useState(undefined);
    const [userId, setUserId] = useState(Cookies.get('temp_id') || Cookies.get('id') || undefined);
    const [userTag, setUserTag] = useState(undefined);
    const [avatar, setAvatar] = useState(undefined);
    const [discordId, setDiscordId] = useState(undefined)
    const [accesstoken, setAccesstoken] = useState(Cookies.get('temp_accesstoken') || Cookies.get('accesstoken') || undefined);
    const [refreshtoken, setRefreshtoken] = useState(Cookies.get('temp_refreshtoken') || Cookies.get('refreshtoken') || undefined);

    const [isLoading, setIsLoading] = useState(true);

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    useEffect(() => {
        if (status === STATUS.NOT_AUTHORIZED) {
            setIsLoading(false);
            setUserId(undefined);
            setUserName(undefined);
            setUserTag(undefined);
            setAvatar(undefined);
            setAccesstoken(undefined);
            setRefreshtoken(undefined);
            setDiscordId(undefined);
            return;
        }
        setIsLoading(true);
        const header:AxiosRequestHeaders={
            ['id']:userId?.toString()||'',
            ['accesstoken']:accesstoken?.toString()||'',
            ['refreshtoken']:refreshtoken?.toString()||''
        }
        axios({
            url: `${process.env.REACT_APP_BACKENDAPI}user/info`,
            headers: header,
            cancelToken: source.token
        }).then(res => {
            setIsLoading(false);
            const data = res.data;
            if (res.status === 200) {
                Cookies.set(`${status === STATUS.TEMPORARY ? 'temp_id' : 'id'}`, data.userId);
                Cookies.set(`${status === STATUS.TEMPORARY ? 'temp_accesstoken' : 'accesstoken'}`, data.accesstoken);
                Cookies.set(`${status === STATUS.TEMPORARY ? 'temp_refreshtoken' : 'refreshtoken'}`, data.refreshtoken);
                setAccesstoken(data.accesstoken);
                setRefreshtoken(data.refreshtoken);
                setUserName(data.userName);
                setUserTag(data.userTag);
                setAvatar(data.avatar);
                setDiscordId(data.discordId);
                setUserId(data.userId);
            }
        }).catch(err => {
            if (axios.isAxiosError(err)) {
                setIsLoading(false);
                setStatus(STATUS.NOT_AUTHORIZED);
            }
        })
        return () => {
            source.cancel('cancel the request');
        }
    }, [status])
    const logout = async () => {
        try {
            setIsLoading(true);
            const header:AxiosRequestHeaders={
                ['id']:userId?.toString()||'',
                ['accesstoken']:accesstoken?.toString()||'',
                ['refreshtoken']:refreshtoken?.toString()||''
            }
            const response = await axios({
                url: `${process.env.REACT_APP_BACKENDAPI}user/logout`,
                method: 'delete',
                headers:header,
                cancelToken: source.token
            });
            setIsLoading(false);
            Cookies.remove("temp_id");
            Cookies.remove('temp_accesstoken');
            Cookies.remove('temp_refreshtoken');
            if (status === STATUS.TEMPORARY) {
                if (Cookies.get('id')) {
                    setStatus(STATUS.PERMANENT);
                    setAccesstoken(Cookies.get('accesstoken'));
                    setRefreshtoken(Cookies.get('refreshtoken'));
                    setUserId(Cookies.get('id'));
                } else {
                    Cookies.remove("id");
                    Cookies.remove('accesstoken');
                    Cookies.remove('refreshtoken');
                    setStatus(STATUS.NOT_AUTHORIZED);
                    window.location.href = '/home';
                }
                return;
            }
            Cookies.remove("id");
            Cookies.remove('accesstoken');
            Cookies.remove('refreshtoken');
            setStatus(STATUS.NOT_AUTHORIZED);
        } catch (error) {
            setIsLoading(false);
            if (axios.isAxiosError(error)) {
                //
            }
        }
    }
    return { status, STATUS, isLoading, userId, userName, userTag, avatar, discordId, accesstoken, refreshtoken, logout }
}

export default useAuthentication
export { STATUS }
