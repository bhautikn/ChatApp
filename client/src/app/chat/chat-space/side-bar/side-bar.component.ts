import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { getAllChats } from '../../../reducer/chat.selector';
import { resetresetUnreadToZero } from '../../../reducer/chat.action';
import { debounce } from '../../../functions';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  constructor(
    private _route: ActivatedRoute,
    private _nevigate: Router,
    private store: Store,
  ) { }
  // @Input() showtitle: boolean = true;
  @Input() selection: boolean = false;
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @Output() onreload: EventEmitter<any> = new EventEmitter();

  isChangingName: boolean = false;
  urlToken: any = this._route.snapshot.params['token'];
  chats: any = [];
  dropWater: any = new Audio('../assets/sounds/water_drop.mp3');
  selectedObj: any = {};
  searching: boolean = false;
  searchArray: any = [];
  searchChatsD = debounce(this.searchChats, 300);

  ngOnInit(): void {
    this.store.select(getAllChats).subscribe((data: any) => {
      this.chats = data.chat;
    })
    // setTimeout(()=>{
    // }, 50)
    // if (this.chats.length == 0) {
    //   this._nevigate.navigate(['/']);
    // };
  }
  redirect(to: string) {
    this._nevigate.navigate([to]);
    this.store.dispatch(resetresetUnreadToZero({ token: this.urlToken }))
    this.urlToken = to.split('/')[2];
    this.store.dispatch(resetresetUnreadToZero({ token: this.urlToken }))
    this.onreload.emit(to);
  }
  handleChange(index: number, event: any) {
    if (event.keyCode == 13) {
      this.changeParticipentName(index, event);
    }
  }
  changeParticipentName(index: number, event: any) {
    this.isChangingName = false
  }
  handleClick(token: any, i: any) {
    if (this.selection) {
      if (this.selectedObj[token]) {
        delete this.selectedObj[token];
      } else {
        this.selectedObj[token] = true;
      }
      this.onSelect.emit(this.selectedObj);
    } else {
      this.redirect('/chat/' + token);
    }
  }
  isKeyInObject(key: any) {
    return key in this.selectedObj;
  }
  searchChats(self:any, e: any) {
    if (e.target.value == '') {
      self.searching = false;
    } else {
      self.searching = true;
    }
    self.searchArray = self.chats.filter((chat: any) => {
      return chat.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
  }
}