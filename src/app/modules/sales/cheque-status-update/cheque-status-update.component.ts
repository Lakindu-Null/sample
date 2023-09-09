import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'primeng/table';
import { CommonService } from 'src/app/Common.service';
import { DialogConfim } from 'src/app/common-modules/pop-up-cards/pop-up-cards.component';
import { receiptService } from 'src/app/services/receipt.service';
import { CommonFunctions } from 'src/app/util/CommonFunctions';
import { PrintModule } from 'src/app/util/PrintModule';
import { Theme } from 'src/app/util/Theme';

@Component({
  selector: 'app-cheque-status-update',
  templateUrl: './cheque-status-update.component.html',
  styleUrls: ['./cheque-status-update.component.scss']
})
export class ChequeStatusUpdateComponent {

  // displayedColumns = [
  //   'bank',
  //   'branch',
  //   'acountNumber',
  //   'chequeNo',
  //   'chequeDate',
  //   'amount',
  //   'realize',
  //   'returned'
  // ];

  // selection = new SelectionModel<any>(false, []);

  allData: any[] = [];
  // dataSource = new MatTableDataSource<any>();

  items: any[] = [];
  // home: any;
  // theme = Theme;
  netTotal = 0;
  mcId = 0;
  cusId = 0;
  chequeEnable = 'no';
  chequeOptions: any[] = [];

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
    private dataService: receiptService,
    private commonService: CommonService,
    private datePipe: DatePipe,
    public translate: TranslateService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder) {
    translate.setDefaultLang(CommonFunctions.browserLang);
    translate.use(CommonFunctions.browserLang);
    // this.setBreadCrumb();

    this.dataForm = this.formBuilder.group({
      customerId: new FormControl('', Validators.required),

      outstanding: new FormControl(''),
      cash: new FormControl('', Validators.required),
      cheque: new FormControl(''),
      allOverPayments: new FormControl(''),
      payOverPayment: new FormControl(''),
      chequeEnable: new FormControl('')
    });
  }




  // ngAfterViewInit() {
  //   this.tableDataReload();
  // }

  // setBreadCrumb() {
  //   this.items = this.translate.instant('PENDING_CHEQUES.BREAD_CRUMB');
  //   this.translate.onLangChange.subscribe(() => {
  //     this.items = this.translate.instant('PENDING_CHEQUES.BREAD_CRUMB');
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
        this.items = this.translate.instant('PENDING_CHEQUES.BREAD_CRUMB');
      })
  }

  ngOnDestroy() {
    this.languageSubcriber.unsubscribe();
  }

  grantAccess(accesCode: number) // access grant
  {
    return true;
  }

  getData() // Featch data
  {
    this.isLoading = true;
    this.dataService.pendingChequeList()
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

  /* DATE FORMATER */
  formatDate(dateString: any): string | undefined {
    const parsedDate = new Date(dateString);
    const formattedDate = this.datePipe.transform(parsedDate, 'yyyy-MM-dd');

    if (formattedDate === null) {
      return undefined;
    }
    return formattedDate;
  }

  resultFeatch(result: any) {
    let today: any = this.formatDate(new Date());
    for (const iterator of result) {
      let status = false;
      if (today < iterator.chequeDate) {
        status = true;
      }
      iterator.status = status;
      this.allData.push(iterator);
    }

    // this.tableDataReload();
  }

  // tableDataReload() {
  //   setTimeout(() => {
  //     this.dataSource = new MatTableDataSource(this.allData);
  //     this.dataSource.paginator = this.paginator;
  //   }, 200);
  // }

  featchError(error: string) {
    this.isLoading = false;
    this.commonService.alertMessage('error', error, 'Warning');
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

  saveConfirmation(status: string, element: any) {
    if (!element.status) {
      this.confirm("Do You Want To Update Cheque Status", element.id, status);
    } else {
      this.commonService.alertMessage('warn', 'Notice', 'You have to wait until ' + element.chequeDate + ' to update status !');
    }
  }

  confirm(message: string, id: number, status: any) {
    let dialogRef = this.dialog.open(DialogConfim, {
      minWidth: '300px',
      minHeight: '130px',
      data: {
        message: message
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.saveData(id, status);
      }
    });
  }


  // clearData() // Clear form 
  // {
  //   this.tableDataReload();
  // }

  saveData(id: number, status: any) {
    this.isLoading = true;
    this.dataService.chequeStatusUpdate(id, status)
      .subscribe(
        {
          next: (response: any) => {
            if (response.status == 200) (this.transactionComplete(response.result, 'saved'))
            else (this.transactionError('PENDING_CHEQUES.' + response.errDetail))
          },
          error: () => this.transactionError('COMMON.ERROR_OTHER'),
          complete: () => this.isLoading = false
        }
      );
  }

  transactionComplete(result: any, type: string) {
    if (result != null) {
      this.allData = result;
      // this.clearData();
      this.commonService.alertMessage('success', 'Notice', 'Status Updated');
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
    // this.tableDataReload()
  }

  /* PRIME NG GLOBEL FILTER */
  applyFilterGlobal($event: any, stringVal: string) {
    this.dt1!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
}
