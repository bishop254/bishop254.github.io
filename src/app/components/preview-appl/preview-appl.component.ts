import { Component, Inject, Input } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-preview-appl',
  templateUrl: './preview-appl.component.html',
  styleUrls: ['./preview-appl.component.scss'],
})
export class PreviewApplComponent {
  constructor(
    public dialogRef: MatDialogRef<PreviewApplComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
