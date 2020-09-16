import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as ShoppingListActions from '../store/shopping-list.actions'
import * as fromApp from '../../store/app.reducer'

 
@Component({
    selector:'app-shopping-list-edit',
    templateUrl:'./shopping-list-edit.component.html',
    styleUrls:['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
    @ViewChild('f', {static: false}) slForm : NgForm;
    subscription: Subscription;
    editMode = false;
    editedItem : Ingredient 

    constructor(private sLService:ShoppingListService, private store :Store<fromApp.AppState>){}

    ngOnInit(){
        this.subscription = this.store
            .select('shoppingList')
            .subscribe(stateData =>{
                if(stateData.editedIngredientIndex > -1) {
                    this.editMode = true;
                    this.editedItem = stateData.editedIngredient;
                    this.slForm.setValue({
                        name: this.editedItem.name,
                        amount: this.editedItem.amount
                    })
                } else {
                    this.editMode = false;
                }
            })
        // this.subscription = this.sLService.startingEditing.subscribe(
        //     (index:number)=> {
        //         this.editedItemIndex = index;
        //         this.editMode = true;
        //         this.editedItem = this.sLService.getIngredient(index);
        //         this.slForm.setValue({
        //             name: this.editedItem.name,
        //             amount: this.editedItem.amount
        //         })
        //     }
        // ) 
    }

    onSubmit(form : NgForm){
        const value = form.value;
        const newIngredient = new Ingredient(value.name,value.amount);

        if(this.editMode){
            // this.sLService.UpdateIngredient(this.editedItemIndex, newIngredient )
            this.store.dispatch(
                new ShoppingListActions.UpdateIngredient(newIngredient)
            );
        }
        else {
            //with service
                // this.sLService.AddIngredient(newIngredient)
            //with reducer and store
            this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient))
        }
        this.editMode = false;
        form.reset()
    }
    
    onDelete(){
        // this.sLService.DeleteIngredient(this.editedItemIndex);
        this.store.dispatch(new ShoppingListActions.DeleteIngredient());
        this.onClear() 
    }


    onClear(){
        // this.slForm.reset()
        this.store.dispatch(new ShoppingListActions.StopEdit());
        this.editMode = false;
    }
    ngOnDestroy(){
        this.subscription.unsubscribe()
        this.store.dispatch(new ShoppingListActions.StopEdit());

    }
}