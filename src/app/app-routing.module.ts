import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvFormComponent } from './components/inv-form/inv-form.component';
import { LandingComponent } from './components/landing/landing.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'apply',
    component: InvFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
