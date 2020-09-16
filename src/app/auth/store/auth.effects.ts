import { Actions, ofType, Effect } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import * as AuthActions from './auth.actions';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';


export interface AuthResponseData {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean
}

const handleAuthentication = (expiresIn:number, email:string, localId:string, token:string) => {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email,localId,token,expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess({
        email: email,
        userId: localId,
        token: token,
        expirationDate: expirationDate,
        redirect:true
    });
}

const handleError = (errorRes :any) => {
    let errorMessage = 'An unknow error occured !';
    if (!errorRes.error || !errorRes.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage));
    }
    switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = "This email already exist !";
            break;
        case 'OPERATION_NOT_ALLOWED':
            errorMessage = "La connexion n'est pas autorisée";
            break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
            errorMessage = "Merci de réessayer plus trard, trop de tentative effectuée";
            break;
        case 'EMAIL_NOT_FOUND':
            errorMessage = "This email does not exist !";
            break;
            case 'INVALID_PASSWORD':
                errorMessage = "Invalid Password";
                break;
                case 'USER_DISABLED':
                    errorMessage = "This user is disabled";
                    break;
                }
                return of(new AuthActions.AuthenticateFail(errorMessage));
            }
            
@Injectable()
export class AuthEffects {

    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) { }

    @Effect()
    authSignUp = this.actions$.pipe(
        ofType(AuthActions.SIGN_UP_START),
        switchMap((signupAction : AuthActions.SignUpStart) => {
            return this.http
            .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+ environment.firebaseAPIKey,
                {
                    email: signupAction.payload.email,
                    password: signupAction.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                tap(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn*1000);
                }),
                map(resData => {
                    return handleAuthentication(
                        +resData.expiresIn,
                        resData.email,
                        resData.localId,
                        resData.idToken
                    )
                }),
                catchError(errorRes => {
                    return handleError(errorRes)
                }),
            )   
        })
    );

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http
                .post<AuthResponseData>
                ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
                    {
                        email: authData.payload.email,
                        password: authData.payload.password,
                        returnSecureToken: true
                    }
                ).pipe(
                    tap(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn*1000);
                    }),
                    map(resData => {
                         return handleAuthentication(
                            +resData.expiresIn,
                            resData.email,
                            resData.localId,
                            resData.idToken
                        )
                    }),
                    catchError(errorRes => {
                        return handleError(errorRes)
                    }),
                )
        })
    )

    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN), 
        map(()=>{
            const userData : {
                email:string;
                id:string;
                _token:string;
                _tokenExpirationDate: string;
            } = JSON.parse(localStorage.getItem('userData')); 
            if(!userData) {
                return { type :'DUMMY '};
            }
            const loadedUser = new User(
                userData.email, 
                userData.id, 
                userData._token,
                new Date(userData._tokenExpirationDate)
            );    
    
            if(loadedUser.token) {
                // this.user.next(loadedUser);
                const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                this.authService.setLogoutTimer(expirationDuration)
                return new AuthActions.AuthenticateSuccess({
                    email: loadedUser.email, 
                    userId : loadedUser.id, 
                    token : loadedUser.token, 
                    expirationDate : new Date(userData._tokenExpirationDate),
                    redirect:false
                    });
                // const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                // this.autoLogout(expirationDuration);
            } 
            return { type : 'DUMMY'};
        })
    )

    @Effect({dispatch:false})
    authLogout= this.actions$.pipe(
        ofType(AuthActions.LOGOUT),tap(()=> {
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);

        })
    )


    @Effect({
        dispatch: false,
    })
    authRedirect = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
            if(authSuccessAction.payload.redirect) {
                this.router.navigate(['/'])
            }
        })
    );   
}