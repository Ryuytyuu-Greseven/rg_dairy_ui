import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookComponent } from './book/book.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth/auth.guard';
import { BooksCatalogComponent } from './books-catalog/books-catalog.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {
    path: 'book',
    component: BookComponent,
    canActivate: [authGuard],
    children: [],
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'books-catalog',
    component: BooksCatalogComponent,
    canActivate: [authGuard],
    children: [{ path: '**', component: BookComponent }],
  },
  {
    path: 'about-us',
    component: AboutComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }, // redirect all undeclared uls to login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
