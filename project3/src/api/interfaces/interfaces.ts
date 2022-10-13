export interface loginType{
    username:string,
    password:string,
}
export interface setModel{
    token:string
}
export interface userModel{
    avatar:string;
    buttons:string[];
    name:string;
    roles:string[];
    message:string;
    success?:boolean
}