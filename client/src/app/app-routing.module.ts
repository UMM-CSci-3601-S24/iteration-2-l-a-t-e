import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { HuntListComponent } from './hunts/hunt-list.component';
import { HuntProfileComponent } from './hunts/hunt-profile.component';
import { TaskListComponent } from './hunts/task-list.component';

// Note that the 'users/new' route needs to come before 'users/:id'.
// If 'users/:id' came first, it would accidentally catch requests to
// 'users/new'; the router would just think that the string 'new' is a user ID.
const routes: Routes = [
  {path: '', component: HomeComponent, title: 'Home'},
  {path: 'companies', component: CompanyListComponent, title: 'Companies'},
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
