import React, { FC, useEffect, useReducer, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./dashboard.css";
import { FaDiscord, FaArrowAltCircleLeft } from "react-icons/fa";
import { BsFillChatDotsFill } from "react-icons/bs";
import { IoIosMan } from "react-icons/io";
import { GiOfficeChair, GiWifiRouter } from "react-icons/gi";
import { AiFillSetting, AiFillWarning } from "react-icons/ai";
import { BiLeftArrow } from "react-icons/bi";
import Wrapper from "../../components/inputComponents/MultilineInputComponent";
import CustomButton from './components/customButtom/customButton';
import Card from '../../components/rightDrawerCardDiv/cardDiv';
import GuildButton from './components/guildButton/guildButton';
import TouchableCard from "../../components/userCard/userCard";
import axios,{AxiosRequestHeaders} from 'axios'
import ChannelButton from "./components/channelButton/channelButton";
import AdminIcon from "./components/adminIcon/adminIcon";
import MemberButton from "./components/memberButton/memberButton";
import Cookies, { set } from "js-cookie";
import Switch from "../../components/switch/switch";
import Footer from "../../components/footer/footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Input from "./components/input/input";
import { MODETYPE } from "../../hooks/useMode";
import { STATUS } from "../../hooks/useAuthentication";
import useRequest from "../../hooks/useRequest";
import Guild, { Channel, Member, Role } from "../../interface/schema";
import Message from "../../components/message-discord/message";

const type = {
  channel: 'CHANNEL',
  dm: 'DM'
}
var newDate = new Date();
var numberOfDaysToAdd = 14;
newDate.setDate(newDate.getDate() + numberOfDaysToAdd);

const calcTimeString = (date: Date) => {
  return (
    date.getFullYear() + "-" +
    `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`}` + '-' +
    `${date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`}` + "T" +
    `${date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`}` + ':' +
    `${date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`}`
  )
}
const getContentHeight = (state:DrawerState, drawerNumber:number) => {
  if (drawerNumber === 1) {
    if (state.isSecondDrawerOpen && state.isThirdDrawerOpen)
      return '28%';
    if (state.isSecondDrawerOpen && !state.isThirdDrawerOpen)
      return '28%';
    if (!state.isSecondDrawerOpen && state.isThirdDrawerOpen)
      return '28%';
    else
      return '85%';
  }
  else if (drawerNumber === 2) {
    if (state.isFirstDrawerOpen && state.isThirdDrawerOpen)
      return '28%';
    if (!state.isFirstDrawerOpen && state.isThirdDrawerOpen)
      return '28%';
    else if (state.isFirstDrawerOpen && !state.isThirdDrawerOpen)
      return '55%';
    else
      return '85%'
  }
  else {
    if (state.isFirstDrawerOpen && state.isSecondDrawerOpen)
      return '28%';
    if (!state.isFirstDrawerOpen && !state.isSecondDrawerOpen)
      return '85%';
    else
      return '61%'
  }

}
const getValue = (term:string, div:number) => {
  if (div === 2) {
    switch (term) {
      case 'equal':
        return '33%'
      case 'open-above':
        return '5%'
      case 'close':
        return '33%';
      case 'open-below':
        return '33%';
      case 'close-below':
        return '90%'
      case 'close-above':
        return '5%'
      default://open full
        return '5%'
    }
  }
  else {
    switch (term) {
      case 'equal':
        return '66%'
      case 'open-above':
        return '38%'
      case 'open-full':
        return '10%'
      default:
        return '95%';
    }
  }
}
const calculateTop = (state:DrawerState, div:number) => {
  if (div === 2) {
    if (state.isSecondDrawerOpen) {
      if (state.isFirstDrawerOpen && state.isThirdDrawerOpen)
        return 'equal';
      else if (!state.isFirstDrawerOpen && state.isThirdDrawerOpen)
        return 'open-above'
      else if (state.isFirstDrawerOpen && !state.isThirdDrawerOpen)
        return 'open-below'
      else
        return 'open-full'
    }
    else {
      if (state.isFirstDrawerOpen && !state.isThirdDrawerOpen)
        return 'close-below';
      if (!state.isFirstDrawerOpen && state.isThirdDrawerOpen)
        return 'close-above'
      else
        return 'close'
    }
  }
  else if (div === 3) {
    if (state.isThirdDrawerOpen) {
      if (state.isFirstDrawerOpen && state.isSecondDrawerOpen)
        return 'equal';
      else if (!state.isFirstDrawerOpen && state.isSecondDrawerOpen)
        return 'open-above'
      if (state.isFirstDrawerOpen && !state.isSecondDrawerOpen)
        return 'open-above'
      return 'open-full'
    }
    else {
      if (!state.isFirstDrawerOpen && !state.isSecondDrawerOpen)
        return 'open-full'
      if (!state.isFirstDrawerOpen && state.isSecondDrawerOpen)
        return 'close-full'
      else
        return 'close-full';
    }
  }
  return 'close';
}
interface DrawerState {
  isFirstDrawerOpen: boolean,
  isSecondDrawerOpen: boolean,
  isThirdDrawerOpen: boolean,
}
interface DrawerAction {
  rightDrawer: number;
}
const rightReducer = (state:DrawerState, action:DrawerAction) => {
  switch (action.rightDrawer) {
    case 1:
      return {
        isFirstDrawerOpen: !state.isFirstDrawerOpen,
        isSecondDrawerOpen: state.isSecondDrawerOpen,
        isThirdDrawerOpen: state.isThirdDrawerOpen,
      };
    case 2:
      return {
        isFirstDrawerOpen: state.isFirstDrawerOpen,
        isSecondDrawerOpen: !state.isSecondDrawerOpen,
        isThirdDrawerOpen: state.isThirdDrawerOpen,
      };
    case 3:
      return {
        isFirstDrawerOpen: state.isFirstDrawerOpen,
        isSecondDrawerOpen: state.isSecondDrawerOpen,
        isThirdDrawerOpen: !state.isThirdDrawerOpen,
      };
    default:
      return state;
  }
}
interface DashboardInterface {
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

const Dashboard: FC<DashboardInterface> = ({ mode, status, updateAccesstoken, userId, userName, userTag, avatar, discordId, accesstoken, refreshtoken }) => {
  const {makeRequst,loading} =useRequest(status ,updateAccesstoken);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const [counter, setCounter] = useState(0)
  const today = useRef(new Date());
  const maxDate = useRef(newDate);
  let { uid, did } = useParams();
  const [messageType, setMessageType] = useState<"left"|"right">("left");
  const [selectedTime, setSelectedTime] = useState<string>(calcTimeString(new Date()));
  const [rightDivVisible, setRightDivVisible] = useState(
    window.innerWidth > 900 ? true : false
  );
  const [leftDivWidthFull, setLeftDivWidthFull] = useState(
    window.innerWidth > 900 ? false : true
  );
  const [bottomBarWidth, setBottomBarWidth] = useState<string>(window.innerWidth < 900 ? '14.28571' : '16.667')
  const [activeButton, setActiveButton] = useState<string>('1')
  const [isRightDivSliderButtonClicked, changeIsRightDivSliderButtonClicked] =
    useState(false);
  const [activeGuild, setActiveGuild] = useState<Guild|undefined>(undefined)
  const [focusOne, setFocusOne] = useState(false);
  const [focusTwo, setFocusTwo] = useState(false);
  const [rightDrawerState, rightDrawerDispatch] = useReducer(rightReducer, {
    isFirstDrawerOpen: true,
    isSecondDrawerOpen: true,
    isThirdDrawerOpen: true,
  });
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  const [discordData, setDiscordData] = useState<Array<Guild>>([]);

  const [allChannels, setAllChannels] = useState<Array<Channel>>([]);
  const [channels, setChannels] = useState<Array<Channel>>([]);
  const [searchChannel, setSearchChannel] = useState<string>('');
  const [selectedChannels, setSelectedChannels] = useState<Array<Channel>>([])

  const [searchedRole, setSearchedRole] = useState('')
  const [allRoles, setAllRoles] = useState<Array<Role>>([]);
  const [roles, setRoles] = useState<Array<Role>>([])
  const [selectedRoles, setSelectedRoles] = useState<Array<Role>>([])

  const [searchedMember, setSearchedMember] = useState<string>('')
  const [members, setMembers] = useState<Array<Member>>([])
  const [selectedMembers, setSelectedMembers] = useState<Array<Member>>([])

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const [checked, setChecked] = useState(true)//getting the dm
  const [isReady, setIsReady] = useState(false)//ready to be sent
  const [rightDivType,setRightDivType]=useState<"Left"|"Right">('Left');
  useEffect(() => {
    timer.current = setInterval(() => {
      setCounter((state) => state + 1)
    }, 10000);
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [])
  useEffect(() => {
    if(selectedTime<calcTimeString(new Date())){
      setSelectedTime(calcTimeString(new Date()))
    }
  }, [counter])
  //managing the right div size
  useEffect(() => {
    window.addEventListener("resize", () => {
      window.innerWidth > 900 ? setBottomBarWidth('16.667') : setBottomBarWidth('14.28571')
      window.innerWidth > 900
        ? setRightDivVisible(true)
        : setRightDivVisible(false);

    });
    window.addEventListener("resize", () => {
      window.innerWidth > 900
        ? setLeftDivWidthFull(false)
        : setLeftDivWidthFull(true)
    });
    return () => {
      // window.removeEventListener('resize');
    }
  }, []);
  useEffect(() => {
    setSelectedRoles([])
    setSelectedMembers([])
    setSelectedChannels([])
  }, [activeGuild]);
  //guilds informations
  useEffect(() => {
    if (status === 'notauthorized') return;
    const header: AxiosRequestHeaders = {
      ['id']: userId?.toString() || '',
      ['accesstoken']: accesstoken || '',
      ['refreshtoken']: refreshtoken || ''
    }
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    makeRequst(`${process.env.REACT_APP_BACKENDAPI}discord/guilds?did=${discordId}`, { method: 'GET', headers: header, cancelTokenSource: source }).then(res => {
      if (res && res.status === 200) {
        const data: Array<Guild> = res.data.guilds||[];
        setDiscordData(data);
      }
    }).catch(err=>{
      if(axios.isAxiosError(err))
        console.log(err.response?.data);
      
    })
    return () => {
      source.cancel('cancelled the request');
    }
  }, [])
  // useeffect for getting the discord channel and roles
  useEffect(() => {
    if (status === 'notauthorized') return;
    if(!activeGuild)return;
    const header: AxiosRequestHeaders = {
      ['id']: userId?.toString() || '',
      ['accesstoken']: accesstoken?.toString() || '',
      ['refreshtoken']: refreshtoken?.toString() || ''
    }
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    makeRequst(`${process.env.REACT_APP_BACKENDAPI}discord/channel`, 
      { method: 'POST', headers: header, cancelTokenSource: source, body: { did: discordId, gid: activeGuild.guildID } }
    ).then(res => {
      if (res && res.status === 200) {
        const data: Array<Channel> = res.data.channels||[];
        setAllChannels(data);
        setChannels(data);
      }
    });
    makeRequst(`${process.env.REACT_APP_BACKENDAPI}discord/role`,
      { method: 'POST', headers: header, cancelTokenSource: source, body: { did: discordId, gid: activeGuild.guildID } }
    ).then(res => {
      if (res && res.status === 200) {
        const data: Array<Role> = res.data.roles||[];
        setAllRoles(data);
        setRoles(data);
      }
    });
    return () => {
      source.cancel('cancelled the request');
    }
  }, [activeGuild]);
//result of searched channel
  useEffect(() => {
    let validChannels:Array<Channel> = [];
    if (searchChannel.trim() === "") {
      setChannels(allChannels);
      return;
    }
    allChannels.forEach(i => {
      const exp = new RegExp(searchChannel, 'gi');
      if (exp.test(i.channelName)) {
        validChannels.push(i)
      }
    });
    setChannels(validChannels);
  }, [searchChannel])
//result of searched role
  useEffect(() => {
    let validRoles:Array<Role> = [];
    if (searchedRole.trim() === "") {
      setRoles(allRoles);
      return;
    }
    allRoles.forEach(i => {
      const exp = new RegExp(searchedRole, 'gi');
      if (exp.test(i.name)) {
        validRoles.push(i)
      }
    });
    setRoles(validRoles);
  }, [searchedRole])
//manging result of searched member
  useEffect(() => {
    if (status === 'notauthorized') return;
    if(searchedMember.trim()==='')return;
    if(!activeGuild)return;
    const header: AxiosRequestHeaders = {
      ['id']: userId?.toString() || '',
      ['accesstoken']: accesstoken?.toString() || '',
      ['refreshtoken']: refreshtoken?.toString() || ''
    }
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    makeRequst(`${process.env.REACT_APP_BACKENDAPI}discord/member?`, { 
      method: 'POST', headers: header, cancelTokenSource: source ,body:{did:discordId,gid:activeGuild.guildID ,query:searchedMember}
    }).then(res => {
      if (res && res.status === 200) {
        const data: Array<Member> = res.data.members||[];
        setMembers(data);
      }
    })
    return () => {
      source.cancel('cancelled the request');
    }
  }, [searchedMember, activeGuild])
  useEffect(() => {
    if (selectedMembers.length === 0 && selectedChannels.length === 0 && selectedRoles.length === 0) {
      setIsReady(false);
    }
  }, [selectedChannels, selectedMembers, selectedRoles])
  const firstTimeToast = useRef(true)
  const handleTextareaChange:React.ChangeEventHandler<HTMLTextAreaElement> = (event:React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value)
  };
  const handleClick = (id:string) => {
    setActiveButton(id)
  }
  const handleSwitchChange = () => {  
    setMessageType(s=>{
      return s==='left'?'right':'left';
    });
    setSelectedRoles([]);
    setSelectedChannels([]);
    // toast.info(`Switching to ${messageType==='left'?'Channel':'DM'} type`, {
    //   position: "bottom-right",
    //   autoClose: 2000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    // });
  }
  const handleToggleRightDiv = () => {
    changeIsRightDivSliderButtonClicked(!isRightDivSliderButtonClicked)
  }
  const handleGuildButtonClick = (id:string) => {
    const guild:Guild|undefined=discordData.find(d=>d.guildID===id);
    setActiveGuild(guild);
  }
  //adding channel
  const handleChannelButtonClick = (id: string) => {
    if (messageType === 'right') return;
    const presentChannel = selectedChannels.find((e) => e.channelId === id);
    const channel = allChannels.find(c => c.channelId === id);
    if (!presentChannel && channel) {
      setSelectedChannels((s) => [...s, channel])
    }
  }
    //adding roles
  const handleRoleButtonClick = (id:string) => {
    if (messageType === 'right') return;
    const presentRole = selectedRoles.find((e) => e.id === id);
    const role = allRoles.find(r=> r.id === id);
    if (!presentRole && role) {
      setSelectedRoles((r) => [...r, role])
    }
  }
    //adding members
  const handleMemberButtonClick = (id: string) => {
    const presentMember = selectedMembers.find((e) => e.id === id);
    const member = members.find(e => e.id === id);
    if (!presentMember && member) {
      setSelectedMembers((m) => [...m, member])
    }
  }
  const handleMessageSend = () => {
    if (!activeGuild) {
      return;
    }
    if (messageType === type.channel) {
      if (selectedChannels.length === 0) {
        toast.error('please select atleast a channel', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
    }
    if (messageType === type.dm) {
      if (selectedMembers.length === 0) {
        toast.error('please select atleast a member', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
    }
    if (title.trim().length <= 3) {
      toast.warn('please add a title', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    if (message.trim().length <= 3) {
      toast.error('message field cannot be left empty', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    if (activeGuild && (selectedChannels || selectedMembers || selectedRoles)) {
      const id = toast.loading('please wait...');
      if (status === 'notauthorized') return;
      const header: AxiosRequestHeaders = {
        ['id']: userId?.toString() || '',
        ['accesstoken']: accesstoken?.toString() || '',
        ['refreshtoken']: refreshtoken?.toString() || ''
      }
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      makeRequst(`${process.env.REACT_APP_BACKENDAPI}message/`, {
        method: 'POST', headers: header, cancelTokenSource: source,
        body: {
          selectedMembers: selectedMembers.map(m=>m.id),
          selectedRoles:selectedRoles.map(r=>r.id),
          selectedChannels:selectedChannels.map(c=>c.channelId),
          selectedTime:new Date(selectedTime),
          preview:checked,
          title:title,
          message:message,
          type:messageType==='left'?'channel':'dm',
          did:discordId,
          gid:activeGuild.guildID
        }
      }).then(res => {
        if (res && res.status === 200) {
          toast.update(id, { render: "message timmed", type: "success", isLoading: false, autoClose: 3000, draggable: true });
          
          //handle
        }
      }).catch(err => {
        console.log(err);
        
        toast.update(id, { render: "unknow error-try again", type: "error", isLoading: false, autoClose: 3000, draggable: true });

      })
    }
  }
  const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSelectedTime(e.target.value)
  }
  useEffect(()=>{
    // console.log(messageType);
  },[messageType])
  return (
    <div className="dashboard-full-div srollbar-1" style={{ backgroundColor: mode === MODETYPE.DARK ? "#444" : "#cacacaca", }}>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={mode === MODETYPE.DARK ? 'dark' : 'light'}
        style={{ fontSize: ".9rem" }}
      />
      <div
        >
        <div className="dashboard-content-div">
          <div className='dashboard-button-div'
            style={{
              backgroundColor: "#CDD0CB",
              width: "100%",
            }}
          >
            <CustomButton className={`dashboard-button-div__button ${mode}-3 ${activeButton==='1'&& 'button-active-inverse'}`} id={'1'} onClick={handleClick}>
              <FaDiscord className='dashboard-button-div__button__icon' />
              <p>servers</p>
            </CustomButton>
            <CustomButton error={activeGuild ? messageType === 'left' ? false : true : true} count={channels && channels.length != 0 ? channels.length.toString() : undefined} className={`dashboard-button-div__button ${mode}-3 ${activeButton==='2'&& 'button-active-inverse'}`} id={'2'} onClick={handleClick}>
              <GiWifiRouter className='dashboard-button-div__button__icon' />
              <p>channels</p>
            </CustomButton>
            <CustomButton error={activeGuild ? messageType === 'left' ? false : true : true} count={roles && roles.length != 0 ? roles.length.toString() : undefined} className={`dashboard-button-div__button ${mode}-3 ${activeButton==='3'&& 'button-active-inverse'}`} id={'3'} onClick={handleClick}>
              <GiOfficeChair className='dashboard-button-div__button__icon' />
              <p>roles</p>
            </CustomButton>
            <CustomButton error={activeGuild ? false : true} className={`dashboard-button-div__button ${mode}-3 ${activeButton==='4'&& 'button-active-inverse'}`} id={'4'} onClick={handleClick} >
              <IoIosMan className='dashboard-button-div__button__icon' />
              <p>members</p>
            </CustomButton>
            <CustomButton error={activeGuild ? false : true}  className={`dashboard-button-div__button ${mode}-3 ${activeButton==='5'&& 'button-active-inverse'}`} id={'5'} onClick={handleClick}>
              <BsFillChatDotsFill className='dashboard-button-div__button__icon' />
              <p>message</p>
            </CustomButton>
            <CustomButton error={activeGuild ? false : true} className={`dashboard-button-div__button ${mode}-3 ${activeButton==='6'&& 'button-active-inverse'}`} id={'6'} onClick={handleClick}>
              <AiFillSetting className='dashboard-button-div__button__icon' />
              <p>time & date</p> 
            </CustomButton>
            {leftDivWidthFull && <CustomButton className={`dashboard-button-div__button ${mode}-3 ${activeButton==='7'&& 'button-active-inverse'}`} id={'7'} onClick={handleToggleRightDiv}>
              <FaArrowAltCircleLeft className='dashboard-button-div__button__icon' />
            </CustomButton>}
            <span className='dashboard-button-div_underline'
              style={{ left: `${+bottomBarWidth * (+activeButton - 1)}%`, width: `${bottomBarWidth}%` }}
            ></span>
          </div>
          <div className="dashboard-leftright-wrapper-div">
            <div
              className="dashboard-left-div"
              style={{
                backgroundColor: mode === MODETYPE.DARK ? "#666" : "#CDD0CB",
                width: leftDivWidthFull ? "100%" : "60%",
              }}
            >
              <div className='dashboard-left-div__message-div' style={{ zIndex: activeButton === '5' ? '1' : '0' }}>
                <span className='dashboard-left-div-eachdiv__title'>message</span>
                <Wrapper label='title' isFocused={focusOne} classFulldiv='dashboard-left-div__message-div__title'>
                  <input placeholder="a" type={'text'}  onFocus={() => { setFocusOne(true) }} onBlur={() => { setFocusOne(false) }} value={title} onChange={(e) => { setTitle(e.target.value) }}/>
                </Wrapper>
                <Wrapper label='message' isFocused={focusTwo} classFulldiv='dashboard-left-div__message-div__message'>
                  <textarea placeholder="Enter Your Message here" onFocus={() => { setFocusTwo(true) }} onChange={handleTextareaChange} onBlur={() => { setFocusTwo(false) }}></textarea>
                </Wrapper>
              </div>
              <div className='dashboard-left-div__guild-div' style={{ zIndex: activeButton === '1' ? '1' : '0' }}>
                <div className='dashboard-left-div__channel-div__info' style={{ color: mode === MODETYPE.DARK ? '#fff' : 'black' }}>
                  <p>select <GiWifiRouter /> to send a message a channel and <IoIosMan /> to DM a perticular member from discord.Select <GiOfficeChair /> to tag a role [can only be used while sending a message to a channel]</p>
                </div>
                <div className='dashboard-left-div__guild-div__titile'>
                  <div className='dashboard-left-div__guild-div-select-div'>
                    <span>Selected server :</span>
                    {activeGuild ? <GuildButton mode={mode} id={activeGuild.guildID} guildName={activeGuild.guildName} avatar={activeGuild.guildAvater} onClick={() => { }} /> : "none"}
                  </div>
                  <Switch left='Channel' right='DM' position={messageType} onChange={handleSwitchChange} />
                </div>
                <Wrapper label='discord servers' classFulldiv='dashboard-left-div__guild-div__result'>
                  <div className='dashboard-left-div__guild-div__result_wrapper'>
                    {discordData && discordData.map((e:Guild) => {
                      return <GuildButton mode={mode} guildName={e.guildName} key={e.guildID} id={e.guildID} avatar={e.guildAvater} onClick={handleGuildButtonClick} />
                    })}
                  </div>
                </Wrapper>
              </div>
              <div className='dashboard-left-div__channel-div' style={{ zIndex: activeButton === '2' ? '1' : '0' }}>
                <div className='dashboard-left-div__channel-div__content'>
                  <Input mode={mode} placeholder={`Search Channels`} onChange={(e) => { setSearchChannel(e.target.value) }} value={searchChannel}></Input>
                  <Wrapper label='Channels' classFulldiv='dashboard-left-div__channel-div__content-result'>
                    <div className='dashboard-left-div__guild-div__result_wrapper'>
                      {channels && channels.map((c) => {
                        return <ChannelButton mode={mode} name={c.channelName} id={c.channelId} key={c.channelId} onClick={handleChannelButtonClick} />
                      })}
                    </div>
                  </Wrapper>
                </div>
              </div>
              <div className='dashboard-left-div__role-div' style={{ zIndex: activeButton === '3' ? '1' : '0' }}>
                <div className='dashboard-left-div__role-div__content'>
                  <Input mode={mode} placeholder={`Search roles`} onChange={(e) => { setSearchedRole(e.target.value) }} value={searchedRole}></Input>
                  <Wrapper label='roles' classFulldiv='dashboard-left-div__channel-div__content-result'>
                    <div className='dashboard-left-div__guild-div__result_wrapper'>
                      {roles && roles.map((c) => {
                        return <ChannelButton mode={mode} style={{ backgroundColor: c.color, color: '#fff' }} name={c.name} id={c.id} key={c.id} onClick={handleRoleButtonClick} />
                      })}
                    </div>
                  </Wrapper>
                </div>
              </div>
              <div className='dashboard-left-div__member-div' style={{ zIndex: activeButton === '4' ? '1' : '0' }}>
                <div className='dashboard-left-div__channel-div__content'>
                  <Input mode={mode} placeholder={`Search members`} onChange={(e) => { setSearchedMember(e.target.value) }} value={searchedMember}></Input>
                  <Wrapper label='members' classFulldiv='dashboard-left-div__channel-div__content-result'>
                    <div className='dashboard-left-div__guild-div__result_wrapper'>
                      {members && members.map((c) => {
                        return <MemberButton mode={mode} style={{ backgroundColor: '#545454', color: '#fff' }} type='add' nickName={c.nickName} img={c.avatar} userName={c.name} userTag={c.tag} id={c.id} key={c.id} onClick={handleMemberButtonClick} />
                      })}
                    </div>
                  </Wrapper>
                </div>
              </div>
              <div className='dashboard-left-div__final-div' style={{ zIndex: activeButton === '6' ? '1' : '0' }}>
                <Wrapper label='date and time' classFulldiv='dashboard-left-div__final-div-datetime'>
                  <div className='dashboard-left-div__final-div-submit-datepicker'>
                    Pick a Date and Time
                  </div>
                  <div className='dashboard-left-div__final-div-submit-datepicker'>
                    <input
                      type="datetime-local"
                      placeholder={selectedTime}
                      value={selectedTime}
                      min={calcTimeString(today.current)}
                      max={calcTimeString(maxDate.current)}
                      onChange={handleTimeChange}
                      className='input-time-date'
                      style={{ backgroundColor: mode === MODETYPE.DARK ? '#cacaca' : '#ECECEC' }}
                    />
                  </div>
                </Wrapper>
                <Wrapper label='submit' classFulldiv='dashboard-left-div__final-div-submit'>
                  <div className='dashboard-left-div__final-div-submit-preview'>
                    <div style={{ backgroundColor: isReady ? '#00afff' : '#cacaca' }} className='custom-checkbox' onClick={() => {
                      if (activeGuild && (selectedChannels.length > 0 || selectedMembers.length > 0 || selectedRoles.length > 0)) {
                        setIsReady(!isReady);
                        return;
                      }
                      setIsReady(false);
                    }}></div>
                    <p>click this checkbox in order to continued</p>
                  </div>
                  <div className='dashboard-left-div__final-div-submit-preview'>
                    <div style={{ backgroundColor: checked ? '#00Afff' : '#cacaca' }} className='custom-checkbox' onClick={() => { setChecked(!checked) }}></div>
                    <p>I want the preview of the message to be DM'ed me along with the conformation</p>
                  </div>
                  <div className='dashboard-left-div__final-div-submit-preview'>
                    <button onClick={handleMessageSend} style={{ background: isReady ? '#00cc00' : '#cacaca' }} className='submit-button'>Send</button>
                  </div>
                </Wrapper>
              </div>
            </div>
            <div
              className={`dashboard-right-div ${mode}-discord scrollbar-1`}
              style={{
                left: leftDivWidthFull ? isRightDivSliderButtonClicked ? '0%' : '100%' : '60%',
              }}
            >
              <div className={`dashboard-right-div-button ${mode}-2`}>
                <div className={`button__tags  ${rightDivType==='Left'?'button-active':'button-inactive' }`} onClick={()=>setRightDivType('Left')}>
                  Tags
                </div>
                <div className={`button__preview  ${rightDivType==='Right'?'button-active':'button-inactive' }`} onClick={()=>setRightDivType('Right')}>
                  Preview
                </div>
              </div>
              <div className="dashboard-right-div_moveable" style={{zIndex:rightDivType==='Left'?'2':'1'}}>
                <div className={`right-div-tags ${mode} ${mode}-discord scrollbar-1`}>
                  {messageType === 'left' &&
                    <><div className={`right-div__channels`}>
                      <div className="right-div__channels_title">
                        <p>channels</p>
                        <span className={`${mode}_inverse`}></span>
                        <BiLeftArrow/>
                      </div>
                      <div className="right-div__channels_container">
                        {selectedChannels.map(c=><TouchableCard 
                          mode={mode} 
                          key={c.channelId} 
                          id={c.channelId} 
                          title={c.channelName}
                          onClick={(id)=>{
                            setSelectedChannels(s=>s.filter(c=>c.channelId!==id))
                        }} />)}
                      </div>
                    </div>
                      <div className="right-div_roles">
                        <div className="right-div__roles_title">
                          <p>roles</p>
                          <span className={`${mode}_inverse`}></span>
                          <BiLeftArrow/>
                        </div>
                        <div className="right-div__roles_container">
                          {selectedRoles.map(c=><TouchableCard 
                            mode={mode}
                            key={c.id} 
                            id={c.id} 
                            title={c.name}
                            onClick={(id)=>{
                              setSelectedRoles(s=>s.filter(r=>r.id!==id))
                          }} />)}
                        </div>
                      </div>
                    </>
                 }
                  <div className="right-div_members">
                    <div className="right-div__members_title">
                      <p>members</p>
                      <span className={`${mode}_inverse`}></span>
                      <BiLeftArrow />
                    </div>
                    <div className="right-div__members_container">
                      {selectedMembers.map(c => <MemberButton
                        mode={mode}
                        key={c.id}
                        id={c.id}
                        nickName={c.nickName}
                        userName={c.name}
                        img={c.avatar}
                        userTag={c.tag}
                        type={'remove'}
                        onClick={(id) => {
                          setSelectedMembers(s => s.filter(r => r.id !== id))
                        }} />)}
                    </div>
                  </div>
                </div>
                <div className={`right-div-preview ${mode}`} style={{zIndex:rightDivType==='Right'?'2':'1'}}>
                  <Message mode={mode} message={message} members={selectedMembers} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer mode={mode} />
    </div>
  );
}
export default Dashboard;