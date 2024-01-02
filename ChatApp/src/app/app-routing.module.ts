import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { PostComponent } from './post/post.component';
import { ChatSpaceComponent } from './chat-space/chat-space.component';
import { AddComponent } from './post/add/add.component';
import { PostByIdComponent } from './post/post-by-id/post-by-id.component';

const routes: Routes = [
  { path:'', component:ChatComponent },
  { path:'post', component:PostComponent },
  { path:'post/add', component:AddComponent },
  { path:'post/:id', component:PostByIdComponent },
  { path:'chat/:token', component:ChatSpaceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
