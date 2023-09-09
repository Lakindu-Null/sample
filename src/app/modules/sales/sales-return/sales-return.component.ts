import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Table } from 'primeng/table';
import { CommonService } from 'src/app/Common.service';
import { DialogConfim } from 'src/app/common-modules/pop-up-cards/pop-up-cards.component';
import { invoiceService } from 'src/app/services/invoice.service';
import { salesreturnService } from 'src/app/services/salesreturn.service';
import { CommonFunctions } from 'src/app/util/CommonFunctions';
import { PrintModule } from 'src/app/util/PrintModule';
import { Theme } from 'src/app/util/Theme';

@Component({
  selector: 'app-sales-return',
  templateUrl: './sales-return.component.html',
  styleUrls: ['./sales-return.component.scss']
})
export class SalesReturnComponent {
  // displayedColumns = [

  //   'product',
  //   'quantity',
  //   'prereturn',
  //   'cost',
  //   'returnQuantity'
  // ];
  // selection = new SelectionModel<any>(false, []);
  allData: any[] = [];

  allInvoices: any[] = [];
  allcustomers: any[] = [];
  allproducts: any[] = [];
  avbQtyLoading = false;

  // dataSource = new MatTableDataSource<any>();
  items: any[] = [];
  // home: any;
  // theme = Theme;
  mcId: any = null;
  dateModel: any;
  cusId = 0;
  productId = 0;
  netTotal = 0;
  invId = 0;

  @ViewChild('dt1') dt1: Table | undefined;
  @ViewChild(Table) table!: Table;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataForm: any;
  errorMessage: any;
  isLoading: boolean = false;
  vatregisteredOptions: any[] = [{ value: true, name: 'yes' }, { value: false, name: 'no' }];

  // formHeaderTitle: string = 'Product';
  // formHeaderSubTitle: string = 'Please fill data ';
  // tableHeaderText: string = 'Product Details';
  languageSubcriber: any;

  constructor(
    private dataService: salesreturnService,
    private datePipe: DatePipe,
    private invoiceService: invoiceService,
    private commonService: CommonService,
    public translate: TranslateService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder) {
    translate.setDefaultLang(CommonFunctions.browserLang);
    translate.use(CommonFunctions.browserLang);
    // this.setBreadCrumb();

    this.dataForm = this.formBuilder.group({
      cusId: new FormControl('', Validators.required),
      productId: new FormControl(null),
      remark: new FormControl(null)
    });
  }

  // ngAfterViewInit() {
  //   this.tableDataReload();
  // }

  // setBreadCrumb() {
  //   this.items = this.translate.instant('SALES_RETURN.BREAD_CRUMB');
  //   this.translate.onLangChange.subscribe(() => {
  //     this.items = this.translate.instant('SALES_RETURN.BREAD_CRUMB');
  //   });
  // }

  ngOnInit(): void {
    CommonFunctions.isDashboardVisible = true;

    // this.home = { icon: 'pi pi-home', routerLink: '/dashBoard' };
    this.languageSubcriber = CommonFunctions.language
      .pipe()
      .subscribe(value => {
        this.translate.use(value);
        this.items = this.translate.instant('SALES_RETURN.BREAD_CRUMB');
      })
    this.getMcList();
  }

  getMcList() {
    this.isLoading = true;
    this.dataService.getAllDependencies()
      .subscribe(
        {
          next: (response: any) => {
            if (response.status == 200) this.resultFeatch(response.result)
            else (this.featchError('Featch Error'))
          },
          error: () => this.featchError('connection error try again later'),
          complete: () => this.isLoading = false
        }
      );
  }

  ngOnDestroy() {
    this.languageSubcriber.unsubscribe();
  }

  grantAccess(accesCode: number) // access grant
  {
    return CommonFunctions.accessGrant(accesCode);
  }

  dataChanged() {
    let productId = this.dataForm.controls['productId'].value;
    let cusId = this.dataForm.controls['cusId'].value;
    if (cusId != null && cusId != undefined && productId != null && productId != undefined) {
      this.isLoading = true;
      this.invoiceService.getSelectedInvoiceDetailsByCustomerAndProduct(productId, cusId)
        .subscribe(
          {
            next: (response: any) => {
              if (response.status == 200) {
                this.allData = [];
                for (const iterator of response.result) {
                  iterator.cost = (iterator.value / iterator.quantity);
                  iterator.invoiceQuantity = iterator.quantity;
                  iterator.invoiceDId = iterator.id;
                  iterator.invoiceDHeaderId = iterator.headerId;
                  iterator.id = 0;
                  iterator.quantity = null;
                  this.allData.push(iterator);
                }
              }
              else (this.featchError('Featch Error'))
            },
            error: () => this.featchError('connection error try again later'),
            complete: () => this.isLoading = false
          }
        );
    }
    this.allData = [];
  }


