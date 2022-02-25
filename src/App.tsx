import './App.css';
import React,{useState,useEffect,Suspense,lazy,useRef, FC} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  useNavigate,
} from "react-router-dom";
import useMode, { MODETYPE } from './hooks/useMode';
import useAuthentication, { STATUS } from './hooks/useAuthentication';
import Navbar from './components/navbar/navbar';

import Error from './pages/error/error';
// import Validation from './pages/discordValidation/validation';
import { Loading,Authenticating } from './pages/loading/loading';
import Authentication from './pages/authentication/authentication';
import Message from './components/message-discord/message';
import { Member, Role } from './interface/schema';

const Home= lazy(()=>import( './pages/home/home'));
const Dashboard =lazy(()=>import('./pages/dashboard-v2/dashboard'));
const Log =lazy(()=>import('./pages/log/log'));
const PostPage =lazy(()=>import('./pages/fullPostPage/postPage')) ;
const DashboardV2=lazy(()=>import('./pages/dashboard-v2/dashboard'));
interface ProtectedRoutesInterface{
  status:`${STATUS.TEMPORARY}`|`${STATUS.NOT_AUTHORIZED}`|`${STATUS.PERMANENT}`,
  isLoading:boolean,
  mode:`${MODETYPE.DARK}`|`${MODETYPE.LIGHT}`,
}
const ProtectedRoutes:FC<ProtectedRoutesInterface> = ({ status, isLoading, mode }) => {
  if (isLoading) return <Authenticating mode={mode} />;
  if (!isLoading && status!==STATUS.NOT_AUTHORIZED)return <Outlet/>;
  return <>{window.location.href=`${process.env.REACT_APP_BACKENDAPI}auth/discord`}</>;
};
const role:Role={
  name:'dadad',
  id:'dawdad',
  isAdmin:true,
  color:'dawdawd'
}
const me:Member={
  name:"arnab",
  nickName:'alapon',
  id:'adadadadawda',
  isAdmin:true,
  avatar:'dad',
  tag:'dada',
  roles:[role]
}
const App=() =>{
  const {mode, changeMode} = useMode();
  const {status,logout,userId,userName,userTag,avatar,discordId,accesstoken,refreshtoken,isLoading ,updateAccesstoken}=useAuthentication();
  return (
      <div className={`App scrollbar-1`}>
        <Router>
            <Navbar loading={isLoading} userId={userId} discordId={discordId}  status={status} userName={userName} userTag={userTag} avatar={avatar} mode={mode} updateMode={changeMode} onLogout={logout}/>
            <Suspense fallback={<Loading mode={mode}/>}>
          <Routes >
            <Route path={'/'} element={<Home mode={mode} />} />
            <Route path='/error/:code' element={<Error mode={mode} />} />
            <Route path='/auth/:id/:accesstoken/:refreshtoken' element={<Authentication mode={mode} />} />
            {/* <Route path='/val/:did/:sid/:page' element={<Validation mode={mode} MODETYPE={MODETYPE} />} /> */}
            <Route path='/learnmore' element={<div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}></div>} />
            {/* <Route path='/test' element={<Message mode={mode} members={[me,me]} author={me}/>} /> */}
            <Route element={<ProtectedRoutes status={status} isLoading={isLoading} mode={mode} />}>
              <Route path='/dashboard/:uid/:did' element={<Dashboard mode={mode} status={status} updateAccesstoken={updateAccesstoken} userId={userId} userName={userName} userTag={userTag} avatar={avatar} discordId={discordId} accesstoken={accesstoken} refreshtoken={refreshtoken} />} />
              <Route path='/dash/:uid/:did' element={<DashboardV2 mode={mode} status={status} updateAccesstoken={updateAccesstoken} userId={userId} userName={userName} userTag={userTag} avatar={avatar} discordId={discordId} accesstoken={accesstoken} refreshtoken={refreshtoken} />} />
              <Route path='/log/:uid/:did' element={<Log mode={mode} status={status} updateAccesstoken={updateAccesstoken} userId={userId} userName={userName} userTag={userTag} avatar={avatar} discordId={discordId} accesstoken={accesstoken} refreshtoken={refreshtoken} />} />
              <Route path='/post/:mid' element={<PostPage mode={mode} status={status} updateAccesstoken={updateAccesstoken} userId={userId} userName={userName} userTag={userTag} avatar={avatar} discordId={discordId} accesstoken={accesstoken} refreshtoken={refreshtoken} />} />
            </Route>
            <Route path={'*'} element={<ExtraRoute />} />
          </Routes>
          </Suspense>
        </Router>
      </div>

  );
}
const ExtraRoute=()=>{
  const navigate=useNavigate();
  useEffect(() => {
    navigate('/')
  }, [])
  return (<div></div>);
}
export default App;
