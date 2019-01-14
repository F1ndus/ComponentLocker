import {Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {LockEvent} from './lock-event';

@Directive({
  selector: '[clLocker]'
})
export class LockerDirective implements OnInit, OnDestroy {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { }
  private unsubscribe: Subject<void> = new Subject();

  @Input()
  lockObservable: Observable<LockEvent>;

  @Input()
  name: string;

  ngOnInit(): void {
    console.log('Directive oninit');
    this.lockObservable.pipe(
      takeUntil(this.unsubscribe),
      tap(x => console.log(x)),
      filter(event => event.componentName === this.name)
    ).subscribe(data => {
      console.log('Locked', data);
      if (data.locked) {
        this.el.nativeElement.style.backgroundColor = 'black';
      } else {
        this.el.nativeElement.style.backgroundColor = 'white';
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
