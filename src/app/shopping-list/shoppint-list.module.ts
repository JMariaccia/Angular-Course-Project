import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { ShoppingListRoutingModule } from './shopping-list-routing.module';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingListEditComponent } from './shopping-list-edit/shopping-list-edit.component';

@NgModule({
    declarations : [
        ShoppingListComponent,
        ShoppingListEditComponent,
    ],
    imports: [
        RouterModule,
        FormsModule,
        ShoppingListRoutingModule,
        SharedModule,
    ], 
})
export class ShoppingListModule {

} 