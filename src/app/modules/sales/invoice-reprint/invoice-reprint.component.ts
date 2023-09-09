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
import { Company } from 'src/app/models/Company';
import { invoiceService } from 'src/app/services/invoice.service';
import { productService } from 'src/app/services/product.service';
import { CommonFunctions } from 'src/app/util/CommonFunctions';
import { PrintModule } from 'src/app/util/PrintModule';
import { Theme } from 'src/app/util/Theme';

@Component({
  selector: 'app-invoice-reprint',
  templateUrl: './invoice-reprint.component.html',
  styleUrls: ['./invoice-reprint.component.scss']
})
export class InvoiceReprintComponent {
  // displayedColumns = [
  //   'id',
  //   'createdDate',
  //   'createdBy',
  //   'print'
  // ];

  selection = new SelectionModel<any>(false, []);
  allData: any[] = [];

  allColors: any[] = [];
  allCategories: any[] = [];
  allVolumeTypes: any[] = [];

  dataSource = new MatTableDataSource<any>();
  items: any[] = [];
  // home: any;
  // theme = Theme;
  startDate: any = new Date();
  endDate: any = new Date();
  commonFunctions = CommonFunctions;

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
    private dataService: invoiceService,
    private commonService: CommonService,
    private datePipe: DatePipe,
    public translate: TranslateService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder) {
    translate.setDefaultLang(CommonFunctions.browserLang);
    translate.use(CommonFunctions.browserLang);
    // this.setBreadCrumb();

    this.dataForm = this.formBuilder.group({
      startDate: new FormControl(new Date(), Validators.required),
      endDate: new FormControl(new Date(), Validators.required)
    });
  }

  // ngAfterViewInit() {
  //   this.tableDataReload();
  // }


  // setBreadCrumb() {
  //   this.items = this.translate.instant('INVOICE_REPRINT.BREAD_CRUMB');
  //   this.translate.onLangChange.subscribe(() => {
  //     this.items = this.translate.instant('INVOICE_REPRINT.BREAD_CRUMB');
  //   });
  // }

  ngOnInit(): void {
    CommonFunctions.isDashboardVisible = true;

    // this.home = { icon: 'pi pi-home', routerLink: '/dashBoard' };
    this.languageSubcriber = CommonFunctions.language
      .pipe()
      .subscribe(value => {
        this.translate.use(value);
        this.items = this.translate.instant('INVOICE_REPRINT.BREAD_CRUMB');
      })

    this.getData();
  }

  ngOnDestroy() {
    this.languageSubcriber.unsubscribe();
  }

  grantAccess(accesCode: number) // access grant
  {
    return CommonFunctions.accessGrant(accesCode);
  }

  getData() // Featch data
  {
    let sd = this.formatDate(this.dataForm.controls['startDate'].value);
    let ed = this.formatDate(this.dataForm.controls['endDate'].value);

    this.isLoading = true;
    this.dataService.InvoiceList(sd, ed)
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
    this.allData = result;
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
    if (this.dataSource.data.length != 0) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase();
      this.dataSource.filter = filterValue;
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
    // this.selection.clear();
    this.allData = [];
  }

  transactionComplete(result: any, type: string) {
    let alert = '';

    if (result != null) {

      if (type === 'saved') {
        alert = this.translate.instant('COMMON.SAVE_ALERT');
        this.allData.push(result);
        this.clearDataSave();
      }

      else if (type === 'updated') {
        alert = this.translate.instant('COMMON.UPDATE_ALERT');
        let filter = this.allData.filter(data => data.id == this.selection.selected[0].id)
        if (filter.length > 0) {
          CommonFunctions.setValusToFrom(filter[0], result);
        }
        this.clearData();
      }

      else if (type === 'deleted' && result) {
        alert = this.translate.instant('COMMON.DELETE_ALERT');
        let filter = this.allData.filter(data => data.id == this.selection.selected[0].id)
        if (filter.length > 0) {
          let index = this.allData.indexOf(filter[0]);
          if (index > -1) {
            this.allData.splice(index, 1);
          }
        }
        this.clearData();
      } else {
        alert = this.translate.instant('COMMON.ERROR_ALERT');
        this.clearData();
      }

      // this.tableDataReload();
      let notice = this.translate.instant('COMMON.NOTICE');
      this.commonService.alertMessage('success', notice, alert);
    } else {
      this.transactionError('COMMON.ERROR_OTHER')
    }
  }

  transactionError(errorMsg: string) {
    this.isLoading = false
    let alert = this.translate.instant(errorMsg);
    let notice = this.translate.instant('COMMON.NOTICE');
    this.commonService.alertMessage('error', notice, alert);
    // this.tableDataReload()
  }

  setUpCompany() {
    let companyName: string = '';
    let addressLine1: string = '';
    let addressLine2: string = '';
    let addressLine3: string = '';
    let telephone: string = '';
    let email: string = '';
    if (CommonFunctions.company != null) {
      companyName = CommonFunctions.company.name;
      addressLine1 = CommonFunctions.company.addressLine1;
      addressLine2 = CommonFunctions.company.addressLine2;
      addressLine3 = CommonFunctions.company.addressLine3;
      telephone = CommonFunctions.company.telephone;
      email = CommonFunctions.company.email;
    }
    return new Company(companyName, addressLine1, addressLine2, addressLine3, telephone, email);
  }

  // patchData() {
  //   setTimeout(() => {
  //     let date: any = CommonFunctions.formatDate(new Date());
  //     this.dataForm.patchValue({
  //       startDate:date,
  //       endDate: date
  //     });
  //     this.getData();
  //   }, 50);
  // }


  getPrint(data: any) {
    this.isLoading = true;
    this.dataService.getSelectedInvoiceDetails(data.id)
      .subscribe(
        {
          next: (response: any) => {
            if (response.status == 200) {
              PrintModule.printInvoice(data, response.result);
            }
            else (this.featchError('Featch Error'))
          },
          error: () => this.featchError('connection error try again later'),
          complete: () => this.isLoading = false
        }
      );
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
