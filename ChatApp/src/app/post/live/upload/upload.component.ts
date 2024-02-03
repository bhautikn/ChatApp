import { Component } from '@angular/core';
import { PostApiService } from '../../../services/post-service.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  constructor(private _api: PostApiService) { }

  liveVideoToken:any = '';
  videoId: string = '';
  progress: number = 0;
  formData: FormData = new FormData();
  isDone: boolean = false;
  isFaild: boolean = false;
  data: Form = new Form()
  isLive:boolean = false;

  submitForm() {
    this.formData.append('name', this.data.name as string);
    this.formData.append('title', this.data.title as string);
    this.formData.append('description', this.data.description as string);
    this.formData.append('tags', this.data.tags as string);
    this.progress = 1;

    this._api.newLive(this.formData).subscribe((res: any) => {
      if (res.status == 200) {
        this.liveVideoToken = res.token;
        console.log(this.liveVideoToken);
        this.clearForm();
        this.isLive = true;
        navigator.mediaDevices.getUserMedia({
          audio:true,
          video:true
        }).then((stream)=>{
          let liveVideo:any = document.querySelector('#live-video');
          liveVideo.srcObject = stream;
          this.handelStream(stream);
        })
      }
      else {
        if (res.type == HttpEventType.UploadProgress)
          this.progress = Math.round((100 / res.total) * res.loaded);
        if (this.progress == 100) {
          setTimeout(() => {
            if (res.body)
              this.videoId = res.body.id
            this.progress = 0;
            this.isDone = true;
            this.isFaild = false;
          }, 500)
        }
      }
    })
  }

  clearForm() {
    this.data = new Form();
    this.formData = new FormData()
  }
  handelStream(stream:any){
    console.log(stream);  
  }
}
class Form {
  name: String;
  title: String;
  description: String;
  tags: String;

  constructor() {
    this.name = 'Anonymouse';
    this.title = '';
    this.description = '';
    this.tags = '';
  }
}
