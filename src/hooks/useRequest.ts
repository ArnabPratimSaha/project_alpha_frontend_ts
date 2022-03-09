import React,{useState} from 'react'
import axios, {  Method ,AxiosRequestHeaders, AxiosResponse, CancelTokenSource} from 'axios'
import { STATUS } from './useAuthentication';
import Cookies from 'js-cookie';
interface RequstInterface{
    cancelTokenSource?:CancelTokenSource ,
    method?:Method,
    headers?:AxiosRequestHeaders,
    body?:Object,
    query?:Object,
}
interface ResponseInterface{
    data:Object|any,
    status: number
}
const useRequest=() =>{
    const [loading, setLoading] = useState<boolean>(false);

    const makeRequst = async(url:string,option?: RequstInterface):Promise<ResponseInterface|undefined> => {
        setLoading(true);
        try {
            const res=await axios({
                url:url,
                method:option?.method||'GET',
                data:option?.body,
                cancelToken:option?.cancelTokenSource?.token,
                params:option?.query,
                headers:option?.headers
            })
            setLoading(false);
            const response:ResponseInterface={
                data:res.data,
                status:res.status,
            }
            if(res.data.accesstoken){
                // updateToken && updateToken(res.data.accesstoken);
            }
            return response;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }
    return {makeRequst,loading}
}

export default useRequest
