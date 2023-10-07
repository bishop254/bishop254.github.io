import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvFormComponent } from './components/inv-form/inv-form.component';
import { StudRegComponent } from './components/stud-reg/stud-reg.component';

const routes: Routes = [
  {
    path: '',
    component: InvFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
