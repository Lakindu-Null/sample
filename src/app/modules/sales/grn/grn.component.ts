import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'primeng/table';
import { Observable, map, startWith } from 'rxjs';
import { CommonService } from 'src/app/Common.service';
import { DialogConfim } from 'src/app/common-modules/pop-up-cards/pop-up-cards.component';
import { grnService } from 'src/app/services/grn.service';
import { CommonFunctions } from 'src/app/util/CommonFunctions';
import { PrintModule } from 'src/app/util/PrintModule';
import { Theme } from 'src/app/util/Theme';

@Component({
  selector: 'app-grn',
  templateUrl: './grn.component.html',
  styleUrls: ['./grn.component.scss']
})
export class GrnComponent {

  // displayedColumns = [
  //   'delete',
  //   'product',
  //   'currentQty',
  //   'cost'];
  // selection = new SelectionModel<any>(false, []);
  allData: any[] = [];

  allSuppliers: any[] = [];
  allProduct: any[] = [];
  selectedData: any;

  @ViewChild('dt1') dt1: Table | undefined;
  @ViewChild(Table) table!: Table;
  // dataSource = new MatTableDataSource<any>();
  items: any[] = [];
  home: any;
  theme = Theme;
  netTotal = 0;
  selectedSupplier: any;

  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataForm1: any;
  dataForm: any;

  errorMessage: any;
  isLoading: boolean = false;
  vatregisteredOptions: any[] = [{ value: true, name: 'yes' }, { value: false, name: 'no' }];

  // formHeaderTitle: string = 'Product';
  // formHeaderSubTitle: string = 'Please fill data ';
  // tableHeaderText: string = 'Product Details';
  languageSubcriber: any;

  myControl = new FormControl<string | any>('', Validators.required);
  filteredOptions!: Observable<any[]>;

  constructor(
    private dataService: grnService,
    private commonService: CommonService,
    public translate: TranslateService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder) {
    translate.setDefaultLang(CommonFunctions.browserLang);
    translate.use(CommonFunctions.browserLang);
    // this.setBreadCrumb();

    this.dataForm1 = this.formBuilder.group({
      supName: new FormControl('', Validators.required),
      supAddress: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9#](?:[a-zA-Z0-9/:.,# ]*[a-zA-Z0-9,])?$'), Validators.maxLength(30)])),
      supContact: new FormControl('', Validators.compose([Validators.pattern('^[0-9](?:[0-9-,/ ]*[0-9])?$'), Validators.maxLength(15), Validators.minLength(7)])),
      supInvoice: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9#](?:[a-zA-Z0-9/:.,# ]*[a-zA-Z0-9,])?$'), Validators.maxLength(30)])),
    });

    this.dataForm = this.formBuilder.group({
      productId: new FormControl('', Validators.required),
      currentQty: new FormControl('', Validators.required),
      cost: new FormControl('', Validators.required)
    });
  }

  // ngAfterViewInit() {
  //   this.tableDataReload();
  // }

  // setBreadCrumb() {
  //   this.items = this.translate.instant('GRN.BREAD_CRUMB');
  //   this.translate.onLangChange.subscribe(() => {
  //     this.items = this.translate.instant('GRN.BREAD_CRUMB');
  //   });
  // }

