import { Component } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'ld-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'locker-demo';
  meemObs = new BehaviorSubject({componentName: 'meem', locked: false});
  test() {
    this.meemObs.next({componentName: 'meem', locked: true});
  }
}
