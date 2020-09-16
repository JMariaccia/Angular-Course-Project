import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData} from './auth.service'
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component'
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer'
import * as AuthActions from '../auth/store/auth.actions'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading=false;
  error:string = null;
  // @ViewChild(PlaceholderDirective, {static:false}) alertHost : PlaceholderDirective;

  // private closeSub:Subscription
  private storeSub:Subscription

  constructor(
    private authService : AuthService, 
    private router: Router, 
    private compenentFactoryResolver:ComponentFactoryResolver,
    private store : Store<fromApp.AppState>
    ) { }

    ngOnInit(){
      this.storeSub = this.store.select('auth').subscribe(authState => {
        this.isLoading = authState.loading;
        this.error = authState.authError;
      })
    }

  onHandleError(){
    // this.error = null;
    this.store.dispatch(new AuthActions.ClearError());
  }

  // private showErrorAlert(errorMessage: string) {
  //   const alertCmpFactory = 
  //     this.compenentFactoryResolver.resolveComponentFactory( AlertComponent)
  //   const hostViewContainerRef = this.alertHost.viewContainerRef;
  //   hostViewContainerRef.clear();

  //   const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

  //   componentRef.instance.message = errorMessage;
  //   this.closeSub = componentRef.instance.close.subscribe(() => {
  //     this.closeSub.unsubscribe();
  //     hostViewContainerRef.clear();
  //   })
  // }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode
  }

  onSubmit(form : NgForm) {
    if(!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    // let authObs :Observable<AuthResponseData>;

    // this.isLoading = true;

    if(this.isLoginMode) {
      // authObs = this.authService.logIn(email,password);  
      this.store.dispatch(new AuthActions.LoginStart({email:email, password:password}))
    } else {
      // authObs = this.authService.signUp(email,password); 
      this.store.dispatch(new AuthActions.SignUpStart({email:email, password: password}))
    }
  //   authObs.subscribe(
  //     responseData => {
  //       console.log(responseData)
  //       this.isLoading = false;
  //       this.router.navigate(['/recipes']);
  //     },
  //     errorMessage => {
  //       console.log(errorMessage);
  //       this.error = errorMessage;
  //       // this.showErrorAlert(errorMessage)
  //       this.isLoading = false;
  //     }
  //  );
    form.reset();
  }

  ngOnDestroy(): void {
    if(this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

}
