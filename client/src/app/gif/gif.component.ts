import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { GifApiService } from '../services/gif-api.service';
import { debounce } from '../functions';

@Component({
  selector: 'app-gif',
  templateUrl: './gif.component.html',
  styleUrl: './gif.component.css'
})
export class GIFComponent {

  constructor(private _gif_api: GifApiService) { }

  @Output() onsendGif: EventEmitter<any> = new EventEmitter();
  gifs: any = [];
  potition: any = false;
  loading: boolean = true;
  searchGif = debounce(this.changeGifText, 500);

  ngOnInit() {
    this.loadGif();
  }
  loadGif() {
    this.loading = true;
    this._gif_api.getAll(this.potition).subscribe((res: any) => {
      this.potition = res.next;
      this.gifs = this.gifs.concat(res.results);
      this.loading = false;
    })
  }
  sendGif(url: any): void {
    this.onsendGif.emit(url);
  }
  changeGifText(self:any, e: any) {
    self._gif_api.getBySearch(e.target.value).subscribe((res: any) => {
      self.gifs = res.results;
    })
  }
}
