import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeBookComponent } from './recipe-book/recipe-book.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipeDetailComponent } from './recipe-book/recipe-detail/recipe-detail.component';
import { RecipeStartComponent } from './recipe-book/recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-book/recipe-edit/recipe-edit.component';
import { RecipeResolverService} from './recipe-book/recipe-resolver.service'
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth-guard'

const routes: Routes = [
{
  path: '', redirectTo: '/recipes', pathMatch:'full'
},
{
  path: 'shopping-list', component : ShoppingListComponent
},
{
  path: 'recipes', component: RecipeBookComponent,canActivate : [AuthGuard], children :[
    { path: '', component: RecipeStartComponent },
    { path: 'new', component: RecipeEditComponent },
    { path: ':id', component: RecipeDetailComponent, resolve: [RecipeResolverService] },
    { path: ':id/edit', component: RecipeEditComponent,resolve: [RecipeResolverService]  },    
  ]
},
{ path: 'auth', component: AuthComponent},
// {
//   path: '**', pathMatch:'full' , redirectTo:'/recipes'
// }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
