import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
	providedIn: 'root'
})
export class ChattingSoketService {

	constructor(private _socket: Socket) { }

	//emit event
	send(massage: any, dataType: any, auth: string, id: any, callback: any) {
		this._socket.emit('massage', { massage: massage, dataType: dataType, token: auth, massageId: id }, callback);
	}
	join(authToken: string) {
		this._socket.emit('join', authToken);
	}
	sendStatus(status: any, token: any) {
		this._socket.emit('status', status, token);
	}
	reqVideoCall(authToken: any, callback: Function) {
		this._socket.emit('reqVideoCall', authToken, (res: any) => {
			callback(res);
		})
	}
	reqAudioCall(authToken: any, callback: Function){
		this._socket.emit('reqAudioCall', authToken, (res: any) => {
			callback(res);
		})
	}
	sendPeerConnectionId(token: any, peerToken: any) {
		this._socket.emit('sendPeerConnectionId', token, peerToken)
	}
	disconnectVideoCall(token: any) {
		this._socket.emit('disconnectVideoCall', token);
	}
	disconnectAudioCall(token: any) {
		this._socket.emit('disconnectAudioCall', token);
	
	}
	cancleVideoCall(token: any) {
		this._socket.emit('cancleVideoCall', token);
	}
	cancleAudioCall(token: any) {
		this._socket.emit('cancleAudioCall', token);
	}
	// listen event
	onCancleVideoCall() {
		return this._socket.fromEvent('cancleVideoCall');
	}
	onCancleAudioCall() {
		return this._socket.fromEvent('cancleAudioCall');
	}
	onDisconnectVideoCall() {
		return this._socket.fromEvent('disconnectVideoCall');
	}
	onDisconnectAudioCall(){
		return this._socket.fromEvent('disconnectAudioCall');
	}

	onPeerConnectionId() {
		return this._socket.fromEvent('sendPeerConnectionId');
	}
	status() {
		return this._socket.fromEvent('status')
	}
	onReceive(callback: any) {
		return this._socket.on('recive', callback);
	}
	onReqVideoCall() {
		return this._socket.fromEvent('reqVideoCall')
	}
	onReqAudioCall() {
		return this._socket.fromEvent('reqAudioCall')
	}

	// disconnect socket connection
	disconnect() {
		this._socket.disconnect();
	}
	connect() {
		this._socket.connect();
	}
}