  invoiceChanged() {
    let invoiceId = this.dataForm.controls['invoiceNumber'].value;
    if (invoiceId != null && invoiceId != undefined) {

      this.isLoading = true;
      this.invoiceService.getSelectedInvoiceDetails(invoiceId)
        .subscribe(
          {
            next: (response: any) => {
              if (response.status == 200) {
                this.allData = [];
                for (const iterator of response.result) {
                  iterator.cost = (iterator.value / iterator.quantity);
                  iterator.invoiceQuantity = iterator.quantity;
                  iterator.invoiceDId = iterator.id;
                  iterator.id = 0;
                  iterator.quantity = null;
                  this.allData.push(iterator);
                }
                // this.tableDataReload();
              }
              else (this.featchError('Featch Error'))
            },
            error: () => this.featchError('connection error try again later'),
            complete: () => this.isLoading = false
          }
        );
    }
    this.allData = [];
    // this.tableDataReload();
  }

  returnQtyChange(data: any) {
    let maximumretun = data.invoiceQuantity - data.returnQty;
    if (maximumretun < data.quantity) {
      data.quantity = null;
      this.commonService.alertMessage('warn', 'Notice','Invalid Quantity');
    }
    console.log('data ' + JSON.stringify(data));
  }

  resultFeatch(result: any) {

    this.allcustomers.push({ name: 'Please Select Customer', id: null });
    this.allcustomers.push(...result.data2);

    this.allproducts.push({ name: 'Please Select Product', id: null });
    this.allproducts.push(...result.data3);

    let mcList = result.data1;

    if (mcList.length > 0) {
      this.mcId = parseInt(mcList[0].id) + 1;
    } else {
      this.mcId = 1;
    }
  }

  // tableDataReload() {
  //   setTimeout(() => {
  //     this.dataSource = new MatTableDataSource(this.allData);
  //     this.dataSource.paginator = this.paginator;
  //   }, 200);
  // }

  featchError(error: string) {
    this.isLoading = false;
    this.commonService.alertMessage('error',error, 'Warning');
  }

  // tableSelect(data: any)  // Table select 
  // {
  //   if (this.selection.selected.length > 0) {
  //     this.dataForm.patchValue(data);
  //   }
  //   else (this.dataForm.reset())
  // }

  // tableFilter(event: any) //Table filter
  // {
  //   let filterValue = event.target.value;
  //   if (this.dataSource.data.length != 0) {
  //     filterValue = filterValue.trim();
  //     filterValue = filterValue.toLowerCase();
  //     this.dataSource.filter = filterValue;
  //   }
  // }

  // ----Transaction confirmation------

  saveConfirmation() {
    let filterdataSet: any[] = this.allData.filter(data => data.quantity != null && data.quantity > 0 && data.cost > 0 && data.cost!=null);
    if (filterdataSet.length > 0) {
      let confirmationText = this.translate.instant('COMMON.SAVE_CONFIRMATION');
      this.confirm(confirmationText, filterdataSet);
    } else {
      this.commonService.alertMessage('warn', 'Notice','Please Enter Some Return Quantities');
    }
  }

  confirm(message: string, data: any) {
    let dialogRef = this.dialog.open(DialogConfim, {
      minWidth: '300px',
      minHeight: '130px',
      data: {
        message: message
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.saveData(data)
        // if (type == 2) (this.upadetData())
        // if (type == 3) (this.deleteData())
      }
    });
  }

  clearData() // Clear form 
  {
    this.dataForm.reset();
    this.allData = [];
    // this.selection.clear();
  }

  clearDataSave() // Clear form after save
  {
    this.dataForm.reset();
    // this.selection.clear();
    this.allData = [];
    // this.tableDataReload();
  }

  saveData(returnDataSet: any[]) {
    let header = {
      customerId: this.dataForm.controls['cusId'].value,
      remark: this.dataForm.controls['remark'].value
    };

    let data = {
      mcId: this.mcId,
      header: header,
      det: returnDataSet
    };

    this.isLoading = true;
    this.dataService.makeSalesreturn(data)
      .subscribe(
        {
          next: (response: any) => {
            if (response.status == 200) (this.transactionComplete(response.result))
            else (this.transactionError('INVOICE.' + response.errDetail))
          },
          error: () => this.transactionError('COMMON.ERROR_OTHER'),
          complete: () => this.isLoading = false
        }
      );
  }

  transactionComplete(result: any) {

    this.clearDataSave();
    let alert = '';
    let mcList = result.mcList;
    if (mcList.length > 0) {
      this.mcId = parseInt(mcList[0].id) + 1;
    } else {
      this.mcId = 1;
    }
    if (result.header != null) {
      PrintModule.printSalesReturn(result.header, result.det);
      alert = this.translate.instant('COMMON.SAVE_ALERT');
      let notice = this.translate.instant('COMMON.NOTICE');
      this.commonService.alertMessage('success', notice,alert);
    } else {
      this.transactionError('COMMON.ERROR_OTHER')
    }
  }

  transactionError(errorMsg: string) {
    this.clearDataSave();
    this.isLoading = false
    let alert = this.translate.instant(errorMsg);
    let notice = this.translate.instant('COMMON.NOTICE');
    this.commonService.alertMessage('warn', notice,alert);
    // this.tableDataReload()
  }

  /* PRIME NG GLOBEL FILTER */
  applyFilterGlobal($event: any, stringVal: string) {
    this.dt1!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  /* DATE FORMATER */
  formatDate(dateString: any): string | undefined {
    const parsedDate = new Date(dateString);
    const formattedDate = this.datePipe.transform(parsedDate, 'yyyy-MM-dd');

    if (formattedDate === null) {
      return undefined;
    }
    return formattedDate;
  }
}
