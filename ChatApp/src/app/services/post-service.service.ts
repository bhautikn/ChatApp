import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PostApiService {
  url = environment.apiUrl + 'post/';
  constructor(private _http: HttpClient) { }

  getAll() {
    return this._http.get(this.url);
  }
  getLimitedPost(from: number, to: number) {
    return this._http.get(this.url + from + '/' + to);
  }
  getLimitedComment(from: number, to: number, id: any) {
    return this._http.get(this.url + 'comment/' + id + '/' + from + '/' + to);
  }
  getById(id: any) {
    return this._http.get(this.url + id);
  }
  // getComments(id: any) {
  //   return this._http.get(this.url + 'comment/' + id);
  // }
  submitReport(data: any) {
    return this._http.post(this.url + 'report', data);
  }
  newPost(data: any) {
    return this._http.post(this.url,
      data,
      {
        reportProgress: true,
        observe: "events"
      });
  }
  postComment(data: any) {
    return this._http.post(this.url + 'comment/', data);
  }
  searchPost(data: any) {
    return this._http.get(this.url + 'search/' + data.text);
  }
  addLike(_id: any) {
    return this._http.put(this.url + 'like/' + _id, {}).subscribe();
  }
  addDisLike(_id: any) {
    return this._http.put(this.url + 'dislike/' + _id, {}).subscribe();
  }
  addView(_id: any) {
    return this._http.put(this.url+'view/'+_id, {}).subscribe();
  }
  removeLike(_id: any) {
    return this._http.delete(this.url + 'like/' + _id, {}).subscribe();
  }
  removeDisLike(_id: any) {
    return this._http.delete(this.url + 'dislike/' + _id, {}).subscribe();
  }
  addCommentDisLike(_id: any) {
    return this._http.put(this.url + 'comment/like/' + _id, {}).subscribe()
  }
  removeCommentDisLike(_id: any) {
    return this._http.delete(this.url + 'comment/like/' + _id, {}).subscribe()
  }

  newLive(data:any){
    return this._http.post(this.url+'live/new', data);
  }
}
