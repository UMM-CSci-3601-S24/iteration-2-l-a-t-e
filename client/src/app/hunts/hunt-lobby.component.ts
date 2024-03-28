import { Component, OnInit } from '@angular/core';
import { LobbyService, Lobby } from './lobby.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private lobbyService: LobbyService) { }

  ngOnInit(): void {
    this.getAllOpenHunts();
    this.inviteCode = this.lobbyService.getInviteCode();
    this.searchByInviteCode();
  }

  getAllOpenHunts(): void {
    this.lobbyService.getAllOpenHunts()
      .subscribe(
        (lobbies: Lobby[]) => {
          this.lobbies = lobbies;
        },
        (error) => {
          console.error('Error fetching open hunts:', error);
        }
      );
  }
  searchByInviteCode() {
    if (this.inviteCode) {
      this.lobby = this.lobbies.find(lobby => lobby.invitecode.trim() === this.inviteCode.trim());
    } else {
      console.error('Please enter a valid invite code.');
    }
  }
}
