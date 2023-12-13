import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './components/views/edit/edit.component';
import { ErrorComponent } from './components/views/error/error.component';
import { FeedComponent } from './components/views/feed/feed.component';
import { IndexComponent } from './components/views/index/index.component';
import { LoginComponent } from './components/views/login/login.component';
import { ProfileComponent } from './components/views/profile/profile.component';
import { SearchComponent } from './components/views/search/search.component';
import { UploadComponent } from './components/views/upload/upload.component';

const routes: Routes = [
  {path: '',  component: IndexComponent},
  {path: 'login', component:LoginComponent},
  {path: 'feed',  component:FeedComponent},
  {path: 'search', component:SearchComponent},
  {path: 'profile', component:ProfileComponent},
  {path: 'upload', component:UploadComponent},
  {path: 'edit', component:EditComponent},
  // {path: '**',component:ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
