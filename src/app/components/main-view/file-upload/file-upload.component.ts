import {Component, Input} from '@angular/core';
import {ReceiptService} from "../../../services/receipt-service";
import {NavigationExtras, Router} from "@angular/router";
import {ReceiptModel} from "../../../models/receipt.model";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {
  SpendingStatisticsErrorDialogComponent
} from "../spending-statistics/spending-statistics-error-dialog/spending-statistics-error-dialog.component";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {

  fileName = "";

  formData: FormData = new FormData();

  isLoading: boolean = false;

  isFileUploaded: boolean = false;

  constructor(private receiptService: ReceiptService, private router: Router, private dialog: MatDialog) {

  }

  onFileSelected(event: any) {
    let file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;

      let formData = new FormData();
      formData.append("file", file);
      this.formData = formData;

      this.isFileUploaded = true;
    }
  }

  uploadFile() {
    this.isLoading = true;
    this.receiptService.uploadFile(this.formData).subscribe(data => {
      console.log(data.status);
      if (data.status == 202) {
        let body: ReceiptModel = data.body;
        let navigationExtras: NavigationExtras = {
          state: {
            body
          }
        };

        this.isLoading = false;
        this.router.navigate(["/main-view/receipt-form"], navigationExtras);
      }
    }, error => {
      console.log(error);
      if (error.status == 500) {
        let str: string = error.error + "<br>Please upload another image, or insert the receipt data manually!";
        this.openDialog(str);
      } else {
        alert("Uploaded image could not be processed!");
      }

      this.isLoading = false;
    });
  }

  openDialog(str: string): void {
    const dialogRef = this.dialog.open(SpendingStatisticsErrorDialogComponent, {
      data: {errorMessage: str}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Dialog closed");
    });
  }

  onBackButtonClick() {
    this.router.navigate(["/main-view/main-page"]);
  }
}
