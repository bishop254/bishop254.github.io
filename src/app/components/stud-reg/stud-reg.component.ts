import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { HttpServService } from 'src/app/services/http-serv.service';

@Component({
  selector: 'app-stud-reg',
  templateUrl: './stud-reg.component.html',
  styleUrls: ['./stud-reg.component.scss'],
})
export class StudRegComponent {
  wardData: any[] = [
    {
      constituency: 'Rongo',
      wards: [
        'North Kamagambo',
        'Central Kamagambo',
        'East Kamagambo',
        'South Kamagambo',
      ],
    },
    {
      constituency: 'Awendo',
      wards: ['North East Sakwa', 'South Sakwa', 'West Sakwa', 'Central Sakwa'],
    },
    {
      constituency: 'Suna East',
      wards: ['God Jope', 'Suna Central', 'Kakrao', 'Kwa'],
    },
    {
      constituency: 'Suna West',
      wards: ['Wiga', 'Wasweta II', 'Ragan-Oruba', 'Wasimbete'],
    },
    {
      constituency: 'Uriri',
      wards: [
        'West Kanyamkago',
        'North Kanyamkago',
        'Central Kanyamkago',
        'South Kanyamkago',
        'East Kanyamkago',
      ],
    },
    {
      constituency: 'Kuria East',
      wards: [
        'Gokeharaka/Getamwega',
        'Ntimaru West',
        'Ntimaru East',
        'Nyabasi East',
        'Nyabasi West',
      ],
    },
    {
      constituency: 'Nyatike',
      wards: [
        'Kachieng’',
        'Kanyasa',
        'North Kadem',
        'Macalder/Kanyarwanda',
        'Kaler',
        'Got Kachola',
        'Muhuru',
      ],
    },
    {
      constituency: 'Kuria West',
      wards: [
        'Bukira East',
        'Bukira Central/Ikerege',
        'Isibania',
        'Makerero',
        'Masaba',
        'Tagare',
        'Nyamosense/Komosoko',
      ],
    },
  ];

  myDetailsForm = this._formBuilder.group({
    full_name: ['', Validators.required],
    gender: ['', Validators.required],
    dob: ['', Validators.required],
    disabled: [false, Validators.required],
    which_disability: [''],
    phone: ['', [Validators.required]],
    school: ['', Validators.required],
    adm_no: ['', Validators.required],
    year_of_study: ['', Validators.required],
    completion_date: ['', Validators.required],
  });

  invoiceDetails = this._formBuilder.group({
    benefitting_other_fund: [false, Validators.required],
    other_fund_name: [''],
    other_fund_year: [[]],
    other_fund_amount: [[]],
  });

  locationDetails = this._formBuilder.group({
    constituency: [false, Validators.required],
    ward: [''],
    village: [[]],
    other_fund_amount: [[]],
  });

  paymentsForm = this._formBuilder.group({
    parent_state: ['', Validators.required],
    orphan_state: ['', Validators.required],
    grand_parent_care_state: ['', Validators.required],
    siblings_in_education_details_name: ['[]'],
    siblings_in_education_details_institution: ['[]'],
    siblings_in_education_details_year: [[]],
    siblings_in_education_details_total: [[]],
    siblings_in_education_details_paid: [[]],
    father_guardian_name: [''],
    father_guardian_occupation: [''],
    father_guardian_phone: [0],
    mother_guardian_name: [''],
    mother_guardian_occupation: [''],
    mother_guardian_phone: [0],
    parent_guardian_disabled: ['N', Validators.required],
  });

  itemsForm = this._formBuilder.group({
    school_bank_name: ['', Validators.required],
    school_bank_account_no: ['', Validators.required],
    school_bank_code: [''],
    school_bank_branch: [''],
    fee_balance: ['', Validators.required],
  });

  isLinear = false;
  constructor(
    private _formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private httpServ: HttpServService
  ) {}

  addItem() {
    // Display a success message
    this.snackBar.open('Item Added', 'Success', { duration: 2000 });
  }

  submit() {
    console.log();
    console.log(this.invoiceDetails.value);
    console.log(this.paymentsForm.value);
    console.log(this.itemsForm.value);
    let model = {
      ...this.myDetailsForm.value,
      ...this.invoiceDetails.value,
      ...this.paymentsForm.value,
      ...this.itemsForm.value,
    };

    this.httpServ.postReq('', model).subscribe((resp: any) => {
      console.log(resp);

      this.myDetailsForm.reset();
      this.invoiceDetails.reset();
      this.paymentsForm.reset();
      this.itemsForm.reset();

      this.snackBar.open('Details sent successfully', 'success', {
        duration: 4000,
      });
    });
  }

  randomString(length: number) {
    var randomChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    var result = '';

    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }

    return result;
  }
}
