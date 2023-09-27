import { Component, inject } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-inv-form',
  templateUrl: './inv-form.component.html',
  styleUrls: ['./inv-form.component.scss'],
  standalone: false,
})
export class InvFormComponent {
  myDetailsForm = this._formBuilder.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    phoneNumber: [
      '',
      [Validators.required, Validators.pattern(/^(07\d{8}|01\d{8})$/)],
    ],
    email: ['', [Validators.required, Validators.email]],
  });

  buyerForm = this._formBuilder.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    phoneNumber: [
      '',
      [Validators.required, Validators.pattern(/^(07\d{8}|01\d{8})$/)],
    ],
    email: ['', [Validators.required, Validators.email]],
  });

  invoiceDetails = this._formBuilder.group({
    invoiceDate: ['', Validators.required],
    dueDate: ['', Validators.required],
  });

  paymentsForm = this._formBuilder.group({
    tax: [0, [Validators.required, Validators.max(99), Validators.min(1)]],
    fee: [0, [Validators.min(1)]],
    discount: [0, [Validators.min(1)]],
  });

  // itemsArray: Record<string, string | number>[] = [];
  itemsArray: any[] = [];

  itemsForm = this._formBuilder.group({
    itemName: [''],
    itemPrice: [1, [Validators.min(1)]],
    itemQuantity: [1, [Validators.min(1)]],
  });

  isLinear = true;
  constructor(
    private _formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  addItem() {
    // Get the form values
    const { itemName, itemPrice, itemQuantity } = this.itemsForm.value;

    // Convert item name to lowercase for case-insensitive comparison
    const itemNameLower = itemName?.toLowerCase() || '';

    // Check if the item name is empty
    if (!itemNameLower.trim()) {
      this.snackBar.open('Cannot add an item with an empty name', 'Warning', {
        duration: 2000,
      });
      return;
    }

    // Check if an item with the same name already exists
    const existingItem = this.itemsArray.find(
      (item) => (item['itemName'] as string).toLowerCase() === itemNameLower
    );
    if (existingItem) {
      this.snackBar.open(
        'An item already exists with the given name',
        'Warning',
        { duration: 2000 }
      );
      return;
    }

    // Calculate item amount
    const itemAmount = Number(itemQuantity) * Number(itemPrice);

    // Add the new item to the array
    this.itemsArray.push({
      itemName,
      itemPrice,
      itemQuantity,
      itemAmount,
    });

    // Reset the form
    this.itemsForm.reset();
    this.isLinear = false;

    // Display a success message
    this.snackBar.open('Item Added', 'Success', { duration: 2000 });
  }

  submit() {
    let invDate: any = this.invoiceDetails.controls['invoiceDate'].value;
    invDate = invDate.toISOString().split('T')[0];

    let dueDate: any = this.invoiceDetails.controls['invoiceDate'].value;
    invDate = invDate.toISOString().split('T')[0];

    let itemX: any = [];
    let total: number = 0;
    let taxAmt: number = 0;
    let feeDisc: number = 0;
    let grandTotal: number = 0;

    this.itemsArray.forEach((item) => {
      itemX.push([
        item['itemName'],
        item['itemQuantity'],
        item['itemPrice'],
        item['itemAmount'],
      ]);

      total += Number(item['itemAmount']);
    });

    taxAmt = (Number(this.paymentsForm['controls'].tax.value) / 100) * total;
    feeDisc =
      Number(this.paymentsForm['controls'].fee.value) -
      Number(this.paymentsForm['controls'].discount.value);

    grandTotal = total + taxAmt + feeDisc;

    const documentDefinition: any = {
      content: [
        { text: 'INVOICES\n\n\n', style: 'header' },
        {
          alignment: 'justify',
          columns: [
            {
              text: `${this.myDetailsForm.controls['name'].value}\n
              ${this.myDetailsForm.controls['address'].value}\n
              ${this.myDetailsForm.controls['phoneNumber'].value}\n
              ${this.myDetailsForm.controls['email'].value}\n`,
            },
          ],
        },
        '\n\n',
        { text: 'Bill to:', style: 'boldStyle' },
        {
          columns: [
            {
              text: `${this.buyerForm.controls['name'].value}\n
              ${this.buyerForm.controls['address'].value}\n
              ${this.buyerForm.controls['phoneNumber'].value}\n
              ${this.buyerForm.controls['email'].value}\n`,
            },
            {
              text: [
                { text: 'Invoice number: ', bold: true },
                `${this.randomString(15)}\n`,
                { text: 'Invoice date: ', bold: true },
                `${invDate}\n`,
                { text: ' Payment due: ', bold: true },
                `${dueDate}\n`,
              ],
            },
          ],
        },
        '\n\n',
        {
          style: 'tableExample',
          table: {
            widths: [100, '*', 200, '*'],
            body: [
              [
                { text: 'Item', style: 'tableHeader' },
                { text: 'Quantity', style: 'tableHeader' },
                { text: 'Price per unit', style: 'tableHeader' },
                { text: 'Amount', style: 'tableHeader' },
              ],
              ...itemX,
            ],
          },
        },
        {
          style: 'tableExample',
          table: {
            widths: [100, '*', 200, '*'],
            body: [
              [
                '',
                '',
                { text: 'Subtotal:', style: 'tableHeader' },
                `$${total}`,
              ],
              [
                '',
                '',
                {
                  text: `Tax ${this.paymentsForm['controls'].tax.value}%:`,
                  style: 'tableHeader',
                },
                `$${taxAmt}`,
              ],
              [
                '',
                '',
                { text: `Fees/discount:`, style: 'tableHeader' },
                `$${feeDisc}`,
              ],
              [
                '',
                '',
                { text: `TOTAL:`, style: 'tableHeaderTotal' },
                `$${grandTotal}`,
              ],
            ],
            layout: {
              fillColor: function (
                rowIndex: any,
                node: any,
                columnIndex: number
              ) {
                // You can change condition according to your requirements
                return rowIndex === 0 ? 'green' : '';
              },
            },
          },
        },
        { text: '\n\nTerms and Conditions' },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        boldStyle: {
          bold: true,
          alignment: 'left',
        },
        tableHeader: {
          bold: true,
          color: 'black',
        },
        tableHeaderTotal: {
          bold: true,
          fontSize: 15,
          color: 'black',
        },
      },
      defaultStyle: {
        columnGap: 20,
      },
    };
    pdfMake.createPdf(documentDefinition).open();
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
