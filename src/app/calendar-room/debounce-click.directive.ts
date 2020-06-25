import { Directive, EventEmitter, OnInit, HostListener, Input, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Directive({
  selector: '[appDebounceClick]'
})
export class DebounceClickDirective implements OnInit {
  @Input() debounceTime = 500;
  @Output() debounceClick = new EventEmitter();
  private clicks = new Subject()
  private subscription: Subscription;

  constructor() {}

  ngOnInit() {
    this.clicks
      .pipe(debounceTime(this.debounceTime))
      .subscribe(e => this.debounceClick.emit(e));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // In our case, the html button we apply this directive is the host we're listening to
  @HostListener('click', ['$event'])
  // Allows us to intercept the 'click' event
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }
}
