import {
  BehaviorSubject,
  Observable,
  Subject,
  debounceTime,
  fromEvent,
  tap,
  timer,
} from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PollingService {
  private pollingInterval = 10000; // 10 seconds
  private destroySub = new Subject();
  private active$ = new BehaviorSubject(true);
  private shouldEmit = false;

  public startPolling(): Observable<number> {
    fromEvent(document, 'visibilitychange')
      .pipe(
        tap(() => {
          if (!document.hidden && this.shouldEmit) {
            this.active$.next(true);
            this.shouldEmit = false;
          }
        }),
        debounceTime(this.pollingInterval),
      )
      .subscribe(() => {
        if (document.hidden) {
          this.destroySub.next(true);
          this.shouldEmit = true;
        }
      });

    return this.active$.pipe(
      switchMap(() => {
        return timer(0, this.pollingInterval).pipe(
          takeUntil(this.destroySub),
          filter(() => !document.hidden && window.navigator.onLine),
        );
      }),
    );
  }
}
