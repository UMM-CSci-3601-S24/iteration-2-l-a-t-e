import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { Hunt } from './hunt';
import { HuntService } from './hunt.service';

@Component({
  selector: 'app-hunt-list',
  standalone: true,
  imports: [],
  templateUrl: './hunt-list.component.html',
  styleUrl: './hunt-list.component.scss'
})
export class HuntListComponent implements OnInit, OnDestroy {
  // These are public so that tests can reference them (.spec.ts)
  public serverFilteredHunts: Hunt[];

  public huntHost: string;

  errMsg = '';
  private ngUnsubscribe = new Subject<void>();

  /**
   * This constructor injects both an instance of `HuntService`
   * and an instance of `MatSnackBar` into this component.
   * `HuntService` lets us interact with the server.
   *
   * @param huntService the `HuntService` used to get hunts from the server
   * @param snackBar the `MatSnackBar` used to display feedback
   */
  constructor(private huntService: HuntService, private snackBar: MatSnackBar) {
    // Nothing here – everything is in the injection parameters.
  }

  /**
   * Get the hunts from the server
   */
  getHuntsFromServer(): void {
    this.huntService.getHunts({
      hostid: this.huntHost,

    }).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (returnedHunts) => {
        this.serverFilteredHunts = returnedHunts;
      },
      error: (err) => {
        if (err.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          this.errMsg = `Problem in the client - Error: ${err.error.message}`;
        } else {
          this.errMsg = `Problem on the server - Error Code: ${err.status}\nMessage: ${err.message}`;
        }
        this.snackBar.open(
          this.errMsg,
          'OK',
          { duration: 6000 });
      },
    });
  }

  ngOnInit(): void {
    this.getHuntsFromServer();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
