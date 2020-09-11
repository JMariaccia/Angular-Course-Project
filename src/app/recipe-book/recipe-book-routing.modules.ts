import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeBookComponent } from './recipe-book.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeResolverService } from './recipe-resolver.service'
import { AuthGuard } from '../auth/auth-guard'

const routes: Routes = [

    {
        path: '', component: RecipeBookComponent, canActivate: [AuthGuard], children: [
            { path: '', component: RecipeStartComponent },
            { path: 'new', component: RecipeEditComponent },
            { path: ':id', component: RecipeDetailComponent, resolve: [RecipeResolverService] },
            { path: ':id/edit', component: RecipeEditComponent, resolve: [RecipeResolverService] },
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecipeBookRoutingModule {}
