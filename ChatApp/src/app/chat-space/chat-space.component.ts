import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-space',
  templateUrl: './chat-space.component.html',
  styleUrl: './chat-space.component.css'
})
export class ChatSpaceComponent {
  name = 'Your Freind';
  online:boolean = true;
  status = this.online?'online':'offline';
  statusColor = 'grey';

  input(e:any){
    { // block for auto height
      e.target.style.height = 0;
      let max = 100;
      let height = e.target.scrollHeight;
      if(height < max){
        e.target.style.height = (e.target.scrollHeight)+ "px";
      }else{
        e.target.style.height = (100)+ "px";
      }
    }
    if(e.keyCode == 13){
      this.addTo(e.target.value, new Date().toString())
    }
  }
  addTo(text:string, time:string){
    
  }
  addFrom(text:string, time:string){

  }
}
