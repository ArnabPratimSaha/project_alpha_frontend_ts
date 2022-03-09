import { createSlice, PayloadAction,createAction } from '@reduxjs/toolkit';
import type { RootState } from './allReducer';
interface UserInterface{
    status:"WAITING"|"NOT_AUTHORIZED"|"TEMPORARY"|"PERMANENT",
    name:string|null,
    id:string|null,
    avatar:string|null,
    tag:string|null,
    did:string|null,
    accesstoken:string|null,
    refreshtoken:string|null

}
const initialState:UserInterface={
    status:'WAITING',
    name: null,
    id:null,
    tag:null,
    avatar:null,
    did:null,
    accesstoken:null,
    refreshtoken:null
}
export const userSlice=createSlice({
    name:'User Reducer',
    initialState,
    reducers:{
        update:(state,data:PayloadAction<UserInterface>)=>{
            state.status=data.payload.status;
            state.accesstoken=data.payload.accesstoken;
            state.id=data.payload.id;
            state.name=data.payload.name;
            state.refreshtoken=data.payload.refreshtoken;
            state.did=data.payload.did;
            state.tag=data.payload.tag;
            state.avatar=data.payload.avatar;
        },
        logout:(state)=>{
            state.status='NOT_AUTHORIZED'
        },
        updateAccessToken:(state,accesstoken:PayloadAction<string>)=>{
            state.accesstoken=accesstoken.payload;
        }
    }
})
export const userActions=userSlice.actions;
export const userReducer=userSlice.reducer;

export type userType=typeof userSlice.getInitialState