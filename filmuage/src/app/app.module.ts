import {AppComponent} from './app.component';
import {NgModule} from '@angular/core';
import {FilmComponent} from './film/film.component';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';

// @ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    FilmComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
