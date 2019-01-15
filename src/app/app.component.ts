import {Component, OnInit} from '@angular/core';
import {ComponentLockerService} from 'component-locker';

@Component({
  selector: 'ld-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private toggled: boolean = true;
  private val = 'meem';

  constructor(
    private lockservice: ComponentLockerService
    ) {}

  title = 'locker-demo';
  meemObs = this.lockservice.subject;
  lock() {
    this.lockservice.lock(this.val);
  }
  unlock() {
    this.lockservice.unlock(this.val);
  }

  ngOnInit(): void {

  }

  toggle() {
    this.toggled = !this.toggled;
  }
}

