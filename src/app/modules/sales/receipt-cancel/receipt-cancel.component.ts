import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/Common.service';
import { DialogConfim } from 'src/app/common-modules/pop-up-cards/pop-up-cards.component';
import { receiptService } from 'src/app/services/receipt.service';
import { CommonFunctions } from 'src/app/util/CommonFunctions';
import { PrintModule } from 'src/app/util/PrintModule';
import { Theme } from 'src/app/util/Theme';

@Component({
  selector: 'app-receipt-cancel',
  templateUrl: './receipt-cancel.component.html',
  styleUrls: ['./receipt-cancel.component.scss']
})
export class ReceiptCancelComponent {

  selection = new SelectionModel<any>(false, []);

  allData: any[] = [];
  allOutstanding: any[] = [];
  allOverPayments: any[] = [];


  allCustomers: any[] = [];

  dataSource = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();

  items: any[] = [];
  // home: any;
  theme = Theme;
  netTotal = 0;
  mcId = 0;
  cusId = 0;
  receiptId = 0;
  chequeEnable = 'no';
  chequeOptions: any[] = [];
  receiptList: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  errorMessage: any;
  isLoading: boolean = false;
  vatregisteredOptions: any[] = [{ value: true, name: 'yes' }, { value: false, name: 'no' }];

  formHeaderTitle: string = 'Product';
  formHeaderSubTitle: string = 'Please fill data ';
  tableHeaderText: string = 'Product Details';
  languageSubcriber: any;

  constructor(
    private dataService: receiptService,
    private commonService: CommonService,
    public translate: TranslateService,
    private dialog: MatDialog) {
    translate.setDefaultLang(CommonFunctions.browserLang);
    translate.use(CommonFunctions.browserLang);
    // this.setBreadCrumb();
  }

  dataForm = new FormGroup({
    customerId: new FormControl('', Validators.required),
    receiptId: new FormControl('', Validators.required),
  });

  // setBreadCrumb() {
  //   this.items = this.translate.instant('GRN.BREAD_CRUMB');
  //   this.translate.onLangChange.subscribe(() => {
  //     this.items = this.translate.instant('GRN.BREAD_CRUMB');
  //   });
  // }

  ngOnInit(): void {
    CommonFunctions.isDashboardVisible = true;

    this.getData();
    // this.home = { icon: 'pi pi-home', routerLink: '/dashBoard' };
    this.languageSubcriber = CommonFunctions.language
      .pipe()
      .subscribe(value => {
        this.translate.use(value);
        this.items = this.translate.instant('GRN.BREAD_CRUMB');
      })
  }

  ngOnDestroy() {
    this.languageSubcriber.unsubscribe();
  }

  grantAccess(accesCode: number) // access grant
  {
    return true;
  }

  getTotalOutstanding() {
    return this.allOutstanding.reduce((accumulator, current) => {
      return accumulator + current.balance;
    }, 0);
  }

  getTotalOverPayments() {
    return this.allOverPayments.reduce((accumulator, current) => {
      return accumulator + current.cashOverPaymentBalance;
    }, 0);
  }


  getTotalPaid() {
    return this.allOutstanding.reduce((accumulator, current) => {
      return accumulator + current.payment;
    }, 0);
  }


  getData() // Featch data
  {
    this.isLoading = true;
    this.dataService.getAllDependencies()
      .subscribe(
        {
          next: (response: any) => {
            if (response.status == 200) (this.resultFeatch(response.result))
            else (this.featchError('Featch Error'))
          },
          error: () => this.featchError('connection error try again later'),
          complete: () => this.isLoading = false
        }
      );
  }

  resultFeatch(result: any) {
    let mcList = result.data1;
    if (mcList.length > 0) {
      this.mcId = parseInt(mcList[0].id) + 1;
    } else {
      this.mcId = 1;
    }
    this.allCustomers.push({ name: 'Please Select Customer', id: null });
    this.allCustomers.push(...result.data2);
  }

