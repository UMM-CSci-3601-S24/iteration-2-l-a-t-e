import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Lobby, LobbyService } from '../hunts/lobby.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-home-component',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [],
    standalone: true,
    imports: [MatCardModule, FormsModule, CommonModule]
})

export class HomeComponent {

  username: string;
  inviteCode: string;
  lobbies: Lobby[];
  lobby: Lobby;
  constructor(private router: Router, private lobbyService: LobbyService) { }
  showHunterInput: boolean = false;


  hostLogin() {
    this.router.navigate(['/login']); // Navigate to the 'add-hunt' route
  }

  showHunterForm() {
    this.showHunterInput = !this.showHunterInput; // Set the flag to the opposite
    if(!this.showHunterInput)
    {
      this.username = '';
      this.inviteCode = '';
    }
  }

  submitHunterForm() {

  }

  submitCode() {
    this.lobbies = this.lobbyService.getAllOpenHunts();
    this.lobbyService.setInviteCode(this.inviteCode);
    this.lobby = this.lobbyService.searchByInviteCode();
    if(this.lobby)
    {
      this.lobbyService.setUsername(this.username);
      this.router.navigate(['/hunt-lobby']);
    }
    else
    {
       window.alert('Error: Invalid Invite Code');
       this.inviteCode = '';
       this.username = '';
        this.lobbyService.setInviteCode(this.inviteCode);
    }
  }
  searchByInviteCode() {
    if (this.inviteCode) {
      this.lobby = this.lobbies.find(lobby => lobby.invitecode.trim() === this.inviteCode.trim());
    } else {
      console.error('Please enter a valid invite code.');
    }
  }

  // navigateToCreateTask(): void {
  //   // this.router.navigate(['../','task','new', this.taskHuntId], {relativeTo: this.route});
  //   this.router.navigate(['task','new', '65de46d19a719626538626bc']);
  // }
}
