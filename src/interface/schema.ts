interface Guild {
    guildName:string,
    guildID:string,
    roleID?:string,
    guildAvater?:string,
}
interface Channel{
    channelName:string,
    channelId:string
}
interface Role {
    name: string,
    id: string,
    color: string,
    isAdmin: boolean
}
interface Member {
    nickName?:string 
    name:string,
    avatar: string,
    tag:string,
    isAdmin: boolean,
    roles: Array<Role>,
    id: string
}
interface Log {
    messageId: string,
    targetGuild: string,
    type: 'all'|'dm',
    channels?: Array<string>,
    members?: Array<string>,
    roles?: Array<string>,
    title: string,
    message: string,
    sender: string,
    createTime: Date,
    delivertime: Date,
    preview?: boolean,
    status: 'PROCESSING'|'CANCELLED'|'SENT',
    favourite:boolean,
    guildData?:{name:string,id:string,avatar?:string}
}
export default Guild 
export {Channel,Role,Member,Log}