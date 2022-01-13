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

var newDate = new Date();
var numberOfDaysToAdd = 1;
type Page = 'ALL' | 'FAVOURITE'
type toggleIndex = 'all' | 'sent' | 'processing' | 'cancelled';

newDate.setDate(newDate.getDate() + numberOfDaysToAdd);

const limit = 15;//limit of requesting logs per request
interface LogInterface {
    status: `${STATUS.TEMPORARY}` | `${STATUS.NOT_AUTHORIZED}` | `${STATUS.PERMANENT}`,
    mode: `${MODETYPE.DARK}` | `${MODETYPE.LIGHT}`,
    updateAccesstoken: (token: string) => void,
    userId?: string,
    userName?: string,
    userTag?: string,
    avatar?: string,
    discordId?: string
    accesstoken?: string,
    refreshtoken?: string
}
const LogPage: FC<LogInterface> = ({ mode, status, updateAccesstoken, userId, userName, userTag, avatar, discordId, accesstoken, refreshtoken }) => {
    let { uid, did } = useParams();
    const { makeRequst, loading } = useRequest(status, updateAccesstoken)
    const [activePage, setActivePage] = useState<Page>('ALL')//page thats active
    const [filter, setFilter] = useState<toggleIndex>('all')//current selected filter index
    const [pageIndex, setPageIndex] = useState(1)

    const [hasMoreLog, setHasMoreLog] = useState<boolean>(true);
    const [log, setLog] = useState<Array<Log>>([]);

    const [query, setQuery] = useState('');
    const observer = useRef<IntersectionObserver>();
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
        if (status === STATUS.NOT_AUTHORIZED) return;
        const header: AxiosRequestHeaders = {
            ['id']: userId?.toString() || '',
            ['accesstoken']: accesstoken?.toString() || '',
            ['refreshtoken']: refreshtoken?.toString() || ''
        }
        makeRequst(`${process.env.REACT_APP_BACKENDAPI}log/`,
            {
                method: 'get', 
                headers: header,
                cancelTokenSource: source,
                query: {
                    limit: 2,
                    page: pageIndex,
                    status: filter.toUpperCase(),
                    did: discordId,
                    query: query
                }
            }).then(res => {
                if (res?.status === 200) {
                    const data: Array<Log> = res.data.log || [];
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
    }, [pageIndex,query])
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
        <div className='log-body' style={{ backgroundColor: mode === MODETYPE.DARK ? "#333" : "#cacaca", }}>
            <div className='log-history' >
                <div className='log-history-setting' style={{ borderColor: mode === MODETYPE.DARK ? "#cacaca" : "#333", }}>
                    <div className='log-history-setting-sort-div' style={{ color: mode === MODETYPE.DARK ? "#fff" : "#444", }}>
                        <PageToggler type={activePage === 'ALL' ? 'LEFT' : 'RIGHT'} onChange={handlePageToggler} />
                        <span >Sort By</span>
                        <Dropdown mode={mode} onChange={dropDownHandler} options={['all', 'sent', 'processing', 'cancelled']} />
                    </div>
                    <div className='log-guild-search-div'>
                        <SearchBar mode={mode} onChange={(v) => {setQuery(v)}} />
                    </div>
                </div>
                <div className='log-history-output' style={{ backgroundColor: mode === MODETYPE.DARK ? "#444" : "#EEEEEE", }}>
                    <div className='log-history-output-history' style={{ backgroundColor: mode === MODETYPE.DARK ? "#444" : "#EEEEEE" }}>
                        {/* {<ScrollComponent mode={mode} className='log-history-output-history-content' onIntersect={getData} hasMore={hasMoreLog} >
                                {log.map((e: Log, i: number) => <Bar mode={mode} key={i} status={e.status} time={e.delivertime} title={e.title} mid={e.messageId} guildName={e.guildData?.name || 'deleted server'} icon={e.guildData?.avatar || 'deleted server'} fav={e.favourite} onStarClick={handleStartClick} uid={userId} did={discordId} />)}
                            </ScrollComponent>} */}
                        <div className='log-history-output-history-content'>
                            {log.map((e: Log, i: number) => {
                                if (i + 1 === log.length) {
                                    return <Bar parentRef={context} mode={mode} key={i} status={e.status} time={e.delivertime} title={e.title} mid={e.messageId} guildName={e.guildData?.name || 'deleted server'} icon={e.guildData?.avatar || 'deleted server'} fav={e.favourite} onStarClick={handleStartClick} uid={userId} did={discordId} />;
                                    }else{
                                        return <Bar  mode={mode} key={i} status={e.status} time={e.delivertime} title={e.title} mid={e.messageId} guildName={e.guildData?.name || 'deleted server'} icon={e.guildData?.avatar || 'deleted server'} fav={e.favourite} onStarClick={handleStartClick} uid={userId} did={discordId} />;
                                    }
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogPage
