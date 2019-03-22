import {NgModule} from '@angular/core';
import {LockerDirective} from './locker.directive';
import {ComponentLockerService} from './component-locker.service';

@NgModule({
  declarations: [LockerDirective],
  imports: [
  ],
  exports: [LockerDirective],
  providers: [ComponentLockerService]
})
export class ComponentLockerModule { }
