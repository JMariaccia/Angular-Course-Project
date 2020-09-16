import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import * as fromApp from '../store/app.reducer'
import * as ShoppingListActions from './store/shopping-list.actions'
import { ShoppingListService } from './shopping-list.service';
import { Subscription, Observable } from 'rxjs';
import { Store} from '@ngrx/store';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  // ingredients: Ingredient[];
  ingredients: Observable<{ingredients : Ingredient[]}>;
  // private subscription : Subscription

  constructor(
    private slService: ShoppingListService, 
    private store : Store<fromApp.AppState>,
    ) {}

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.slService.getIngredients();
    // this.subscription = this.slService.ingredientChanged.subscribe(
    //   (ingredients: Ingredient[])=> {
    //     this.ingredients = ingredients
    //   }  
    // )
  }
  ngOnDestroy(){
    // this.subscription.unsubscribe();
  }

  onEditItem(index : number){
    // this.slService.startingEditing.next(index)
    this.store.dispatch(new ShoppingListActions.StartEdit(index))
  }
}
