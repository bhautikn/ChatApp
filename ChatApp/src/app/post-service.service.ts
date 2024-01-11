import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PostApiService {
  url = environment.apiUrl;
  constructor(private _http: HttpClient) { }

  getAll(){
    return this._http.get(this.url + 'posts');
  }
  getById(id: any){
    return this._http.get(this.url+'post/'+id);
  }
  submitReport(data:any){
    return this._http.post(this.url+'report', data);
  }
  newPost(data: any) {
    return this._http.post(this.url + 'post/new',
      data,
      {
        reportProgress: true,
        observe: "events"
      });
  }
  addLike(_id:any){
    console.log(this.url+'/post/like/'+_id);
    return this._http.put(this.url+'post/like/'+_id, {}).subscribe();
  }
  addDisLike(_id:any){
    return this._http.put(this.url+'post/dislike/'+_id, {}).subscribe();
  }
  removeLike(_id:any){
    return this._http.put(this.url+'post/remove-like/'+_id, {}).subscribe();
  }
  removeDisLike(_id:any){
    return this._http.put(this.url+'post/remove-dislike/'+_id, {}).subscribe();
  }
}
