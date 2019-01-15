import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ComponentLockerModule} from 'component-locker';

import {AppComponent} from './app.component';
import { TestDirective } from './test.directive';

@NgModule({
  declarations: [
    AppComponent,
    TestDirective
  ],
  imports: [
    BrowserModule,
    ComponentLockerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
