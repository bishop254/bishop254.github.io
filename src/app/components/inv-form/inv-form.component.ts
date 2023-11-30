import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Observable, map } from 'rxjs';
import { HttpServService } from 'src/app/services/http-serv.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PreviewApplComponent } from '../preview-appl/preview-appl.component';
import { FinalComponent } from '../final/final.component';
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
    dob: ['', Validators.required],
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
    studId: ['', [Validators.required]],
    studBirthCert: ['', [Validators.required]],
    parentDeathCert: [''],
    transcripts: ['', [Validators.required]],
    admLett: ['', [Validators.required]],
    leavCert: ['', [Validators.required]],
    feeStruct: ['', [Validators.required]],
  });

  isLinear = false;
  srcResult: any;

  declFormFile: any;
  parentIdsFile: any;
  studIdFile: any;
  studBirthCertFile: any;
  parentDeathCertFile: any = null;
  reportFormTransFile: any;
  resultSlipFile: any;
  admLetterFile: any;
  schLeavingCertFile: any;
  feeStructFile: any;

  constructor(
    private _formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver,
    private httpServ: HttpServService,
    private router: Router,
    public dialog: MatDialog
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

  submit() {
    let dob: any = this.basicDetailsForm.controls.dob.value;
    const formattedDate = this.formatDateToYYYYMMDD(dob);
    let model = {
      ...this.basicDetailsForm.value,
      ...this.locationDetailsForm.value,
      ...this.familyDetailsForm.value,
      ...this.sponsorDetailsForm.value,
      ...this.instDetailsForm.value,
      dob: formattedDate,
      pollingStation: this.locationDetailsForm.value.village,
    };

    const formData = new FormData();
    formData.append('declForm', this.declFormFile);
    formData.append('parentIds', this.parentIdsFile);
    formData.append('studId', this.studIdFile);
    formData.append('studBirthCert', this.studBirthCertFile);
    formData.append('admLett', this.admLetterFile);
    formData.append('parentDeathCert', this.parentDeathCertFile);
    formData.append('leavCert', this.schLeavingCertFile);
    formData.append('feeStruct', this.feeStructFile);
    formData.append('transcripts', this.reportFormTransFile);

    formData.append('payload', JSON.stringify(model));

    this.httpServ.postReq('', formData).subscribe({
      next: (resp: any) => {
        if (resp['statusCode'] === 201) {
          this.snackBar.open(resp['message'], 'success', {
            duration: 5000,
          });
          this.basicDetailsForm.reset();
          this.locationDetailsForm.reset();
          this.familyDetailsForm.reset();
          this.sponsorDetailsForm.reset();
          this.instDetailsForm.reset();
          this.uploadDetailsForm.reset();

          const dialogRef = this.dialog.open(FinalComponent, {
            data: resp['data']['studentData'],
            width: '85%',
          });

          dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
          });
        }
      },
      error: (err) => {
        console.error(err);
        console.error(err);
      },
    });
  }

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

  onFileSelected(event: Event, fileName: string): void {
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

    switch (fileName) {
      case 'declFormFile':
        this.declFormFile = inputNode.files[0];
        break;

      case 'parentIdsFile':
        this.parentIdsFile = inputNode.files[0];
        break;

      case 'studIdFile':
        this.studIdFile = inputNode.files[0];
        break;

      case 'studBirthCertFile':
        this.studBirthCertFile = inputNode.files[0];
        break;

      case 'parentDeathCertFile':
        this.parentDeathCertFile = inputNode.files[0];
        break;

      case 'reportFormTransFile':
        this.reportFormTransFile = inputNode.files[0];
        break;

      case 'admLetterFile':
        this.admLetterFile = inputNode.files[0];
        break;

      case 'schLeavingCertFile':
        this.schLeavingCertFile = inputNode.files[0];
        break;

      case 'feeStructFile':
        this.feeStructFile = inputNode.files[0];
        break;

      default:
        break;
    }
  }

  formatDateToYYYYMMDD(inputDate: any) {
    const parsedDate: any = new Date(inputDate);

    if (isNaN(parsedDate)) {
      return 'Invalid Date'; // Return an error message if the input date is invalid.
    }

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based.
    const day = String(parsedDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  openDialog(): void {
    let model = {
      ...this.basicDetailsForm.value,
      ...this.locationDetailsForm.value,
      ...this.familyDetailsForm.value,
      ...this.sponsorDetailsForm.value,
      ...this.instDetailsForm.value,
      pollingStation: this.locationDetailsForm.value.village,
      // ...this.uploadDetailsForm.value,
    };
    const dialogRef = this.dialog.open(PreviewApplComponent, {
      data: { ...model },
      width: '55%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