  print() {
    let data: any = this.dataForm.controls['receiptId'].value;
    if (data.id != null) {
      this.isLoading = true;
      this.dataService.getSelectedReceiptDetails(data.id)
        .subscribe(
          {
            next: (response: any) => {
              if (response.status == 200) PrintModule.printReceipt(data, response.result.data1, response.result.data2);
              else (this.featchError('Featch Error'))
            },
            error: () => this.featchError('connection error try again later'),
            complete: () => this.isLoading = false
          }
        );
    }
  }

  customerChange(data: any) {
    if (data != null) {
      this.isLoading = true;
      this.dataService.customerReceiptList(data)
        .subscribe(
          {
            next: (response: any) => {
              if (response.status == 200) (this.addtoCart(response.result))
              else (this.featchError('Featch Error'))
            },
            error: () => this.featchError('connection error try again later'),
            complete: () => this.isLoading = false
          }
        );
    }
  }

  addtoCart(data: any[]) {
    this.receiptList = [];
    this.receiptList.push({ genId: 'Please Select Receipt', id: null });
    this.receiptList.push(...data);
  }

  featchError(error: string) {
    this.isLoading = false;
    this.commonService.alertMessage('error', error, 'Warning');
  }

  tableSelect(data: any)  // Table select 
  {
    if (this.selection.selected.length > 0) {
      this.dataForm.patchValue(data);
    }
    else (this.dataForm.reset())
  }

  tableFilter(event: any) //Table filter
  {
    let filterValue = event.target.value;
    if (this.dataSource2.data.length != 0) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase();
      this.dataSource2.filter = filterValue;
    }
  }

  // ----Transaction confirmation------

  saveConfirmation() {
    let data: any = this.dataForm.controls['receiptId'].value;
    let cusId: any = this.dataForm.controls['customerId'].value;

    if (cusId != null && cusId != undefined && cusId != "" && data != null && data != "") {
      let confirmationText = this.translate.instant('COMMON.DELETE_CONFIRMATION');
      this.confirm(confirmationText, 1);
    } else {
      this.commonService.alertMessage('warn', 'Notice', 'Please Select Customer And Receipt');
    }
  }

  confirm(message: string, type: number) {
    let dialogRef = this.dialog.open(DialogConfim, {
      minWidth: '300px',
      minHeight: '130px',
      data: {
        message: message
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.saveData();
      }
    });
  }


  clearData() // Clear form 
  {
    this.dataForm.reset();
  }



  saveData() {
    let dat: any = this.dataForm.controls['receiptId'].value;
    let data = {
      id: dat.id,
      mcId: this.mcId
    };
    this.isLoading = true;
    this.dataService.receiptCancel(dat.id, this.mcId)
      .subscribe(
        {
          next: (response: any) => {
            if (response.status == 200) (this.transactionComplete(response.result, 'saved'))
            else (this.transactionError('GRN.' + response.errDetail))
          },
          error: () => this.transactionError('COMMON.ERROR_OTHER'),
          complete: () => this.isLoading = false
        }
      );
  }

  transactionComplete(result: any, type: string) {
    let alert = '';
    if (result != null) {
      let mcList = result.data2;
      if (mcList.length > 0) {
        this.mcId = parseInt(mcList[0].id) + 1;
      } else {
        this.mcId = 1;
      }
      if (result.data1) {
        alert = this.translate.instant('COMMON.DELETE_ALERT');
        this.clearData();
        let notice = this.translate.instant('COMMON.NOTICE');
        this.commonService.alertMessage('success', notice, alert);
      } else {
        let notice = this.translate.instant('COMMON.NOTICE');
        this.commonService.alertMessage('error', notice, 'Receipt Cancel Failed',);
      }
    } else {
      this.transactionError('COMMON.ERROR_OTHER')
    }
  }

  printReceipt(header: any, details: any[], chequeList: any[]) {
    PrintModule.printReceipt(header, details, chequeList);
  }


  transactionError(errorMsg: string) {
    this.isLoading = false
    let alert = this.translate.instant(errorMsg);
    let notice = this.translate.instant('COMMON.NOTICE');
    this.commonService.alertMessage('error', notice, alert);
  }

}
