import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  basicDetailsForm = this._formBuilder.group({
    type: ['', Validators.required],

    education: ['', Validators.required],
  });
  constructor(
    private _formBuilder: FormBuilder // private snackBar: MatSnackBar, // private breakpointObserver: BreakpointObserver, // private httpServ: HttpServService
  ) {}
}
