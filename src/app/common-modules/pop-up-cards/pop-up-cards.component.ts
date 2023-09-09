import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { environment } from 'src/environments/environment';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pop-up-cards',
  templateUrl: './templates/pop-up-cards.component.html',
  styleUrls: ['./style-sheets/pop-up-cards.component.css']
})
export class PopUpCardsComponent implements OnInit {
  constructor() { }
  ngOnInit() {
  }
}

@Component({
  selector: 'high-priority-confim-component',
  templateUrl: './templates/high-priority-confim-component.html',
  styleUrls: ['./style-sheets/high-priority-confim-component.scss']
})
export class HighPriorityConfim implements OnInit{
  confirm!: String;
  message: any;

  constructor(
    public dialogRef: MatDialogRef<PopUpCardsComponent>,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) 
  {
    this.message = data.message; 
  }

  ngOnInit() {
  }

  dialogClose(value: boolean): void {
    if(value){
      if(this.confirm == 'Confirm' || this.confirm == 'confirm'){
        this.confirm = "";
        this.dialogRef.close(value);
      }
    }else{
      this.dialogRef.close(value);
    }
  }
}

@Component({
  selector: 'confirm-dialog',
  templateUrl: './templates/confirmationDialog.html',
  styleUrls: ['./style-sheets/confirmDialog.scss']
})
export class DialogConfim {
  message: any;
  formData: any

  constructor(
    public dialogRef: MatDialogRef<PopUpCardsComponent>,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.message = data.message;
  }

   header = this.translate.instant('COMMON.CONFIRMATION_TITLE');
   yesText = this.translate.instant('COMMON.BTN_YES');
   noText = this.translate.instant('COMMON.BTN_NO');

  dialogClose(value: boolean): void {
    this.dialogRef.close(value);
  }
}

@Component({
  selector: 'common-image-selector',
  styleUrls: ['./style-sheets/image-selector.scss'],
  templateUrl: './templates/image-selector.html',
})
export class CommonImageSelector {

  isMultipleAllowed = false;
  selectedFile: any;
  images: any[] = [];
  imagePath = environment.storageUrl;
  uploadLoder = false;
  deleteLoder = false;
  imageSrc: any = null;
  selected: any = 0;
  uploadPath = '';
  httpPath = environment.baseUrl;


  constructor(
    public dialogRef: MatDialogRef<PopUpCardsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpClient: HttpClient,
    public translate: TranslateService,
    private snackBar: MatSnackBar
  ) {
    this.isMultipleAllowed = data.isMultipleAllowed;
    this.images = data.productImages;
    this.uploadPath = data.uploadPath;
    this.setImageSelection();
  }

  headerText = this.translate.instant('COMMON.IMAGE_CHOOSER_HEADER');
  tabText1 = this.translate.instant('COMMON.IMAGE_CHOOSER_TAB1');
  tabText2 = this.translate.instant('COMMON.IMAGE_CHOOSER_TAB2');
  btnConf = this.translate.instant('COMMON.IMAGE_CHOOSER_BTN_CONFIRM');
  btnRemove = this.translate.instant('COMMON.IMAGE_CHOOSER_BTN_REMOVE');
  btnUpload = this.translate.instant('COMMON.IMAGE_CHOOSER_BTN_UPLOAD');
  notice1 = this.translate.instant('COMMON.IMAGE_CHOOSER_NOTICE1');
  proccesingText1 = this.translate.instant('COMMON.IMAGE_CHOOSER_UPLOAD_PROCCESING');
  selectedImage = this.translate.instant('COMMON.IMAGE_CHOOSER_SELECTED_IMAGE');

  uploadSuccessText = this.translate.instant('COMMON.IMAGE_UPLOAD_SUCCESS_MESSAGE');
  uploadFailedText = this.translate.instant('COMMON.IMAGE_UPLOAD_FAILED_MESSAGE');
  removeSuccessText = this.translate.instant('COMMON.IMAGE_DELETE_SUCCESS_MESSAGE');
  removeFailedText = this.translate.instant('COMMON.IMAGE_DELETE_FAILED_MESSAGE');
  alertNotice = this.translate.instant('COMMON.NOTICE');




