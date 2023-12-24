import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ChattingSoketService {

  constructor(private _socket:Socket) { }

	//emit event
	send(massage:string, auth:any) {
		this._socket.emit('massage', massage, auth);
	} 
	join(authToken:string){
		this._socket.emit('join', authToken);
	}
	sendStatus(status:any){
		this._socket.emit('status', status);
	}
	// listen event
	status(){
		return this._socket.fromEvent('status')
	}
	onReceive() {
		return this._socket.fromEvent('recive');
	}
}
