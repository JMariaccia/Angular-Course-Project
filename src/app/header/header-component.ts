import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService} from '../shared/data-storage.service'
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer'
import * as AuthActions from '../auth/store/auth.actions'
import * as RecipeActions from '../recipe-book/store/recipe.actions'
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  private subscription :Subscription
  isAuthenticated = false;

  constructor(private dataStorageService: DataStorageService, private authService: AuthService, private store:Store<fromApp.AppState>) { }

  ngOnInit(){
    // this.authService.user.subscribe(user=>{
    this.subscription = this.store.select('auth').pipe(map(authState => authState.user)).subscribe(user=>{
      this.isAuthenticated = !user ? false : true;
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  onSaveData() {
    // this.dataStorageService.storeRecipes();
    this.store.dispatch(new RecipeActions.StoreRecipes())
  }

  onFetchData() {
    // this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new RecipeActions.FetchRecipes())
  }

  onLogOut() {
    // this.authService.logout();
    this.store.dispatch(new AuthActions.Logout())

  }

}
