import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Directive({
  selector: '[appPreventDoubleClick]'
})
export class PreventDoubleClickDirective implements OnInit, OnDestroy {
  @Input() throttleTime = 500;

  @Output() throttledClick = new EventEmitter();

  private clicks = new Subject();
  private subscription: Subscription;

  constructor() { }

  ngOnInit() {
    // We create a subscription to the click event,
    // With that click event as an input we use a pipe to add a delay to click again with throttleTime
    // Then with that event (e) created with ThrottleTime, we emit the event which is our custom function
    this.subscription = this.clicks.pipe(
      throttleTime(this.throttleTime)
    ).subscribe(e => this.emitThrottledClick(e));
  }

  emitThrottledClick(e) {
    this.throttledClick.emit(e);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // This is to interrupt the click to provide our own delay to click again
  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }
}
