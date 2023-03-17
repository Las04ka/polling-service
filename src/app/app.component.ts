import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// eslint-disable-next-line sort-imports
import { PollingService } from './polling.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  subscription = new Subscription();
  constructor(private pollingService: PollingService) {}

  ngAfterViewInit() {
    this.subscription = this.pollingService
      .startPolling()
      .subscribe(() => console.log(1));
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
