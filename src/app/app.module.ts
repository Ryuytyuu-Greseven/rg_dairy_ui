import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HttpClientModule } from '@angular/common/http';
import { AppServiceService } from './app-service.service';
import { AppSettings } from './app-settings';
import { ToastrModule } from 'ngx-toastr';
import { BookComponent } from './book/book.component';
import { LoginComponent } from './login/login.component';
import { BooksCatalogComponent } from './books-catalog/books-catalog.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [AppComponent, BookComponent, LoginComponent, BooksCatalogComponent, AboutComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    // materials
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    ToastrModule.forRoot(),

    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [AppServiceService, AppSettings],
  bootstrap: [AppComponent],
})
export class AppModule {}
