import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/Common.service';
import { DialogConfim } from 'src/app/common-modules/pop-up-cards/pop-up-cards.component';
import { grnService } from 'src/app/services/grn.service';
import { invoiceService } from 'src/app/services/invoice.service';
import { CommonFunctions } from 'src/app/util/CommonFunctions';
import { Theme } from 'src/app/util/Theme';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PrintModule } from 'src/app/util/PrintModule';
import { Observable, map, startWith } from 'rxjs';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {
  // displayedColumns = [
  //   'delete',
  //   'product',
  //   'quantity', 'availableQty'];
  selection = new SelectionModel<any>(false, []);
  allData: any[] = [];

  allSuppliers: any[] = [];
  allcustomers: any[] = [];

  allProduct: any[] = [];
  avbQtyLoading = false;

  // dataSource = new MatTableDataSource<any>();
  items: any[] = [];
  // home: any;
  // theme = Theme;
  mcId: any = 0;
  netTotal = 0;
  proId = 0;
  selectedCustomer: any;

  @ViewChild('dt1') dt1: Table | undefined;
  @ViewChild(Table) table!: Table;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataForm1: any;
  dataForm: any;

  errorMessage: any;
  isLoading: boolean = false;
  vatregisteredOptions: any[] = [{ value: true, name: 'yes' }, { value: false, name: 'no' }];
  cusOption: any[] = [];

  // formHeaderTitle: string = 'Product';
  // formHeaderSubTitle: string = 'Please fill data ';
  // tableHeaderText: string = 'Product Details';
  languageSubcriber: any;

  myControl = new FormControl<string | any>('', Validators.required);
  filteredOptions!: Observable<any[]>;

  constructor(
    private dataService: invoiceService,
    private commonService: CommonService,
    public translate: TranslateService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder) {
    translate.setDefaultLang(CommonFunctions.browserLang);
    translate.use(CommonFunctions.browserLang);
    // this.setBreadCrumb();

    const initialFormState = {
      productId: '',
      availableQty: 0,
      quantity: '',
    };

    this.dataForm1 = this.formBuilder.group({
      cusName: new FormControl(''),
      address: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9#](?:[a-zA-Z0-9/:.,# ]*[a-zA-Z0-9,])?$'), Validators.maxLength(50)])),
      city: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9#](?:[a-zA-Z0-9/:.,# ]*[a-zA-Z0-9,])?$'), Validators.maxLength(50)])),
      seperateCash: new FormControl('', Validators.required),
      telephone: new FormControl('', Validators.compose([Validators.maxLength(10), Validators.minLength(10), Validators.required, Validators.pattern('^[0-9](?:[0-9-,/ ]*[0-9])?$')])),
    });

    this.dataForm = this.formBuilder.group({
      productId: new FormControl('', Validators.required),
      availableQty: new FormControl(''),
      quantity: new FormControl('', Validators.required)
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

  setOptions() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.allcustomers.slice();
      }),
    );
  }

  displayFn(user: any): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.allcustomers.filter(option => option.name.toLowerCase().includes(filterValue));
  }


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

    this.cusOption.push({ name: 'Select Type', id: null });
    this.cusOption.push({ name: 'Normal', id: false });
    this.cusOption.push({ name: 'Separate Cash', id: true });
  }

  customerChange() {
    let cusId = parseInt(this.selectedCustomer.id);
    if (!isNaN(cusId)) {
      this.dataForm1.patchValue(
        {
          cusName: this.selectedCustomer.name,
          telephone: this.selectedCustomer.telephone,
          seperateCash: this.selectedCustomer.seperateCash,
          address: this.selectedCustomer.address,
          city: this.selectedCustomer.city
        }
      );

    } else {
      this.dataForm1.patchValue(
        {
          cusName: this.selectedCustomer,
          telephone: null,
          seperateCash: 'false',
          address: null,
          city: null
        });
    }
  }

  ngOnDestroy() {
    this.languageSubcriber.unsubscribe();
  }

  grantAccess(accesCode: number) // access grant
  {
    return CommonFunctions.accessGrant(accesCode);
  }

  productChanged() {
    this.dataForm.patchValue({ availableQty: 0 });
    let proId = this.dataForm.controls['productId'].value
    if (proId != null && proId != undefined) {

      this.isLoading = true;
      this.dataService.productAvailability(proId)
        .subscribe(
          {
            next: (response: any) => {
              if (response.status == 200) {
                this.dataForm.patchValue({ availableQty: response.result });
              }
              else (this.featchError('Featch Error'))
            },
            error: () => this.featchError('connection error try again later'),
            complete: () => this.isLoading = false
          }
        );
    }

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

    let avbQty: any = this.dataForm.controls['availableQty'].value;
    let reqQty: any = this.dataForm.controls['quantity'].value;

    if (reqQty>0) {
      if (avbQty >= reqQty) {

        let obj: any = this.dataForm.value;
        obj.productName = this.getProductName(obj.productId);
        let filterArray: any = this.allData.filter(dat => dat.productId === obj.productId && dat.batchNumber === obj.batchNumber);
        if (filterArray.length == 0) {
          this.allData.push(obj);
          this.dataForm.reset();
        } else {
          this.commonService.alertMessage('warn','notice','Data already exist');
        }
        // this.tableDataReload();
        this.table.reset();
        this.calculateNetTotal();

      } else {
        this.commonService.alertMessage('warn','Notice','Stock Not Enough');
      }
    } else {
      this.commonService.alertMessage('warn','Notice','Invalid Quantity');
    }

  }

  calculateNetTotal() {
    this.netTotal = 0;
    for (const iterator of this.allData) {
      this.netTotal += (iterator.cost * iterator.currentQty);
    }
  }


  resultFeatch(result: any) {

    let mcList = result.data1;
    if (mcList.length > 0) {
      this.mcId = parseInt(mcList[0].id) + 1;
    } else {
      this.mcId = 1;
    }

    this.allcustomers = result.data3;
    this.setOptions();

    this.allProduct.push({ name: 'Please Select Product', id: null });
    this.allProduct.push(...result.data2);
  }

  // tableDataReload() {
  //   setTimeout(() => {
  //     this.dataSource = new MatTableDataSource(this.allData);
  //     this.dataSource.paginator = this.paginator;
  //   }, 200);
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
    let cusName = (this.dataForm1.controls['cusName'].value).trim();
    if (cusName.length > 0) {
      let confirmationText = this.translate.instant('COMMON.SAVE_CONFIRMATION');
      this.confirm(confirmationText, 1);
    } else {
      this.commonService.alertMessage('warn','Notice','Invalid Customer Name');
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

  clearData() // Clear form 
  {
    // this.myControl.setValue('');
    this.myControl.reset();
    this.dataForm1.reset();
    this.dataForm.reset();
    this.selection.clear();
    this.allData = [];
  }

  clearDataSave() // Clear form after save
  {
    this.selection.clear();
    this.allData = [];
    this.calculateNetTotal();

    setTimeout(() => {
      this.myControl.reset();
      this.dataForm1.reset();
      this.dataForm.reset();
    }, 300);
  }

  saveData() {

    let data = {
      mcId: this.mcId,
      netTotal: this.netTotal,
      cusName: (this.dataForm1.controls['cusName'].value).trim(),
      telephone: this.dataForm1.controls['telephone'].value,
      address: this.dataForm1.controls['address'].value,
      city: this.dataForm1.controls['city'].value,
      seperateCash: this.dataForm1.controls['seperateCash'].value,
      det: this.allData
    };

    this.isLoading = true;
    this.dataService.save(data)
      .subscribe(
        {
          next: (response: any) => {
            if (response.status == 200) (this.transactionComplete(response.result, 'saved'))
            else (this.transactionError('INVOICE.' + response.errDetail))
          },
          error: () => this.transactionError('COMMON.ERROR_OTHER'),
          complete: () => this.isLoading = false
        }
      );
  }

  transactionComplete(result: any, type: string) {
    this.clearDataSave();
    let alert = '';
    let mcList = result.mcList;
    if (mcList.length > 0) {
      this.mcId = parseInt(mcList[0].id) + 1;
    } else {
      this.mcId = 1;
    }

    this.allcustomers = result.cusList;
    this.setOptions();

    if (result.header != null) {

      PrintModule.printInvoice(result.header, result.det);
      alert = this.translate.instant('COMMON.SAVE_ALERT');
      let notice = this.translate.instant('COMMON.NOTICE');
      this.commonService.alertMessage('success',notice,alert);
    } else {
      this.transactionError('COMMON.ERROR_OTHER')
    }
  }

  transactionError(errorMsg: string) {
    this.clearDataSave();
    this.isLoading = false
    let alert = this.translate.instant(errorMsg);
    let notice = this.translate.instant('COMMON.NOTICE');
    this.commonService.alertMessage('error',notice,alert);
    // this.tableDataReload();
    this.table.reset();
  }

  /* PRIME NG GLOBEL FILTER */
  applyFilterGlobal($event: any, stringVal: string) {
    this.dt1!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
}
