import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HuntService } from '../services/hunt.service';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-hunt-edit',
  templateUrl: './hunt-edit.component.html',
  styleUrls: ['./hunt-edit.component.css']
})
export class HuntEditComponent implements OnInit {
  hunt: Hunt;
  tasks: Task[];

  constructor(
    private route: ActivatedRoute,
    private huntService: HuntService,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.huntService.getHunt(id).subscribe(hunt => {
      this.hunt = hunt;
      this.taskService.getTasksForHunt(hunt._id).subscribe(tasks => {
        this.tasks = tasks;
      });
    });
  }

  onSubmit(): void {
    this.huntService.updateHunt(this.hunt._id, this.hunt).subscribe();
    this.tasks.forEach(task => {
      this.taskService.updateTask(task._id, task).subscribe();
    });
  }
}
