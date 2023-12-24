import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ChatApp';
  constructor(private _navigate:Router){}

  navigate(path:string, e:any){
    this._navigate.navigate([path]);
    if(path == '/'){
      e.target.style.background = '#295D56';
      let post:any = document.querySelector('#post');
      post.style.background = 'none';
    }
    else{
      e.target.style.background = '#295D56';
      let chat:any = document.querySelector('#chat');
      chat.style.background = 'none';
    }
  }
}
