import { Actions, Effect, ofType } from '@ngrx/effects'
import * as RecipesActions from '../store/recipe.actions'
import { switchMap, withLatestFrom } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { Recipe } from '../recipe.model'
import { map } from 'rxjs/internal/operators/map'
import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import * as fromApp from '../../store/app.reducer'

@Injectable()
export class RecipeEffects {

    @Effect()
    fetchRecipes = this.actions$
        .pipe(
            ofType(RecipesActions.FETCH_RECIPES),
            switchMap(() => {
                return this.http.get<Recipe[]>(
                    'https://course-project-db-217ac.firebaseio.com/recipes.json'
                );
            }),
            map(recipes => {
                return recipes.map(recipes => {
                    return {
                        ...recipes,
                        ingredients: recipes.ingredients ? recipes.ingredients : []
                    };
                });
            }),
            map(recipes => {
                return new RecipesActions.SetRecipes(recipes);
            })
        );

        @Effect({dispatch:false})
        storeRecipes = this.actions$.pipe(
            ofType(RecipesActions.STORE_RECIPES),
            //merge a value of another observable into this observable stream 
            withLatestFrom(this.store.select('recipes')), 
            //array distructuring
            switchMap(([actionData, recipesState])=> {
                return this.http.put('https://course-project-db-217ac.firebaseio.com/recipes.json', recipesState.recipes) 
            })
        )

    constructor(private actions$ : Actions, private http : HttpClient, private store:Store<fromApp.AppState>){}
}