  ngOnInit(): void {

  }

  setImageSelection() {
    this.images.forEach(image => {
      image.selected = false;
    });
    this.setIndex();
    console.log('images ' + JSON.stringify(this.images));

  }

  setIndex() {
    this.selected = 0;
    if (this.images.length == 0) {
      this.selected = 1;
    }
  }

  selectImage(imgObj: any) {
    if (imgObj.selected) (imgObj.selected = false)
    else (this.clearSelection(imgObj))
  }

  clearSelection(imgObj: any) {
    if (!this.isMultipleAllowed) {
      this.images.forEach(image => {
        image.selected = false;
      });
    }

    imgObj.selected = true
  }

  closeModal(): void {
    this.dialogRef.close(
      {
        images: this.images,
        selectedImages: []
      }
    );
  }

  isImagesSelected() {
    let status = true;
    let filterBySelected: any[] = this.images.filter(image => image.selected == true);
    if (filterBySelected.length > 0) (status = false)
    return status;
  }

  confirmSelected() {
    let filterBySelected: any[] = this.images.filter(image => image.selected == true);
    this.dialogRef.close(
      {
        images: this.images,
        selectedImages: filterBySelected
      }
    );
  }

  oneElementSelected() {
    let status = true;
    let filterBySelected: any[] = this.images.filter(image => image.selected == true);
    if (filterBySelected.length == 1) (status = false)
    return status;
  }

  removeImages() {
    this.deleteLoder = true;
    let id = this.images.filter(image => image.selected)[0].id;
    let path = this.httpPath + this.uploadPath + '/deleteImage';
    let queryParams = new HttpParams()
    .append("id", id);
    this.httpClient.delete(path, { params: queryParams })
      .subscribe(
        {
          next: (response: any) => {
            if (response.status == 200) (this.resultMapping(response.result))
            else (this.removeError(response))
          },
          error: () => this.deleteLoder = false,
          complete: () => this.deleteLoder = false
        }
      );
  }

  chooseFile(event: any) {
    this.selectedFile = null;
    let file = event.target.files[0];
    if (file.size < environment.productImageMaxUpload) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }
    else {
      this.alertMessage('Maximum File Size 70 KB ', 'Size Exceeded!');
    }
  }

  uploadImage() {
    this.uploadLoder = true;
    const uploadImageData = new FormData();
    uploadImageData.append('file', this.selectedFile);
    this.httpClient.post(this.httpPath + this.uploadPath + '/uploadImage',
      uploadImageData, { observe: 'response' })
      .subscribe(
        {
          next: (response: any) => {
            if (response.status == 200) (this.fetchUpload(response.body.result))
            else (this.uploadError())
          },
          error: () => this.uploadLoder = false,
          complete: () => this.uploadLoder = false
        }
      );
  }

  fetchUpload(result: any) {
    this.imageSrc = null;
    this.selectedFile = null;
    this.images = result;
    this.setImageSelection();
    this.uploadLoder = false;
    this.alertMessage(this.uploadSuccessText, this.alertNotice);
  }

  uploadError() {
    this.imageSrc = null;
    this.selectedFile = null;
    this.uploadLoder = false;
    this.alertMessage(this.uploadFailedText, this.alertNotice);
    //message here 
  }

  resultMapping(response: any) {
    this.deleteLoder = false;
    this.images = response;
    this.setIndex();
    this.alertMessage(this.removeSuccessText, this.alertNotice);
  }

  clearSelected() {
    this.imageSrc = null;
    this.selectedFile = null;
  }

  removeError(response: any) {
    this.deleteLoder = false;
    this.alertMessage(this.removeFailedText, this.alertNotice);
  }

  alertMessage(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }

}



@NgModule({
  declarations: [
    DialogConfim,
    CommonImageSelector,
    HighPriorityConfim
  ],
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    InputTextModule,
    DropdownModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatIconModule,
    MatTabsModule,
    MatCheckboxModule,
    BrowserModule
  ]
})
export class CommonPopUpModule { }

