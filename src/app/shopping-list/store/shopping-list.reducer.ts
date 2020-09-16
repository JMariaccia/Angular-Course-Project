import { Ingredient } from '../../shared/ingredient.model'
import * as ShoppingListActions from './shopping-list.actions'


export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex : number;
}


const initialState : State = {
    ingredients : [
        new Ingredient ('Apples', 8),
        new Ingredient (' Tomato', 6)
      ],
      editedIngredient: null,
      editedIngredientIndex: -1
};

export function shoppingListReducer(state : State = initialState , action : ShoppingListActions.ShoppingListActionsType) {
    switch(action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                //copy the old state before modifying them
                ... state,
                ingredients: [
                    //copy the old ingredients state before modifying them
                    ...state.ingredients,
                    action.payload
                ]
            };

            case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ... state,
                ingredients: [
                    //... extract the data of an array
                    ...state.ingredients,
                    ...action.payload
                ]
            };

            case ShoppingListActions.UPDATE_INGREDIENT:
                //never use the current state always update a copy of it
                const oldIngredient = state.ingredients[state.editedIngredientIndex]
                const updatedIngredient = {
                    //copy the data of the oldIngredient and overwrite them with the data of the newIngridient '...' operator read the content of them
                    ...oldIngredient,
                    ...action.payload 
                }

                const updatedIngredients = [...state.ingredients];
                //edit the array with data of your original array within
                updatedIngredients[state.editedIngredientIndex] = updatedIngredient
            return {
                ... state,
                ingredients: updatedIngredients,
                editedIngredient : null,
                editedIngredientIndex : -1
            };

            case ShoppingListActions.DELETE_INGREDIENT:
            return {
                ... state,
                //filter retourne une copie du tableau en retirant l'élément qui possède le meme index que notre argument du payload
                ingredients: state.ingredients.filter((ig, igIndex) => {
                    return igIndex !== state.editedIngredientIndex;
                }),
                editedIngredient : null,
                editedIngredientIndex : -1
            };
            
            case ShoppingListActions.START_EDIT:
            return {
                ... state,
                editedIngredientIndex: action.payload,
                editedIngredien : { ...state.ingredients[action.payload]}
            };

            case ShoppingListActions.STOP_EDIT:
            return {
                ... state,
                editedIngredient : null,
                editedIngredientIndex : -1
            };
            default:
                return state; 
    }

}