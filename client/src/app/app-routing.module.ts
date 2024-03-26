import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HuntListComponent } from './hunts/hunt-list.component';
import { HuntProfileComponent } from './hunts/hunt-profile.component';
import { TaskListComponent } from './hunts/task-list.component';
import { HuntEditComponent } from './hunts/edit.component';
import { AddHuntComponent } from './hunts/add-hunt.component';
import { HuntLobbyComponent } from './hunts/hunt-lobby.component';
import { LoginComponent } from './login/login.component';



// Note that the 'hunts/new' route needs to come before 'hunts/:id'.
// If 'hunts/:id' came first, it would accidentally catch requests to
// 'hunts/new'; the router would just think that the string 'new' is a hunt ID.

const routes: Routes = [
  {path: '', component: HomeComponent, title: 'Home'},
  {path: 'hunts', component: HuntListComponent, title: 'My Hunts'},
  {path: 'hunts/edit/:id', component: HuntEditComponent, title: 'Edit Hunt'},
  {path: 'hunts/new', component: AddHuntComponent, title: 'New Hunt'},
  {path: 'hunts/:id', component: HuntProfileComponent, title: 'Hunt Profile'},
  {path: 'game/:id', component: HuntLobbyComponent, title: 'Hunt Lobby'},
  {path: 'tasks', component: TaskListComponent, title: 'Task List'},
  {path: 'tasks/new', component: TaskListComponent, title: 'New Task'},
  {path: '', component: HomeComponent},
  {path: 'add-hunt', component: AddHuntComponent },
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'hunt-list', component: HuntListComponent },
  {path: 'tasks/:id', component: TaskListComponent, title: 'Single Task'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
