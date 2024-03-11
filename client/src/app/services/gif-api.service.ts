import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class GifApiService {
  url = environment.gif_api;

  constructor(private _http:HttpClient) { }

  getAll(){
    return this._http.get(this.url+'trending?key='+environment.gif_api_key+'&limit=20');
  }
  getBySearch(searchText:string){
    return this._http.get(this.url+'search?q='+searchText+'&key='+environment.gif_api_key+'&limit=20')
  }
  getById(id:string){
    return this._http.get(this.url+'gifs?ids='+id+'&key='+environment.gif_api_key);
  }
}
