import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

declare var ss: any;

@Injectable({
	providedIn: 'root'
})
export class ChattingSoketService {

	constructor(private _socket: Socket) { }

	//emit event
	send(data: any, dataType: any, auth: string, msgId: any, callback1: any) {
		this._socket.emit('massage', { massage: data, dataType: dataType, token: auth, massageId: msgId }, callback1);
	}
	sendFile(auth: string, data: any, dataObj: any, [percentage, finished, final]: any) {
		// data = new Blob([data], { type: dataType })
		let stream = ss.createStream({
			allowHalfOpen: true
		});
		ss(this._socket).emit('file', stream, { token: auth, ...dataObj }, final);
		var blobStream = ss.createBlobReadStream(data);
		var size = 0;

		blobStream.on('data', function (chunk: any) {
			size += chunk.length;
			percentage(Math.floor(size / data.size * 100));
			if (Math.floor(size / data.size * 100) == 100) {
				// ss.closeStream()
				finished(true)
			}
		});

		blobStream.pipe(stream);
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
	reqAudioCall(authToken: any, callback: Function) {
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
	// onFileRecive(callback: any, callback2: any, callback3: any) {
	// 	ss(this._socket).on('massage', (stream: any, data: any, awk: any) => {
	// 		var blobs: any = [];
	// 		stream.on('data', (dataBit: any) => {
	// 			blobs.push(dataBit);
	// 			// callback2(dataBit)
	// 			// callback2(data, dataBit);
	// 		})
	// 		stream.on('end', (res:any) => {
	// 			console.log(blobs)
	// 			const blob = new Blob([blobs], { type: data.miamitype });
	// 			// console.log(data, res)
	// 			callback3(data, blob)
	// 			awk({ id: data.id, status: 'seen' });
	// 		})
	// 		callback(data);
	// 	})
	// }
	onCancleAudioCall() {
		return this._socket.fromEvent('cancleAudioCall');
	}
	onDisconnectVideoCall() {
		return this._socket.fromEvent('disconnectVideoCall');
	}
	onDisconnectAudioCall() {
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