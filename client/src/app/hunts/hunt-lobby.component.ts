import { Component, OnInit } from '@angular/core';
import { LobbyService, Lobby, Group } from './lobby.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HuntService } from './hunt.service';
import { Task } from './task';
import { TaskService } from './task.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-hunt-lobby',
  templateUrl: './hunt-lobby.component.html',
  styleUrls: ['./hunt-lobby.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class HuntLobbyComponent implements OnInit {
  lobbies: Lobby[] = [];
  inviteCode: string;
  lobby: Lobby;
  errorMessage: string;
  searchedLobby: null;
  username: string;
  taskList: Task[];
  groupList: Group[] = [];

  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute, private lobbyService: LobbyService, private huntService: HuntService, private taskService: TaskService) {
      this.username = this.lobbyService.getUsername();
  }

  ngOnInit(): void {
    this.lobbies = this.lobbyService.getAllOpenHunts();
    this.inviteCode = this.lobbyService.getInviteCode();
    this.lobby = this.lobbyService.searchByInviteCode();
    this.loadTaskList();

    for(const groupId of this.lobby.groupids)
    {
      this.lobbyService.getGroupById(groupId).subscribe(
        (group: Group) => {
          this.groupList.push(group);
          console.log(group);
        },
        error => {
          console.error('Error:', error);
        }
      );
    }
  }

  loadTaskList(): void {
    // Assuming getTasks returns an Observable<Task[]>
    this.taskService.getTasks({huntid: this.lobby.huntid}).subscribe(
      (data: Task[]) => {
        this.taskList = data;
      },
      error => {
        console.error('Failed to load tasks', error);
      }
    );
  }
}
