import { Component, Input } from '@angular/core';
import { Hunt } from './hunt';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { HuntService } from './hunt.service';

@Component({
  selector: 'app-hunt-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatListModule, MatIconModule, RouterModule],
  templateUrl: './hunt-card.component.html',
  styleUrl: './hunt-card.component.scss'
})
export class HuntCardComponent {
  @Input() hunt: Hunt;
  @Input() simple?: boolean = false;
  @Input() editable: boolean = true;
  math = Math;

  constructor(private router: Router, private huntService: HuntService) { }

  onCardClick() {
    this.router.navigate(['/hunts', this.hunt._id]);
  }

  onPlayClick(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/play-hunt', this.hunt._id]);
  }
  // onPlayClick(event: Event) {
  //   event.stopPropagation();
  //   // Navigate to play hunt
  // }

  onEditClick(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/hunts/edit', this.hunt._id]);
  }

  onInspectClick(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/hunts', this.hunt._id]);
  }

  onDeleteClick(event: Event) {
    event.stopPropagation();
    // Confirm deletion
    if (window.confirm('Are you sure you want to delete this hunt?')) {
      // Delete hunt
      this.huntService.deleteHunt(this.hunt._id).subscribe(() => {
        this.router.navigate(['/hunts']);
      });
    }
  }

}
