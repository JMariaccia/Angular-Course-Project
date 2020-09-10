import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators'

import { RecipeService } from '../recipe-book/recipe.service'
import { Recipe } from '../recipe-book/recipe.model'
import { AuthService } from '../auth/auth.service';


@Injectable({
    providedIn: 'root'
})
export class DataStorageService {
    constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http.put('https://course-project-db-217ac.firebaseio.com/recipes.json', recipes)
            .subscribe(response => {
                console.log(response);
            })
    }

    fetchRecipes() {

        return this.http.get<Recipe[]>(
            'https://course-project-db-217ac.firebaseio.com/recipes.json'
        ).pipe(
            map(recipes => {
                return recipes.map(recipes => {
                    return {
                        ...recipes,
                        ingredients: recipes.ingredients ? recipes.ingredients : []
                    };
                });
            }),
            tap(recipes => {
                this.recipeService.setRecipes(recipes);
            })
        );
    }
}
                    // .pipe(map(recipes => {
                    //     //check section 282 both map methods are differents one is from rxjs the other is an array method
                    //     return recipes.map(recipe => {
                    //         return {...recipe, ingredients : recipe.ingredients ? recipe.ingredients : []}
                    //     })
                    // })
                    // .subscribe(recipes=>{
                    //     this.recipeService.setRecipes(recipes)
                    // })