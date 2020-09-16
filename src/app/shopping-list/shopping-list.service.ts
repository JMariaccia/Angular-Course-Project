import { Injectable } from '@angular/core'

import { Ingredient } from '../shared/ingredient.model'
import { Subject } from 'rxjs';

@Injectable({
  providedIn:'root'
})
export class ShoppingListService {
    ingredientChanged = new Subject<Ingredient[]>()
    startingEditing = new Subject<number>();
    ingredients : Ingredient[] = [
        new Ingredient ('Apples', 8),
        new Ingredient (' Tomato', 6)
      ];
    // ingredients : Ingredient[] = [];
    
      getIngredients(){
        return this.ingredients.slice();
      }

      getIngredient(index:number){
        return this.ingredients[index]
      }

      onIngredientAdded(item :Ingredient){
        this.ingredients.push(item); 
      }

      AddIngredient(ingredient: Ingredient){
        this.ingredients.push(ingredient);
        this.ingredientChanged.next(this.ingredients.slice());
      }

      UpdateIngredient(index:number, newIngredient: Ingredient) {
        this.ingredients[index] = newIngredient;
        this.ingredientChanged.next(this.ingredients.slice());
      }

      DeleteIngredient(index:number){
        this.ingredients.splice(index,1);
        this.ingredientChanged.next(this.ingredients.slice());
      }
      AddIngredients(ingredients:Ingredient[]){
        // for(let ing of ingredients){
        //   this.AddIngredient(ing);
        // }
        // les ... = spread operator fait d'un tableau une liste qui est surporter par le push
        this.ingredients.push(...ingredients);
        this.ingredientChanged.next(this.ingredients.slice())
      }

}