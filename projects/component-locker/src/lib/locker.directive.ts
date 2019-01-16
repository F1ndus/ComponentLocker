import {Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {LockEvent} from './lock-event';
import {ComponentLockerService} from './component-locker.service';

@Directive({
  selector: '[clLocker]'
})
export class LockerDirective implements OnInit, OnDestroy {

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public lockerService: ComponentLockerService
  ) { }
  private unsubscribe: Subject<void> = new Subject();
  private lockCounter = 0;

  @Input()
  name: string;

  @Input()
  dependsOn: string

  ngOnInit(): void {
    console.log('Directive oninit', this.name);
    this.lockerService.subject.pipe(
      takeUntil(this.unsubscribe),
      filter(event => event.componentName === this.name)
    ).subscribe(data => {
      console.log('Locked', data);
      if (data.locked) {
        // this.el.nativeElement.style.filter = 'blur(8px)';
        this.toggleControls(true);
      } else {
        // this.el.nativeElement.style.filter = 'blur(0px)';
        this.toggleControls(false);
      }
    });
    this.lockerService.register(this.name, this.dependsOn);
  }
  private toggleControls(disable: boolean) {
    const elements = this.el.nativeElement.querySelectorAll('input, select');
    for (let i = 0; i < elements.length; i++) {
      console.log(elements[i].disabled);
      elements[i].disabled = disable;
    }
  }

  ngOnDestroy(): void {
    console.log('dead', this.name);
    this.lockerService.unregister(this.name);
    this.unsubscribe.next();
    this.unsubscribe.complete();
    console.log('destroy directive', this.lockerService.map);
  }

}
