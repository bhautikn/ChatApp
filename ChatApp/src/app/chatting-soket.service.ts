import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ChattingSoketService {

  constructor(private _socket:Socket) { }

	//emit event
	auth(token:String, password:string){
		this._socket.emit('authaticate', token, password);
	}
	send(massage:string, id:any) {
		this._socket.emit('massage', massage, id);
	} 
	onId(){
		return this._socket.fromEvent('id');
	}
	// listen event
	onReceive() {
		return this._socket.fromEvent('recive');
	}
}
