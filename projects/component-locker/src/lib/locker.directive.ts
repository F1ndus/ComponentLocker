import {Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
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
    //  transition: opacity .25s ease-in-out;
    this.el.nativeElement.style.transition = '.25s ease-in-out';
    this.lockerService.subject.pipe(
      takeUntil(this.unsubscribe),
      filter(event => event.componentName === this.name)
    ).subscribe(data => {
      // console.log('Locked', data);
      if (data.locked) {
        this.el.nativeElement.style.pointerEvents = 'none';
        this.el.nativeElement.style.opacity = '0.5';
        this.toggleControls(true);
      } else {
        this.el.nativeElement.style.pointerEvents = 'auto';
        this.el.nativeElement.style.opacity = '1';
        this.toggleControls(false);
      }
    });
    this.lockerService.register(this.name, this.dependsOn);
  }
  private toggleControls(disable: boolean) {
    const elements = this.el.nativeElement.querySelectorAll('input, select, button');
    for (let i = 0; i < elements.length; i++) {
      elements[i].disabled = disable;
    }
  }

  ngOnDestroy(): void {
    this.lockerService.unregister(this.name);
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
