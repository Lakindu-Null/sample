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
import { VolumeType } from 'src/app/models/VolumeType';
import { CategoryService } from 'src/app/services/category.service';
import { VolumeTypeService } from 'src/app/services/volumeType.service';
import { CommonFunctions } from 'src/app/util/CommonFunctions';
import { PrintModule } from 'src/app/util/PrintModule';
import { Theme } from 'src/app/util/Theme';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  // displayedColumns = ['select', 'name', 'createdDate', 'createdBy'];
  // selection = new SelectionModel<any>(false, []);
  allData: any[] = [];
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

  formHeaderTitle: string = 'Category';
  formHeaderSubTitle: string = 'Please fill data ';
  tableHeaderText: string = 'Category Details';
  languageSubcriber: any;

  constructor(
    private dataService: CategoryService,
    private commonService: CommonService,
    public translate: TranslateService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder) {
    translate.setDefaultLang(CommonFunctions.browserLang);
    translate.use(CommonFunctions.browserLang);
    // this.setBreadCrumb();

    this.dataForm = this.formBuilder.group({
      id: new FormControl('0'),
      name: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]*[a-zA-Z][a-zA-Z\s]*$/),Validators.minLength(2),Validators.maxLength(20)]))
    });
  }

  // ngAfterViewInit() {
  //   this.tableDataReload();
  // }

  setBreadCrumb() {
    this.items = this.translate.instant('CATEGORY.BREAD_CRUMB');
    this.translate.onLangChange.subscribe(() => {
      this.items = this.translate.instant('CATEGORY.BREAD_CRUMB');
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
        this.items = this.translate.instant('CATEGORY.BREAD_CRUMB');
      })
  }

  // ngOnDestroy() {
  //   this.languageSubcriber.unsubscribe();
  // }

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

  resultFeatch(result: VolumeType[]) {
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
    this.commonService.alertMessage('error',error,'Warning');
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
        if (type == 1) (this.saveData())
        if (type == 2) (this.upadetData())
        if (type == 3) (this.deleteData())
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
            else (this.transactionError('CATEGORY.'+response.errDetail))
          },
          error: () => this.transactionError('COMMON.ERROR_OTHER'),
          complete: () => this.isLoading = false
        }
      );
  }

  saveData() {
    this.isLoading = true;
    CommonFunctions.trimFormValues(this.dataForm)
    this.dataService.save(this.dataForm.value)
      .subscribe(
        {
          next: (response: any) => {
            if (response.status == 200) (this.transactionComplete(response.result, 'saved'))
            else (this.transactionError('CATEGORY.'+response.errDetail))
          },
          error: () => this.transactionError('COMMON.ERROR_OTHER'),
          complete: () => this.isLoading = false
        }
      );
  }

  deleteData() {
    this.isLoading = true;
    this.dataService.delete(this.selectedData.id)
      .subscribe(
        {
          next: (response: any) => {
            if (response.status == 200) (this.transactionComplete(response.result, 'deleted'))
            else (this.transactionError('CATEGORY.'+response.errDetail))
          },
          error: () => this.transactionError('COMMON.ERROR_OTHER'),
          complete: () => this.isLoading = false
        }
      );
  }

  transactionComplete(result: any, type: string) {
    let alert = '';

    if (result != null) {

      if (type === 'saved') {
        alert = this.translate.instant('COMMON.SAVE_ALERT');
        this.allData.push(result);
      }

      else if (type === 'updated') {
        alert = this.translate.instant('COMMON.UPDATE_ALERT');
        let filter = this.allData.filter(data => data.id == this.selectedData.id)
        if (filter.length > 0) {
          CommonFunctions.setValusToFrom(filter[0], result);
        }
      }

      else if (type === 'deleted' && result) {
        alert = this.translate.instant('COMMON.DELETE_ALERT');
        let filter = this.allData.filter(data => data.id == this.selectedData.id)
        if (filter.length > 0) {
          let index = this.allData.indexOf(filter[0]);
          if (index > -1) {
            this.allData.splice(index, 1);
          }
        }
      } else {
        alert = this.translate.instant('COMMON.ERROR_ALERT')
      }
      this.clearData();
      // this.tableDataReload();
    
      let notice = this.translate.instant('COMMON.NOTICE');
      this.commonService.alertMessage('success', notice,alert);
      this.table.reset();
    } else {
      this.transactionError('COMMON.ERROR_OTHER')
    }
  }

  transactionError(errorMsg: string) {
    this.isLoading = false
    let alert = this.translate.instant(errorMsg);
    let notice = this.translate.instant('COMMON.NOTICE');
    this.commonService.alertMessage('success', notice,alert);
    // this.tableDataReload()
    this.table.reset();
  }

  print() {
    const col = ["Category ID", "Category", "Created Date", "Created By"];
    const rows = [];
    for (const data of this.allData) {
      const temp = [
        "# " + data.id,
        data.name,
        data.createdDate,
        data.createdBy
      ];
      rows.push(temp);
    }
    new PrintModule().commonPrint(col, rows, 'Categories');
  }

  /* PRIME NG GLOBEL FILTER */
  applyFilterGlobal($event: any, stringVal: string) {
    this.dt1!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  /* WHEN ROW SELECT AND UNSELECT */
  onRowSelect(event: any){
    this.dataForm.setValue({
      id: event.data.id,
      name: event.data.name
    });
  }

  onRowUnselect(event: any) {
    this.clearData();
  }

  /* CLEAR FORM DATA */
  clearData(){
    this.dataForm.reset();
    // this.selection.clear();
    this.selectedData = undefined;
    this.dataForm.patchValue({ code: "#000000" })
  }
}
