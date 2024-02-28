import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { PostComponent } from './post/post.component';
import { ChatSpaceComponent } from './chat/chat-space/chat-space.component';
import { AddComponent } from './post/add/add.component';
import { PostByIdComponent } from './post/post-by-id/post-by-id.component';
import { SearchComponent } from './post/search/search.component';
import { LiveComponent } from './post/live/live.component';
import { UploadComponent } from './post/live/upload/upload.component';
import { AudioVisulizerComponent } from './chat/audio-visulizer/audio-visulizer.component';

const routes: Routes = [
  { path:'', component:ChatComponent },
  { path:'chat/:token', component:ChatSpaceComponent , data: { animation: 'fader' } },
  { path:'post', component:PostComponent },
  { path:'audio', component:AudioVisulizerComponent },
  { path:'post/add', component:AddComponent },
  { path:'post/live/upload', component:UploadComponent },
  { path:'post/search/:text', component:SearchComponent },
  { path:'post/live', component:LiveComponent},
  { path:'post/:id', component:PostByIdComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
