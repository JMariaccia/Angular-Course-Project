import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
 
@Component({
    selector:'app-shopping-list-edit',
    templateUrl:'./shopping-list-edit.component.html',
    styleUrls:['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
    @ViewChild('f', {static: false}) slForm : NgForm;
    subscription: Subscription;
    editMode = false;
    editedItemIndex: number;
    editedItem : Ingredient

    constructor(private sLService:ShoppingListService){}

    ngOnInit(){
        this.subscription = this.sLService.startingEditing.subscribe(
            (index:number)=> {
                this.editedItemIndex = index;
                this.editMode = true;
                this.editedItem = this.sLService.getIngredient(index);
                this.slForm.setValue({
                    name: this.editedItem.name,
                    amount: this.editedItem.amount
                })
            }
        ) 
    }

    onSubmit(form : NgForm){
        const value = form.value;
        const newIngredient = new Ingredient(value.name,value.amount);

        if(this.editMode){
            this.sLService.UpdateIngredient(this.editedItemIndex, newIngredient )
        }
        else {
            this.sLService.AddIngredient(newIngredient)
        }
        this.editMode = false;
        form.reset()
    }
    
    onDelete(){
        this.sLService.DeleteIngredient(this.editedItemIndex);
        this.onClear() 
    }


    onClear(){
        this.slForm.reset()
        this.editMode = false;
    }
    ngOnDestroy(){
        this.subscription.unsubscribe()
    }
}