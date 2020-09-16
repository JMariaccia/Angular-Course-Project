import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from './user.model'
import { Router } from '@angular/router';
import { environment} from '../../environments/environment';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer'
import * as AuthActions from './store/auth.actions'
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';

export interface AuthResponseData {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn : string,
    localId: string,
    registered?: boolean
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer:any;
    
    constructor(private http: HttpClient, private router:Router, private store : Store<fromApp.AppState>) { }
    
    setLogoutTimer(expirationDuration:number){
        this.tokenExpirationTimer = setTimeout(()=>{
            this.store.dispatch(new AuthActions.Logout())
        },expirationDuration)
    }

    clearLogoutTimer() {
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer),
            this.tokenExpirationTimer = null;
        }
    }
     
    // signUp(email: string, pwd: string) {
    //     return this.http
    //         .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+ environment.firebaseAPIKey,
    //             {
    //                 email: email,
    //                 password: pwd,
    //                 returnSecureToken: true
    //             }
    //         ).pipe(
    //             catchError(this.handleError),
    //             tap(resData => {
    //                 this.handleAuthentification(
    //                     resData.email,
    //                     resData.localId,
    //                     resData.idToken,
    //                     +resData.expiresIn 
    //                 );
    //             })
    //         );
    // }

    // logIn(email: string, pwd: string) {
    //     return this.http
    //         .post<AuthResponseData>
    //         ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+ environment.firebaseAPIKey,
    //             {
    //                 email: email,
    //                 password: pwd,
    //                 returnSecureToken: true
    //             }
    //         ).pipe(
    //             catchError(this.handleError),
    //             tap(resData => {
    //                 this.handleAuthentification(
    //                     resData.email,
    //                     resData.localId,
    //                     resData.idToken,
    //                     +resData.expiresIn 
    //                 );
    //             })
    //         );
    // }

    // autoLogin() {
    //     const userData : {
    //         email:string;
    //         id:string;
    //         _token:string;
    //         _tokenExpirationDate: string;
    //     } = JSON.parse(localStorage.getItem('userData'));

    //     if(!userData) {
    //         return;
    //     }
    //     const loadedUser = new User(
    //         userData.email, 
    //         userData.id, 
    //         userData._token,
    //         new Date(userData._tokenExpirationDate)
    //     );


    //     console.log('Expiration Date : ',userData._tokenExpirationDate)


    //     if(loadedUser.token) {
    //         // this.user.next(loadedUser);
    //         this.store.dispatch(new AuthActions.AuthenticateSuccess({
    //             email: loadedUser.email, 
    //             userId : loadedUser.id, 
    //             token : loadedUser.token, 
    //             expirationDate : new Date(userData._tokenExpirationDate)
    //             })
    //         );

    //         const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
    //         this.autoLogout(expirationDuration);

    //     }
    // }

    // logout() {
    //     // this.user.next(null);
    //     this.store.dispatch(new AuthActions.Logout())
    //     this.router.navigate(['/auth']);
    //     localStorage.removeItem('userData');
    //     if(this.tokenExpirationTimer){
    //         clearTimeout(this.tokenExpirationTimer);
    //     }
    //     this.tokenExpirationTimer = null;
    // }


    // private handleAuthentification(email: string, userId: string, token: string, expiresIn : number) {
    //     //Créer un date en prenant le nombre de milliseconde de la date actuelle et en y ajoutant le nombre de milliseconde de l'expiration du token 
    //     const expirationDate = new Date(
    //         new Date().getTime() + expiresIn  * 1000
    //     );

    //     const user = new User(
    //         email,
    //         userId,
    //         token,
    //         expirationDate
    //     );

    //     // this.user.next(user);
    //     this.store.dispatch(new AuthActions.AuthenticateSuccess({
    //         email: email,
    //         userId : userId, 
    //         token : token, 
    //         expirationDate : expirationDate
    //         })
    //     );
    //     this.autoLogout(expiresIn * 1000);
    //     localStorage.setItem('userData', JSON.stringify(user));
    //     console.log('DATE : ',expiresIn );
    // }

    // private handleError(errorRes: HttpErrorResponse) {
    //     let errorMessage = 'An unknow error occured !';
    //     if (!errorRes.error || !errorRes.error.error) {
    //         return throwError(errorMessage);
    //     }
    //     switch (errorRes.error.error.message) {
    //         case 'EMAIL_EXISTS':
    //             errorMessage = "This email already exist !";
    //             break;
    //         case 'OPERATION_NOT_ALLOWED':
    //             errorMessage = "La connexion n'est pas autorisée";
    //             break;
    //         case 'TOO_MANY_ATTEMPTS_TRY_LATER':
    //             errorMessage = "Merci de réessayer plus trard, trop de tentative effectuée";
    //             break;
    //         case 'EMAIL_NOT_FOUND':
    //             errorMessage = "This email does not exist !";
    //             break;
    //         case 'INVALID_PASSWORD':
    //             errorMessage = "Invalid Password";
    //             break;
    //         case 'USER_DISABLED':
    //             errorMessage = "This user is disabled";
    //             break;
    //     }
    //     return throwError(errorMessage);
    // }
}