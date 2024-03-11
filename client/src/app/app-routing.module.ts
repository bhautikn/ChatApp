import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ChatSpaceComponent } from './chat/chat-space/chat-space.component';
import { AudioVisulizerComponent } from './chat/audio-visulizer/audio-visulizer.component';

const routes: Routes = [
  { path:'', component:ChatComponent },
  { path:'chat/:token', component:ChatSpaceComponent , data: { animation: 'fader' } },
  { path:'audio', component:AudioVisulizerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
