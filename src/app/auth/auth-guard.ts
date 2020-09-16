import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service'
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer'

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate {

    constructor(private authService:AuthService, private router:Router, private store:Store<fromApp.AppState>) {}

    canActivate(
        route: ActivatedRouteSnapshot, 
        router : RouterStateSnapshot
        ) : boolean 
          | UrlTree 
          | Promise<boolean | UrlTree> 
          | Observable<boolean | UrlTree> 
    {
        // return this.authService.user.pipe(
            return this.store.select('auth').pipe(
            take(1),
            map(authState => {
                return authState.user
            }),
            take(1), 
            map(user=>{
            // !! return a true or false boolean depending of the state of the value after 
            const isAuth = !!user;

            if(isAuth){
                return true;
            }
            return this.router.createUrlTree(['/auth']);
        }));
    }

}