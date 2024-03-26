import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [],
  standalone: true,
  imports: [MatCardModule]
})
export class LoginComponent {
  constructor(private router: Router) { }

sendToHost() {
  this.router.navigate(['/hunt-list']);
}

}
