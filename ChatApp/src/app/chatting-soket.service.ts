import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ChattingSoketService {

  constructor(private _socket:Socket) { }

	//emit event
	send(massage:any, dataType:any ,auth:string) {
		this._socket.emit('massage', massage, dataType, auth);
	} 
	join(authToken:string){
		this._socket.emit('join', authToken);
	}
	sendStatus(status:any, token:any){
		this._socket.emit('status', status, token);
	}
	reqVideoCall(authToken:any, callback:Function){
		this._socket.emit('reqVideoCall', authToken, (res:any)=>{
			callback(res);
		})
	}
	streamVideo(token:any , data:any){
		this._socket.emit('streamVideo', token ,data);
	}
	// listen event
	onStreamVideo(){
		return this._socket.fromEvent('streamVideo')
	}
	status(){
		return this._socket.fromEvent('status')
	}
	onReceive() {
		return this._socket.fromEvent('recive');
	}
	onReqVideoCall(){
		return this._socket.fromEvent('reqVideoCall')
	}
}
