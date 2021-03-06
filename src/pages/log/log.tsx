import React, { FC, useEffect, useReducer, useRef, useState ,useContext, useCallback} from "react";
import { useParams } from "react-router-dom";
import './log.css';
import axios, { AxiosRequestHeaders, AxiosError, CancelTokenSource } from 'axios'
import Bar from '../../components/expandBar/bar';
import Dropdown from "../../components/dropdown/dropdown";
import SearchBar from "../../components/search-bar/searchBar";
import PageToggler from "../../components/pageToggeler/pageToggler";
import ScrollComponent from "../../components/infiniteScrollComponent/scrollComponent";
import { MODETYPE } from "../../hooks/useMode";
import { STATUS } from "../../hooks/useAuthentication";
import useRequest from "../../hooks/useRequest";
import { Log } from "../../interface/schema";
import BoxBar from '../../components/boxBar/boxBar';
import './color.css';
import { modeType } from "../../redux/reducers/modeReducer";
import { useAppSelector } from "../../redux/hook/hook";
import { RootState } from "../../redux/reducers/allReducer";


var newDate = new Date();
var numberOfDaysToAdd = 1;
type Page = 'ALL' | 'FAVOURITE'
type toggleIndex = 'all' | 'sent' | 'processing' | 'cancelled';

newDate.setDate(newDate.getDate() + numberOfDaysToAdd);

const limit = 15;//limit of requesting logs per request
interface CustomLog extends Log{
    guildName:string,
    guildAvatar:string
}
const LogPage = () => {
    // let { uid, did } = useParams();
    const mode:modeType=useAppSelector((state:RootState)=>state.mode.mode);
    const { id,did,accesstoken,refreshtoken ,status}=useAppSelector(state=>state.user);
    const { makeRequst, loading } = useRequest();
    const [activePage, setActivePage] = useState<Page>('ALL')//page thats active
    const [filter, setFilter] = useState<toggleIndex>('all')//current selected filter index
    const [pageIndex, setPageIndex] = useState(1)

    const [log, setLog] = useState<Array<Log>>([]);
    
    const [query, setQuery] = useState('');
    const observer = useRef<IntersectionObserver>();
    const [hasMoreLog, setHasMoreLog] = useState<boolean>(true);
    const context = useCallback(node => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMoreLog) {
                setPageIndex(p => p + 1);
            }
        })
        if(node)observer.current.observe(node);
    }, [hasMoreLog])
    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        if (status === 'NOT_AUTHORIZED') return;
        const header: AxiosRequestHeaders = {
            ['id']: id?.toString() || '',
            ['accesstoken']: accesstoken?.toString() || '',
            ['refreshtoken']: refreshtoken?.toString() || ''
        }
        makeRequst(`${process.env.REACT_APP_BACKENDAPI}log/`,
            {
                method: 'get', 
                headers: header,
                cancelTokenSource: source,
                query: {
                    limit: 8,
                    page: pageIndex,
                    status: filter.toUpperCase(),
                    did: did,
                    query: query,
                    fav:activePage==='FAVOURITE'?true:false
                }
            }).then(res => {
                if (res?.status === 200) {
                    const data: Array<Log> = res.data.log.map((l:any)=>{
                        var temp: Log = {
                            messageId: l.message.messageId,
                            targetGuild: l.message.targetGuild,
                            type: l.message.type,
                            channels: l.message.channels,
                            members: l.message.members,
                            roles: l.message.roles,
                            title: l.message.title,
                            message: l.message.message,
                            sender: l.message.sender,
                            createTime: l.message.createTime,
                            delivertime: l.message.delivertime,
                            preview: l.message.preview,
                            status: l.message.status,
                            favourite: l.message.favourite,
                            guildData: { name: l.guildData.name,icon:l.guildData.icon }
                        }
                        return temp;
                    }) || [];
                    setLog(l => [...l, ...data]);
                    setHasMoreLog(data.length>0)
                }
            }).catch(err=>{
                if(axios.isCancel(err)){
                    console.log('cancelling');
                }
            })

        return () => {
            source.cancel('canceling the request');
        }
    }, [pageIndex,query,filter,activePage])
    useEffect(() => {
        setPageIndex(1);
        setLog([]);
    }, [activePage, query, filter]);
    const handleStartClick = async (mid: string, isFav: boolean) => {
        try {
            // await axios.patch(`${process.env.REACT_APP_BACKENDAPI}log?mid=${mid}`)
        } catch (error) {

        }
    }
    const handlePageToggler: ((type: "LEFT" | "RIGHT") => void) | undefined = (type: 'LEFT' | "RIGHT") => {
        if (type === 'LEFT') setActivePage('ALL');
        if (type === 'RIGHT') setActivePage('FAVOURITE');
    }
    const dropDownHandler: (index: number) => void = (index: number) => {
        switch (index) {
            case 0:
                setFilter('all');
                break;
            case 1:
                setFilter('sent');
                break;
            case 2:
                setFilter('processing');
                break;
            case 3:
                setFilter('cancelled');
                break;
            default:
                setFilter('all');
                break;
        }
    }
    return (
        <div className={`log-body ${mode}-top`} >
            <div className='log-history' >
                <div className='log-history-setting' style={{ borderColor: mode === MODETYPE.DARK ? "#cacaca" : "#333", }}>
                    <div className='log-history-setting-sort-div' style={{ color: mode === MODETYPE.DARK ? "#fff" : "#444", }}>
                        <PageToggler type={activePage === 'ALL' ? 'LEFT' : 'RIGHT'} onChange={handlePageToggler} />
                        <span >Sort By</span>
                        <Dropdown mode={mode} onChange={dropDownHandler} options={['all', 'sent', 'processing', 'cancelled']} />
                    </div>
                    <div className='log-guild-search-div'>
                        <SearchBar mode={mode} placeholder="Search by title" onChange={(v) => {setQuery(v.trim())}} />
                    </div>
                </div>
                <div className='log-history-output'>
                    <div className={`log-history-output-history scrollbar-${mode}`}>
                        <div className={`log-history-output-history-content ${mode}-top`}>
                            {log.map((e: Log, i: number) => {
                                if (i + 1 === log.length) {
                                    return <BoxBar accesstoken={accesstoken||''} refreshtoken={refreshtoken||''} userId={id} status={status}  parentRef={context} mode={mode} key={i} log={e} />;
                                } else {
                                    return <BoxBar accesstoken={accesstoken || ''} refreshtoken={refreshtoken || ''} userId={id} status={status} mode={mode} key={i} log={e} />;
                                }
                            })}
                        </div>
                        {<div className="log-history-output-extra">
                            {loading?'Loading':log.length===0 ?"No Data found":'You are all caught up'}
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogPage;