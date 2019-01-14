import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ComponentLockerModule } from 'component-locker';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ComponentLockerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
