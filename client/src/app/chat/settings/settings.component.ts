import { Component, EventEmitter, Input, Output } from '@angular/core';
import { toggleThemeDark, toggleThemeLight } from '../../themeProvider';
import { Store } from '@ngrx/store';
import { changeHistorySatting } from '../../reducer/chat.action';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  constructor(private store: Store) { }

  @Input() urlToken: any;
  @Input() history: any;
  @Output() onclose: EventEmitter<any> = new EventEmitter();
  isSound: any = (localStorage.getItem('sound') == 'true');

  theme: any = localStorage.getItem('theme');
  
  closeSettings() {
    this.onclose.emit(this.isSound);
  }

  //theme change handler
  toggleTheme() {
    if (this.theme == 'dark') {
      toggleThemeLight();
      this.theme = 'light';
    }
    else {
      toggleThemeDark();
      this.theme = 'dark';
    }
  }

  toggleSound(){
    this.isSound = !this.isSound;
    localStorage.setItem('sound', this.isSound.toString());
  }

  chnageHistorySetting() {
    this.history = !this.history;
    this.store.dispatch(changeHistorySatting({ token: this.urlToken, setting: this.history }));
  }
}
