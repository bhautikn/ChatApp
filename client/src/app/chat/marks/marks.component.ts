import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-marks',
  templateUrl: './marks.component.html',
  styleUrl: './marks.component.css'
})
export class MarksComponent {
  @Input() status: any;
}