  ngOnInit(): void {
    CommonFunctions.isDashboardVisible = true;

    this.getData();
    this.home = { icon: 'pi pi-home', routerLink: '/dashBoard' };
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

  getData() // Featch data
  {
    this.isLoading = true;
    this.dataService.getAllDependancies()
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

  getProductName(productId: any) {
    let name = 'not available';
    let filterProduct: any = this.allProduct.filter(pr => pr.id == parseInt(productId))
    if (filterProduct.length > 0) {
      name = filterProduct[0].name;
    }
    return name;
  }

  removeData(cartObj: any) {
    let index = this.allData.indexOf(cartObj);
    if (index !== -1) {
      this.allData.splice(index, 1);
    }
    // this.tableDataReload();
    this.table.reset();
    this.calculateNetTotal();
  }

  addtoCart() {
    let obj: any = this.dataForm.value;

    if(obj.cost>0 && obj.currentQty>0){

    obj.productName = this.getProductName(obj.productId);
    let filterArray: any = this.allData.filter(dat => dat.productId === obj.productId);
    if (filterArray.length == 0) {
      this.allData.push(obj);
      this.dataForm.patchValue({
        currentQty: null,
        cost: null
      });
    } else {
      this.commonService.alertMessage('warn','notice','Data already exist');
    }
    // this.tableDataReload();
    this.dataForm.reset();
    this.table.reset();
    this.calculateNetTotal();
   }else {
    this.commonService.alertMessage('warn','notice','Invalid Cost Or Quantity');
  }


  }

  calculateNetTotal() {
    this.netTotal = 0;
    for (const iterator of this.allData) {
      this.netTotal += (iterator.cost * iterator.currentQty);
    }
  }

  resultFeatch(result: any) {
    this.allProduct.push({ name: 'Please Select Product', id: null });
    this.allSuppliers = result.data1;
    this.allProduct.push(...result.data2);
    this.setOptions();
  }

  supplierChange() {
    let cusId = parseInt(this.selectedSupplier.id);
    if (!isNaN(cusId)) {
      this.dataForm1.patchValue(
        {
          supName: this.selectedSupplier.name,
          supContact: this.selectedSupplier.telephone,
          supAddress: this.selectedSupplier.addressLine1,
        }
      );
    } else {
      this.dataForm1.patchValue(
        {
          supName: this.selectedSupplier,
          supContact: null,
          supAddress: null
        });
    }
  }

  setOptions() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.allSuppliers.slice();
      }),
    );
  }

  displayFn(user: any): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.allSuppliers.filter(option => option.name.toLowerCase().includes(filterValue));
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

    let supName = (this.dataForm1.controls['supName'].value).trim();
    if (supName.length > 0) {
      let confirmationText = this.translate.instant('COMMON.SAVE_CONFIRMATION');
      this.confirm(confirmationText, 1);
    } else {
      this.commonService.alertMessage('warn','Notice','Invalid Supplier Name');
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
        if (type == 1) (this.saveData())
        // if (type == 2) (this.upadetData())
        // if (type == 3) (this.deleteData())
      }
    });
  }

  saveData() {

    let header = {
      netTotal: this.netTotal,
      supInvoice: this.dataForm1.controls['supInvoice'].value
    };

    let data = {
      supName: (this.dataForm1.controls['supName'].value).trim(),
      supAddress: this.dataForm1.controls['supAddress'].value,
      supContact: this.dataForm1.controls['supContact'].value,
      header: header,
      det: this.allData
    };

    this.isLoading = true;
    this.dataService.save(data)
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
      alert = this.translate.instant('COMMON.SAVE_ALERT');
      this.allSuppliers = result.data1;
      this.setOptions();
      this.clearDataSave();
      let notice = this.translate.instant('COMMON.NOTICE');
      this.commonService.alertMessage('success',notice,alert);
      PrintModule.printGrn(result.data2, result.data3);
    } else {
      this.transactionError('COMMON.ERROR_OTHER')
    }
  }

  transactionError(errorMsg: string) {
    this.isLoading = false
    let alert = this.translate.instant(errorMsg);
    let notice = this.translate.instant('COMMON.NOTICE');
    this.commonService.alertMessage('error',notice,alert);
    // this.tableDataReload()
    this.table.reset();
  }

  /* PRIME NG GLOBEL FILTER */
  applyFilterGlobal($event: any, stringVal: string) {
    this.dt1!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  /* CLEAR FORM DATA */
  clearData() {
    this.myControl.reset();
    this.dataForm1.reset();
    this.dataForm.reset();
    this.selectedData = undefined;
  }

  /* CLEAR FORM DATA AFTER SAVE */
  clearDataSave() {

    setTimeout(() => {
      this.myControl.reset();
      this.dataForm1.reset();
      this.dataForm.reset();
    }, 300);

    this.selectedData = undefined;
    this.allData = [];
    // this.tableDataReload();
    this.calculateNetTotal();
  }
}
