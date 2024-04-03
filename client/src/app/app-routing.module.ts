import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HuntListComponent } from './hunts/hunt-list.component';
import { HuntProfileComponent } from './hunts/hunt-profile.component';
import { TaskListComponent } from './hunts/task-list.component';
import { HuntEditComponent } from './hunts/edit.component';
import { AddHuntComponent } from './hunts/add-hunt.component';
import { OpenHuntComponent } from './open-hunts/open-hunt.component';
import { NewOpenHuntComponent } from './open-hunts/new-open-hunt.component';

// Note that the 'hunts/new' route needs to come before 'hunts/:id'.
// If 'hunts/:id' came first, it would accidentally catch requests to
// 'hunts/new'; the router would just think that the string 'new' is a hunt ID.

const routes: Routes = [
  {path: '', component: HomeComponent, title: 'Home'},
  {path: 'hunts', component: HuntListComponent, title: 'My Hunts'},
  {path: 'hunts/edit/:id', component: HuntEditComponent, title: 'Edit Hunt'},
  {path: 'hunts/new', component: AddHuntComponent, title: 'New Hunt'},
  {path: 'hunts/:id', component: HuntProfileComponent, title: 'Hunt Profile'},
  {path: 'tasks', component: TaskListComponent, title: 'Task List'},
  {path: 'tasks/new', component: TaskListComponent, title: 'New Task'},
  {path: 'tasks/:id', component: TaskListComponent, title: 'Single Task'},
  {path: 'openhunts/new/:id', component: NewOpenHuntComponent, title: 'Hunt'}, // id for coresponing hunt, not openhunt id.
  {path: 'openhunts/:id', component: OpenHuntComponent, title: 'Hunt'} // openhunt id.

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
