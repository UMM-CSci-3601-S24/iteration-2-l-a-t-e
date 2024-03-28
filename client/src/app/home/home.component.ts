import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { LobbyService } from '../hunts/lobby.service';
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
  constructor(private router: Router, private lobbyService: LobbyService) { }
  showHunterInput: boolean = false;


  hostLogin() {
    this.router.navigate(['/login']); // Navigate to the 'add-hunt' route
  }

  showHunterForm() {
    this.showHunterInput = !this.showHunterInput; // Set the flag to the opposite
  }

  submitHunterForm() {

  }

  submitCode() {
    this.lobbyService.setUsername(this.username);
    this.router.navigate(['/hunt-lobby']);
  }

  // navigateToCreateTask(): void {
  //   // this.router.navigate(['../','task','new', this.taskHuntId], {relativeTo: this.route});
  //   this.router.navigate(['task','new', '65de46d19a719626538626bc']);
  // }
}
