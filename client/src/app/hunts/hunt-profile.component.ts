import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { Hunt } from './hunt';
import { HuntCardComponent } from './hunt-card.component';
import { HuntService } from './hunt.service';

@Component({
  selector: 'app-hunt-profile',
  standalone: true,
  imports: [HuntCardComponent, MatCardModule],
  templateUrl: './hunt-profile.component.html',
  styleUrl: './hunt-profile.component.scss'
})
export class HuntProfileComponent implements OnInit, OnDestroy {
  hunt: Hunt;
  error: { help: string, httpResponse: string, message: string };

  // This `Subject` will only ever emit one (empty) value when
  // `ngOnDestroy()` is called, i.e., when this component is
  // destroyed. That can be used to tell any subscription to
  // terminate, allowing the system to free up their resources (like memory).
  private ngUnsubscribe = new Subject<void>();

  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute, private huntService: HuntService) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map((paramMap: ParamMap) => paramMap.get('id')),
      switchMap((id: string) => this.huntService.getHuntById(id)),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
        next: hunt => {
          this.hunt = hunt;
          return hunt;
        },
        error: _err => {
          this.error = {
            help: 'There was a problem loading the hunt - try again.',
            httpResponse: _err.message,
            message: _err.error?.title,
          };
        }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();

    this.ngUnsubscribe.complete();
  }
}
