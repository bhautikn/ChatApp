import { Component } from '@angular/core';

@Component({
  selector: 'app-back-nevigation',
  templateUrl: './back-nevigation.component.html',
  styleUrl: './back-nevigation.component.css'
})
export class BackNevigationComponent {
  backNavigate(){
    window.history.back()
  }
}
