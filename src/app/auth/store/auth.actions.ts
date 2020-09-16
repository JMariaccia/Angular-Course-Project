import { Action } from "@ngrx/store"

export type AuthActions =  
    AuthenticateSuccess | 
    LoginStart |
    Logout |
    AuthenticateFail |
    SignUpStart |
    ClearError |
    AutoLogin

export const LOGIN_START = 'LOGIN_START';
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_FAIL = 'AUTHENTICATE_FAIL';
export const LOGOUT = 'LOGOUT';
export const SIGN_UP_START = 'SIGN_UP_START';
export const CLEAR_ERROR = 'CLEAR_ERROR';
export const SIGN_UP = 'SIGN_UP';
export const AUTO_LOGIN = 'AUTO_LOGIN'

export class AuthenticateSuccess implements Action {
    readonly type = AUTHENTICATE_SUCCESS;

    constructor(public payload : {
        email : string, 
        userId: string, 
        token:string, 
        expirationDate:Date,
        redirect:boolean
        }
    ) {}
}

export class AuthenticateFail implements Action {
    readonly type = AUTHENTICATE_FAIL;

    constructor(public payload : string
    ) {}
}

export class Logout implements Action {
    readonly type = LOGOUT
}

export class LoginStart implements Action {
    readonly type = LOGIN_START

    constructor(public payload : {
        email:string,
        password:string
    }
    ){}
}

export class SignUp implements Action {
    readonly type = SIGN_UP
}

export class ClearError implements Action {
    readonly type = CLEAR_ERROR;
}


export class SignUpStart implements Action {
    readonly type = SIGN_UP_START

    constructor(public payload : {
        email:string,
        password:string
    }){}
}

export class AutoLogin implements Action {
    readonly type = AUTO_LOGIN;
}