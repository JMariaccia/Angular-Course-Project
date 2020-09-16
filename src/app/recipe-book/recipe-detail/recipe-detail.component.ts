import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Params, ActivatedRoute, Router } from '@angular/router';
import * as fromApp from '../../store/app.reducer'
import * as RecipesActions from '../store/recipe.actions'
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipeDetailed: Recipe;
  id: number;
  constructor(
    private recipeService: RecipeService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private store:Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(map(params => {
      return +params['id'];
    }),
      switchMap(id => {
        this.id = id;
        return this.store.select('recipes');
      }),
      map(recipesStates => {
        return recipesStates.recipes.find((recipe, index) => {
          return index == this.id
        });
      })
    )
    .subscribe(recipe => {
        this.recipeDetailed = recipe;
      });
    // this.recipeDetailed = this.recipeService.getRecipe(this.id);
  }

  onAddToShoppingList() {
    this.recipeService.addIngredientToShoppingList(this.recipeDetailed.ingredients);
  }
  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(['../',this.id,'edit'], {relativeTo: this.route});
  }
  onDeleteRecipe() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id)); 
    this.router.navigate(['/recipes']);
  }
}
