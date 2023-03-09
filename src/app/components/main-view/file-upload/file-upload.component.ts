import { Component } from '@angular/core';
import {ReceiptService} from "../../../services/receipt-service";
import {NavigationExtras, Router} from "@angular/router";
import {ReceiptModel} from "../../../models/receipt.model";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {

  fileName = "";

  formData: FormData = new FormData();

  isLoading: boolean = false;

  constructor(private receiptService: ReceiptService, private router: Router) {

  }

  onFileSelected(event: any) {
    let file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;

      let formData = new FormData();
      formData.append("file", file);
      this.formData = formData;
    }
  }

  uploadFile() {
    this.isLoading = true;
    this.receiptService.uploadFile(this.formData).subscribe(data => {
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
      alert("ERROR!" + error.message);
      this.isLoading = false;
    });
  }
}
