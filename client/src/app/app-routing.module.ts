import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HuntListComponent } from './hunts/hunt-list.component';
import { HuntProfileComponent } from './hunts/hunt-profile.component';
import { TaskListComponent } from './hunts/task-list.component';

// Note that the 'hunts/new' route needs to come before 'hunts/:id'.
// If 'hunts/:id' came first, it would accidentally catch requests to
// 'hunts/new'; the router would just think that the string 'new' is a hunt ID.

const routes: Routes = [
  {path: '', component: HomeComponent, title: 'Home'},
  {path: 'hunts', component: HuntListComponent, title: 'My Hunts'},
  {path: 'hunts/:id', component: HuntProfileComponent, title: 'Hunt Profile'},
  {path: 'tasks', component: TaskListComponent, title: 'Task List'},
  {path: 'tasks/:id', component: TaskListComponent, title: 'Single Task'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
