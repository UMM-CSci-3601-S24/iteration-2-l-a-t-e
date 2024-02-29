import { Component, Input } from "@angular/core";
import { Hunt } from "./hunt";


@Component({
  selector: 'app-hunt-group',
  templateUrl: './hunt-group.component.html',
})

export class HuntGroupComponent {
  @Input() host: string;
  @Input() hunts: Hunt[];
  @Input() editable: boolean ;

}
