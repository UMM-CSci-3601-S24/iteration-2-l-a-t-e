import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subject, of } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { OpenHunt } from './openHunt';
import { Hunt } from '../hunts/hunt';
import { Task } from '../hunts/task';
import { HuntService } from '../hunts/hunt.service';
import { TaskService } from '../hunts/task.service';
import { OpenHuntService } from './openHunt.service';



@Component({
  selector: 'app-open-hunt',
  standalone: true,
  imports: [
    MatCardModule
  ],
  templateUrl: './open-hunt.component.html',
  styleUrl: './open-hunt.component.scss'
})
export class OpenHuntComponent implements OnInit, OnDestroy {
  openHunt: OpenHunt;
  tasks: Task[] = [];
  error: { help: string, httpResponse: string, message: string };

  public serverFilteredHunts: Hunt[];
  public serverOpenHunts: OpenHunt[];
  errMsg = '';
  public currentHost = 'kk';

  private ngUnsubscribe = new Subject<void>();

  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute, private huntService: HuntService, private taskService: TaskService, private openHuntservice: OpenHuntService) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map((paramMap: ParamMap) => paramMap.get('id')),
      switchMap((id: string) => this.openHuntservice.getOpenHuntById(id)),
      switchMap((openhunt: OpenHunt) => {
        this.openHunt = openhunt;
        return of(openhunt);
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
    // console.log("openhunt " + this.openHunt)
    // console.log("groups: " + this.openHunt.groups)
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
