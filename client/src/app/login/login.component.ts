import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { HuntService } from '../hunts/hunt.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [],
  standalone: true,
  imports: [MatCardModule, FormsModule, CommonModule]
})
export class LoginComponent {
  username: string;
  password: string;
  constructor(private router: Router, private huntService: HuntService) {

   }

sendToHost() {
  this.huntService.setUsername(this.username);
  this.huntService.setPassword(this.password);
  console.log('Username: ' + this.huntService.getUsername());
  console.log('Password: ' + this.huntService.getPassword());
  this.router.navigate(['/hunt-list']);
}

}
