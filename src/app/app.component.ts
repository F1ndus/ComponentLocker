import {Component, OnInit} from '@angular/core';
import {ComponentLockerService} from 'component-locker';

@Component({
  selector: 'ld-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private toggled: boolean = true;

  constructor(
    private lockservice: ComponentLockerService
    ) {}

  title = 'locker-demo';
  meemObs = this.lockservice.subject;
  lock() {
    this.lockservice.lock('meem');
  }
  unlock() {
    this.lockservice.unlock('meem');
  }

  ngOnInit(): void {

  }

  toggle() {
    this.toggled = !this.toggled;
  }
}

