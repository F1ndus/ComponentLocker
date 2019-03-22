import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ComponentLockerModule} from 'component-locker';
import {Form, FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ComponentLockerModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
