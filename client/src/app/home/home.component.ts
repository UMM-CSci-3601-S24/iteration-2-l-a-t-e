import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Hunter, Lobby, LobbyService } from '../hunts/lobby.service';
import { FormsModule } from '@angular/forms';
// import { tap } from 'rxjs/operators';

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
  lobby: Lobby;
  constructor(public router: Router, public lobbyService: LobbyService) { }
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

  // submitHunterForm() {

  // }



  submitCode() {
    this.lobbyService.setInviteCode(this.inviteCode);
    this.lobbyService.searchByInviteCode(this.inviteCode).subscribe(
      (data: Lobby) => {
        this.lobby = data;
        if(this.lobby.active)
        {
          this.lobbyService.setUsername(this.username);
          this.addNewHunterToGroup(this.lobby._id);
        }
        else
        {
           window.alert('Error: Invalid Invite Code');
           this.inviteCode = '';
           this.username = '';
            this.lobbyService.setInviteCode(this.inviteCode);
        }
      },
      error => {
        console.error('Failed to retrieve open hunt by invite code', error);
      }
    )

    // if(this.lobby.active)
    // {
    //   this.lobbyService.setUsername(this.username);
    //   this.addNewHunterToGroup(this.lobby._id);
    //   this.router.navigate(['/hunt-lobby']);
    //   console.log("in if: " + this.inviteCode)
    // }
    // else
    // {
    //    window.alert('Error: Invalid Invite Code');
    //    this.inviteCode = '';
    //    this.username = '';
    //     this.lobbyService.setInviteCode(this.inviteCode);
    // }
  }

  // searchByInviteCode() {
  //   if (this.inviteCode) {
  //     this.lobbyService.searchByInviteCode(this.inviteCode).subscribe(
  //       (data: Lobby) => {
  //         this.lobby = data;
  //       },
  //       error => {
  //         console.error('Failed to retrieve open hunt by invite code', error);
  //       }
  //     );
  //   } else {
  //     console.error('Please enter a valid invite code.');
  //   }
  // }

  addNewHunterToGroup(huntId: string) {
    const newHunter: Partial<Hunter>  =
    { hunterName: this.username }; // Construct the hunter object

    this.lobbyService.addNewHunterByOpenHuntId(huntId, newHunter).subscribe({
      next: (responseGroupId) => {
        console.log('Hunter added to group with ID:', responseGroupId);
        this.router.navigate(['/hunt-lobby']);
        // Additional logic here, such as navigation or UI update
      },
      error: err => {
        console.error('Error adding new hunter:', err);
        // Error handling logic here
      }
    });
  }


  navigateToCreateTask(): void {
    // this.router.navigate(['../','task','new', this.taskHuntId], {relativeTo: this.route});
    this.router.navigate(['task','new', '65de46d19a719626538626bc']);
  }
}
