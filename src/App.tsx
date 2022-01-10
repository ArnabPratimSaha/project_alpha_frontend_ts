import './App.css';
import React,{useState,useEffect,Suspense,lazy,useRef} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  useNavigate,
} from "react-router-dom";
import useMode from './hooks/useMode';
import useAuthentication from './hooks/useAuthentication';
import Navbar from './components/navbar/navbar';

// import Error from './pages/error/error';
// import PostPage from './pages/fullPostPage/postPage';
// import Validation from './pages/discordValidation/validation';
// import useMode from './customhooks/useMode';
// import Cookies from 'js-cookie';
// import Navbar from './component/navbar/navbar';
import { Loading,Authenticating } from './pages/loading/loading';
import Authentication from './pages/authentication/authentication';

const Home= lazy(()=>import( './pages/home/home'));
// const Dashboard =lazy(()=>import('./pages/dashboard/dashboard'));
// const Log =lazy(()=>import('./pages/log/log'));

// const ProtectedRoutes = ({ status, STATUS, isLoading, mode, MODETYPE }) => {
//   if (isLoading) return <Authenticating mode={mode} MODETYPE={MODETYPE} />;
//   if (!isLoading && status!==STATUS.NOT_AUTHORIZED)return <Outlet/>;
//   return window.location=`${process.env.REACT_APP_BACKENDAPI}auth/discord`;
// };

const App=() =>{
  const {mode, changeMode} = useMode();
  // const [isLoggedin, setIsLoggedin] = useState(false);
  // const {isAuth,isLoading}=useAuth({isLoggedin:isLoggedin});
  const {status,logout,userId,userName,userTag,avatar,discordId,accesstoken,refreshtoken,isLoading}=useAuthentication();
  return (
      
      <div className="App">
        <Router>
            <Navbar loading={isLoading} userId={userId} discordId={discordId}  status={status} userName={userName} userTag={userTag} avatar={avatar} mode={mode} updateMode={changeMode} onLogout={logout}/>
            <Suspense fallback={<Loading mode={mode}/>}>
            <Routes >
              <Route path={'/'} element={<Home mode={mode} />} />
              {/* <Route path='/error/:code' element={<Error />} /> */}
              <Route path='/auth/:id/:accesstoken/:refreshtoken' element={<Authentication mode={mode} />} />
              {/* <Route path='/val/:did/:sid/:page' element={<Validation mode={mode} MODETYPE={MODETYPE} />} /> */}
              <Route path='/learnmore' element={<div  style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}></div>} />
              {/* <Route element={<ProtectedRoutes status={status} STATUS={STATUS} isLoading={isLoading} isLoggedin={isLoggedin} mode={mode} MODETYPE={MODETYPE} />}>
                <Route path='/dashboard/:uid/:did' element={<Dashboard mode={mode} MODETYPE={MODETYPE} />} />
                <Route path='/log/:uid/:did' element={<Log mode={mode} MODETYPE={MODETYPE} />} />
                <Route path='/post/:uid/:sid/:did/:pid' element={<PostPage mode={mode} MODETYPE={MODETYPE} />} />
              </Route> */}
              <Route path={'*'} element={<ExtraRoute/>}/>
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
