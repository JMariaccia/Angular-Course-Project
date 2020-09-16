import { Recipe } from '../recipe.model'
import * as RecipesAction from './recipe.actions'

export interface State {
    recipes : Recipe[];
}

const initialState: State = {
    recipes : []
}

export function RecipeReducer (state = initialState , action : RecipesAction.RecipesActions) {
    switch(action.type) {
        case RecipesAction.SET_RECIPES:
            return {
                ...state,
                //... will pull out all recipes from the payload
                recipes : [...action.payload]
            }
            case RecipesAction.ADD_RECIPE:
            return {
                ...state,
                recipes : [...state.recipes, action.payload]
            }
            case RecipesAction.UPDATE_RECIPE:
            const updatedRecipe = {
                ...state.recipes[action.payload.index],
                ...action.payload.newRecipe 
            };
            const updatedRecipes = [...state.recipes];
            updatedRecipes[action.payload.index] = updatedRecipe
            return {
                ...state,
                recipes : updatedRecipes
            }
            case RecipesAction.DELETE_RECIPE:
            return {
                ...state,
                //filter create a copy of the recipes list and remove the element that match the same index as the payload
                recipes : state.recipes.filter((recipe,index) => {
                    return index !== action.payload
                })
            }
        default:
            return state;
    }

}