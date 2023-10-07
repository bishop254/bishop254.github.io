import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Observable, map } from 'rxjs';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-inv-form',
  templateUrl: './inv-form.component.html',
  styleUrls: ['./inv-form.component.scss'],
  standalone: false,
})
export class InvFormComponent implements OnInit {
  migoriConstData: any[] = [
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

  basicDetailsForm = this._formBuilder.group({
    name: ['', Validators.required],
    gender: ['', Validators.required],
    age: [0, Validators.required],
    formYear: ['', Validators.required],
    phone: [0, Validators.required],
    course: ['', Validators.required],
    other: [''],
  });

  locationDetailsForm = this._formBuilder.group({
    constituency: ['', Validators.required],
    ward: ['', Validators.required],
    village: ['', Validators.required],
  });
  selectedWards: any[] = [];

  familyDetailsForm = this._formBuilder.group({
    fatherName: [''],
    fatherOccupation: [''],
    fatherPhone: [''],
    fatherAlive: ['', [Validators.required]],
    motherName: [''],
    motherOccupation: [''],
    motherPhone: [''],
    motherAlive: ['', [Validators.required]],
    village: [''],
    pollingStation: [''],
  });

  sponsorDetailsForm = this._formBuilder.group({
    siblingsNum: [0, [Validators.required]],
    sponsorName: [''],
    sponsorOccupation: [''],
    sponsorPhone: [''],
    sponsorRelationship: [''],
    sponsorChildrenNum: [0],
    sponsorChildrenWorking: [0],
    sponsorChildrenSecond: [0],
    sponsorChildrenPostSecond: [0],
  });

  instDetailsForm = this._formBuilder.group({
    instName: ['', [Validators.required]],
    instBank: ['', [Validators.required]],
    instBranch: ['', [Validators.required]],
    instAccNo: [0, [Validators.required]],
  });

  uploadDetailsForm = this._formBuilder.group({
    declForm: ['', [Validators.required]],
    parentIds: ['', [Validators.required]],
  });

  isLinear = false;
  srcResult: any;
  constructor(
    private _formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {}

  isSmallScreen$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Small, Breakpoints.XSmall]) // Define the breakpoints you want to observe
    .pipe(
      map((result) => {
        let persContForm = document.getElementById('persContForm');
        persContForm?.classList.remove('itemCont');
        persContForm?.classList.add('itemContSmall');

        return result.matches;
      })
    );

  submit() {}

  filterWards() {
    let selectedConsit =
      this.locationDetailsForm.controls['constituency'].value;

    this.selectedWards = [...this.migoriConstData].filter(
      (item: any) => item['constituency'] == selectedConsit
    )[0]['wards'];

    console.log(this.selectedWards);
  }

  fatherInfoRequired() {
    if (this.familyDetailsForm.value['fatherAlive'] === 'na') {
      this.familyDetailsForm.controls['fatherName'].disable();
      this.familyDetailsForm.controls['fatherOccupation'].disable();
      this.familyDetailsForm.controls['fatherPhone'].disable();
    } else {
      this.familyDetailsForm.controls['fatherName'].enable();
      this.familyDetailsForm.controls['fatherOccupation'].enable();
      this.familyDetailsForm.controls['fatherPhone'].enable();
    }
  }

  motherInfoRequired() {
    if (this.familyDetailsForm.value['motherAlive'] === 'na') {
      this.familyDetailsForm.controls['motherName'].disable();
      this.familyDetailsForm.controls['motherOccupation'].disable();
      this.familyDetailsForm.controls['motherPhone'].disable();

      this.familyDetailsForm.controls['motherName'].removeValidators([
        Validators.required,
      ]);
      this.familyDetailsForm.controls['motherOccupation'].removeValidators([
        Validators.required,
      ]);
      this.familyDetailsForm.controls['motherPhone'].removeValidators([
        Validators.required,
      ]);
    } else {
      this.familyDetailsForm.controls['motherName'].enable();
      this.familyDetailsForm.controls['motherOccupation'].enable();
      this.familyDetailsForm.controls['motherPhone'].enable();
      this.familyDetailsForm.controls['motherName'].addValidators([
        Validators.required,
      ]);
      this.familyDetailsForm.controls['motherOccupation'].addValidators([
        Validators.required,
      ]);
      this.familyDetailsForm.controls['motherPhone'].addValidators([
        Validators.required,
      ]);
    }
    this.familyDetailsForm.controls['motherName'].updateValueAndValidity();
    this.familyDetailsForm.controls[
      'motherOccupation'
    ].updateValueAndValidity();
    this.familyDetailsForm.controls['motherPhone'].updateValueAndValidity();
  }

  onFileSelected(event: Event): void {
    const inputNode: any = event.target;

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.srcResult = e.target.result;
      };

      reader.readAsArrayBuffer(inputNode.files[0]);
    }

    console.log(this.srcResult, inputNode.files[0]);
    console.log('this.uploadDetailsForm.value');
    console.log(this.uploadDetailsForm.value);
    
  }
}
