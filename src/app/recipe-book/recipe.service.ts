import { Recipe } from './recipe.model'

import { Injectable, EventEmitter } from '@angular/core'
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RecipeService{
    recipeChanged = new Subject<Recipe[]>();

    constructor(private slService:ShoppingListService){}
    // private recipes : Recipe[] = [
    //     new Recipe('Bolognaise',
    //     'Sauce à base de sauce tomates',
    //     'https://get.pxhere.com/photo/dish-meal-food-vegetable-recipe-cuisine-vegetarian-food-parmigiana-1417897.jpg',
    //     [
    //         new Ingredient('Tomates', 3),
    //         new Ingredient('Carotte', 1),
    //         new Ingredient('Oignion', 1),
    //         new Ingredient('Boulette de viande', 10)

    //     ]),
    //     new Recipe('Carbonara',
    //     'Sauce à base de crème fraiche',
    //     'https://get.pxhere.com/photo/dish-meal-food-vegetable-recipe-cuisine-vegetarian-food-parmigiana-1417897.jpg',
    //     [
    //         new Ingredient('Boites de lardons', 2),
    //         new Ingredient('Pot de crême fraiche', 1),
    //         new Ingredient('Oignion', 1),
    //     ])
    //   ];

    private recipes: Recipe[] = [];
    

    setRecipes(newRecipes : Recipe[]) {
        this.recipes = newRecipes;
        this.recipeChanged.next(this.recipes.slice());
    }

    getRecipes(){
        //return a copy of this array
        return this.recipes.slice();
    }

    getRecipe(index:number){
        return this.recipes[index];
    }

    addIngredientToShoppingList(ingredients:Ingredient[]){
        this.slService.AddIngredients(ingredients); 
    }

    addRecipe(recipe:Recipe){
        this.recipes.push(recipe)
        this.recipeChanged.next(this.recipes.slice());
    }

    updateRecipe(index:number, newRecipe:Recipe){
        this.recipes[index] = newRecipe;
        this.recipeChanged.next(this.recipes.slice());

    }

    deleteRecipe(index:number){
        this.recipes.splice(index,1);
        this.recipeChanged.next(this.recipes.slice());

    }
}