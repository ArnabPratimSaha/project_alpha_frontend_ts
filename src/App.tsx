import './App.css';
import  {  useEffect, Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  useNavigate,
} from "react-router-dom";
import useAuthentication, { STATUS } from './hooks/useAuthentication';
import Navbar from './components/navbar/navbar';

import Error from './pages/error/error';
// import Validation from './pages/discordValidation/validation';
import { Loading, Authenticating } from './pages/loading/loading';
import Authentication from './pages/authentication/authentication';
import { Member, Role } from './interface/schema';
import { useAppSelector } from './redux/hook/hook';

const Home = lazy(() => import('./pages/home/home'));
const Dashboard = lazy(() => import('./pages/dashboard-v2/dashboard'));
const Log = lazy(() => import('./pages/log/log'));
const PostPage = lazy(() => import('./pages/fullPostPage/postPage'));

const ProtectedRoutes= () => {
  const { status } =useAppSelector(state=>state.user);
  if (status==='WAITING') return <Authenticating />;
  if (status !== 'NOT_AUTHORIZED') return <Outlet />;
  return <>{window.location.href = `${process.env.REACT_APP_BACKENDAPI}auth/discord`}</>;
};
const role: Role = {
  name: 'dadad',
  id: 'dawdad',
  isAdmin: true,
  color: 'dawdawd'
}
const me: Member = {
  name: "arnab",
  nickName: 'alapon',
  id: 'adadadadawda',
  isAdmin: true,
  avatar: 'dad',
  tag: 'dada',
  roles: [role]
}
const App = () => {
  useAuthentication();
  return (
    <div className={`App scrollbar-1`}>
      <Router>
          <Routes >
            <Route path='/error/:code' element={<Error/>} />
            <Route path='/auth/:id/:accesstoken/:refreshtoken' element={<Authentication />} />
            {/* <Route path='/val/:did/:sid/:page' element={<Validation mode={mode} MODETYPE={MODETYPE} />} /> */}
            {/* <Route path='/test' element={<Message mode={mode} members={[me,me]} author={me}/>} /> */}
            <Route path='/' element={<>
              <Navbar />
              <Suspense fallback={<Loading />}>
                <Outlet/>
              </Suspense>
            </>}>
              <Route path={'/'} element={<Home />} />
              <Route path='/learnmore' element={<div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}></div>} />
              <Route element={<ProtectedRoutes />}>
                <Route path='/dashboard/:uid/:did' element={<Dashboard  />} />
                <Route path='/log/:uid/:did' element={<Log  />} />
                <Route path='/post/:mid' element={<PostPage  />} />
              </Route>
            </Route>
            <Route path={'*'} element={<ExtraRoute />} />
          </Routes>
      </Router>
    </div>

  );
}
const ExtraRoute = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/')
  }, [])
  return (<div></div>);
}
export default App;
