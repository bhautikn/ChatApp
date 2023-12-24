import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ChattingSoketService {

  constructor(private _socket:Socket) { }

  send(massage:string) {
		this._socket.emit('chat', massage);
	} 

	// listen event
	onReceive() {
		return this._socket.fromEvent('recive');
	}
}
