import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Color } from 'jspdf-autotable';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CommonService } from 'src/app/Common.service';
import { DialogConfim } from 'src/app/common-modules/pop-up-cards/pop-up-cards.component';
import { activeData } from 'src/app/common-modules/sidenav/active-data';
import { CompanyService } from 'src/app/services/company.service';
import { CommonFunctions } from 'src/app/util/CommonFunctions';
import { Theme } from 'src/app/util/Theme';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent {
  // displayedColumns = ['select','name', 'telephone', 'email'];
  // selection = new SelectionModel<any>(false, []);
  allData: Color[] = [];
  // dataSource = new MatTableDataSource<any>();
  items: any[] = [];
  // home: any;
  // theme = Theme;
  selectedData: any;

  @ViewChild('dt1') dt1: Table | undefined;
  @ViewChild(Table) table!: Table;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataForm: any;
  errorMessage: any;
  isLoading: boolean = false;
  vatregisteredOptions: any[] = [{ value: true, name: 'yes' }, { value: false, name: 'no' }];

  formHeaderTitle: string = 'StoreType';
  formHeaderSubTitle: string = 'Please fill data ';
  tableHeaderText: string = 'StoreType Details';
  languageSubcriber: any;

  constructor(
    private dataService: CompanyService,
    private commonService: CommonService,
    public translate: TranslateService,
    private messageService: MessageService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder) {
    translate.setDefaultLang(CommonFunctions.browserLang);
    translate.use(CommonFunctions.browserLang);
    this.setBreadCrumb();

    this.dataForm = this.formBuilder.group({
      id: new FormControl('0'),
      name: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9#](?:[a-zA-Z0-9/:.@,# ]*[a-zA-Z0-9,])?$'), Validators.minLength(3), Validators.maxLength(30)])),
      addressLine1: new FormControl('', Validators.required),
      addressLine2: new FormControl('', Validators.required),
      addressLine3: new FormControl('', Validators.required),
      telephone: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  // ngAfterViewInit() {
  //   this.tableDataReload();
  // }

  setBreadCrumb() {
    this.items = this.translate.instant('COLOR.BREAD_CRUMB');
    this.translate.onLangChange.subscribe(() => {
      this.items = this.translate.instant('COLOR.BREAD_CRUMB');
    });
  }

  ngOnInit(): void {
    CommonFunctions.isDashboardVisible = true;
    this.getData();
    // this.home = { icon: 'pi pi-home', routerLink: '/dashBoard' };
    this.languageSubcriber = CommonFunctions.language
      .pipe()
      .subscribe(value => {
        this.translate.use(value);
        this.items = this.translate.instant('COLOR.BREAD_CRUMB');
      })

    // const route = this.router.url;
    // const activeParentId = Number(localStorage.getItem("active-nav-id"));
    // for (const data of activeData) {
    //   if (data.parentId === activeParentId) this.breadcrumbs = data.routeLink + route;
    // }
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
    this.isLoading = true;
    this.dataService.getData()
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

  resultFeatch(result: Color[]) {
    this.allData = result;
    // this.tableDataReload();
  }

  // tableDataReload() {
  //   setTimeout(() => {
  //     this.dataSource = new MatTableDataSource(this.allData);
  //     this.dataSource.paginator = this.paginator;
  //   }, 500);
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
  //   else {
  //     this.dataForm.reset();
  //   }
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

  show() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
  }

  saveConfirmation() {
    let confirmationText = this.translate.instant('COMMON.SAVE_CONFIRMATION');
    this.confirm(confirmationText, 1);
  }

  updateConfirmation() {
    let confirmationText = this.translate.instant('COMMON.UPDATE_CONFIRMATION');
    this.confirm(confirmationText, 2);
  }

  deleteConfirmation() {
    let confirmationText = this.translate.instant('COMMON.DELETE_CONFIRMATION');
    this.confirm(confirmationText, 3);
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
        this.upadetData();
      }
    });
  }

  // ----final crud transactions ---- 
  upadetData() {
    this.isLoading = true;
    CommonFunctions.trimFormValues(this.dataForm)
    this.dataService.update(this.dataForm.value)
      .subscribe(
        {
          next: (response: any) => {
            if (response.status == 200) (this.transactionComplete(response.result, 'updated'))
            else (this.transactionError('COLOR.' + response.errDetail))
          },
          error: () => this.transactionError('COMMON.ERROR_OTHER'),
          complete: () => this.isLoading = false
        }
      );
  }

  transactionComplete(result: any, type: string) {
    let alert = 'Data Updated';
    if (result != null) {
      this.allData = result;
      this.clearData();
      // this.tableDataReload();
      let notice = this.translate.instant('COMMON.NOTICE');
      console.log('called');
      
      this.commonService.alertMessage('success', notice, alert);
      this.table.reset();
    } else {
      this.transactionError('COMMON.ERROR_OTHER')
    }
  }

  transactionError(errorMsg: string) {
    this.isLoading = false
    let alert = this.translate.instant(errorMsg);
    let notice = this.translate.instant('COMMON.NOTICE');
    console.log('warn');
    
    this.commonService.alertMessage('warn', notice, alert);
    // this.tableDataReload()
    this.table.reset();
  }

  /* PRIME NG GLOBEL FILTER */
  applyFilterGlobal($event: any, stringVal: string) {
    this.dt1!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  /* WHEN ROW SELECT AND UNSELECT */
  onRowSelect(event: any) {
    this.dataForm.setValue({
      id: event.data.id,
      name: event.data.name,
      addressLine1: event.data.addressLine1,
      addressLine2: event.data.addressLine2,
      addressLine3: event.data.addressLine3,
      telephone: event.data.telephone,
      email: event.data.email
    });
  }

  onRowUnselect(event: any) {
    this.clearData();
  }


  /* CLEAR FORM DATA */
  clearData() {
    this.dataForm.reset();
    this.selectedData = undefined;
  }
}
