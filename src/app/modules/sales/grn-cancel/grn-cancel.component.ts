import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'primeng/table';
import { CommonService } from 'src/app/Common.service';
import { DialogConfim } from 'src/app/common-modules/pop-up-cards/pop-up-cards.component';
import { grnService } from 'src/app/services/grn.service';
import { salesreturnService } from 'src/app/services/salesreturn.service';
import { CommonFunctions } from 'src/app/util/CommonFunctions';
import { PrintModule } from 'src/app/util/PrintModule';
import { Theme } from 'src/app/util/Theme';

@Component({
  selector: 'app-grn-cancel',
  templateUrl: './grn-cancel.component.html',
  styleUrls: ['./grn-cancel.component.scss']
})
export class GrnCancelComponent {
  // displayedColumns = [

  //   'productName',
  //   'currentQty',
  //   'returnQty'
  // ];
  // selection = new SelectionModel<any>(false, []);
  allData: any[] = [];

  allGrn: any[] = [];
  avbQtyLoading = false;

  // dataSource = new MatTableDataSource<any>();
  items: any[] = [];
  // home: any;
  // theme = Theme;
  mcId: any = null;
  dateModel: any;
  netTotal = 0;
  grnId: any;

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
    private dataService: grnService,
    private commonService: CommonService,
    public translate: TranslateService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder) {
    translate.setDefaultLang(CommonFunctions.browserLang);
    translate.use(CommonFunctions.browserLang);
    // this.setBreadCrumb();

    this.dataForm = this.formBuilder.group({
      grnId: new FormControl('', Validators.required)
    });
  }

  // ngAfterViewInit() {
  //   this.tableDataReload();
  // }

  // setBreadCrumb() {
  //   this.items = this.translate.instant('GRN_CANCEL.BREAD_CRUMB');
  //   this.translate.onLangChange.subscribe(() => {
  //     this.items = this.translate.instant('GRN_CANCEL.BREAD_CRUMB');
  //   });
  // }

  ngOnInit(): void {
    CommonFunctions.isDashboardVisible = true;

    // this.home = { icon: 'pi pi-home', routerLink: '/dashBoard' };
    this.languageSubcriber = CommonFunctions.language
      .pipe()
      .subscribe(value => {
        this.translate.use(value);
        this.items = this.translate.instant('GRN_CANCEL.BREAD_CRUMB');
      })
    this.getMcList();
  }

  getMcList() {
    this.isLoading = true;
    this.dataService.grnListForCancel()
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

  grnChanged() {
    let grnId = this.dataForm.controls['grnId'].value;
    if (grnId != null && grnId != undefined) {
      this.isLoading = true;
      this.dataService.getSelectedGrnDetails(grnId)
        .subscribe(
          {
            next: (response: any) => {
              if (response.status == 200) {
                this.allData = response.result;
                // this.tableDataReload();
                // this.table.reset();
              }
              else (this.featchError('Featch Error'))
            },
            error: () => this.featchError('connection error try again later'),
            complete: () => this.isLoading = false
          }
        );
    }
    this.allData = [];
    // this.table.reset();
    // this.tableDataReload();
  }

  returnQtyChange(data: any) {
    let maximumretun = data.invoiceQuantity - data.returnQty;
    if (maximumretun < data.quantity) {
      data.quantity = null;
      this.commonService.alertMessage('warn', 'Notice', 'Invalid Quantity');
    }
  }

  resultFeatch(result: any) {
    this.allGrn = [];
    this.allGrn.push({ id: null, label: 'Please Select Grn' });
    for (const iterator of result) {
      iterator.label = iterator.genId;
      this.allGrn.push(iterator);
    }

    setTimeout(() => {
      this.clearData();
    }, 300);
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

  saveConfirmation() {
    let filterdataSet: any[] = this.allData.filter(data => data.returnQty != null && data.returnQty > 0);
    if (filterdataSet.length > 0) {
      console.log('filterdataSet ' + JSON.stringify(filterdataSet));

      let confirmationText = this.translate.instant('COMMON.SAVE_CONFIRMATION');
      this.confirm(confirmationText, filterdataSet);
    } else {
      this.commonService.alertMessage('warn','Notice','Please Enter Some Return Quantities');
    }
  }

  fullCancelConfirmation() {
    let detaSet: any[] = [];
    this.allData.forEach(element => {
      detaSet.push({
        id: element.id,
        productId: element.productId,
        productName: element.productName,
        headerId: element.headerId,
        basedQty: element.basedQty,
        currentQty: element.currentQty,
        batchNumber: element.batchNumber,
        cost: element.cost,
        returnQty: element.currentQty,
      });
    });
    let confirmationText = this.translate.instant('Do You Want To Cancel Whole Grn ?');
    this.confirm(confirmationText, detaSet);
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
      }
    });
  }

  qtyChange(data: any) {
    if (data.currentQty < data.returnQty) {
      data.returnQty = null;
    }
  }

  clearData() // Clear form 
  {
    this.dataForm.reset();
    // this.selection.clear();
    this.allData = [];
  }

  clearDataSave() // Clear form after save
  {
    this.dataForm.reset();
    // this.selection.clear();
    this.allData = [];
    // this.tableDataReload();
    // this.table.reset();
  }

  saveData(returnDataSet: any[]) {
    this.isLoading = true;
    this.dataService.grnCancel(this.grnId, returnDataSet)
      .subscribe(
        {
          next: (response: any) => {
            if (response.status == 200) (this.transactionComplete(response.result))
            else (this.transactionError('GRN_CANCEL.' + response.errDetail))
          },
          error: () => this.transactionError('COMMON.ERROR_OTHER'),
          complete: () => this.isLoading = false
        }
      );
  }

  transactionComplete(result: any) {
    let notice = this.translate.instant('COMMON.NOTICE');
    this.commonService.alertMessage('success',notice,'Transaction Completed');
    this.resultFeatch(result);

  }

  transactionError(errorMsg: string) {
    this.clearDataSave();
    this.isLoading = false
    let alert = this.translate.instant(errorMsg);
    let notice = this.translate.instant('COMMON.NOTICE');
    this.commonService.alertMessage('error',notice,alert );
    // this.tableDataReload()
    // this.table.reset();
  }

  /* PRIME NG GLOBEL FILTER */
  applyFilterGlobal($event: any, stringVal: string) {
    this.dt1!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
}
