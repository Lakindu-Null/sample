import { SelectionModel } from '@angular/cdk/collections';
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
import { productService } from 'src/app/services/product.service';
import { CommonFunctions } from 'src/app/util/CommonFunctions';
import { Theme } from 'src/app/util/Theme';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  // displayedColumns = [
  //   'select',
  //   'name',
  //   'category',
  //   'color',
  //   'volume',
  //   'mrp',
  //   'discount',
  //   'createdDate',
  //   'createdBy'];
  // selection = new SelectionModel<any>(false, []);
  allData: any[] = [];

  allColors: any[] = [];
  itemTypes: any[] = [];
  allCategories: any[] = [];
  allVolumeTypes: any[] = [];

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

  // formHeaderTitle: string = 'Product';
  // formHeaderSubTitle: string = 'Please fill data ';
  // tableHeaderText: string = 'Product Details';
  languageSubcriber: any;

  constructor(
    private dataService: productService,
    private commonService: CommonService,
    public translate: TranslateService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder) {
    translate.setDefaultLang(CommonFunctions.browserLang);
    translate.use(CommonFunctions.browserLang);
    // this.setBreadCrumb();

    this.dataForm = this.formBuilder.group({
      id: new FormControl('0'),
      name: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9#](?:[a-zA-Z0-9/:.@,# ]*[a-zA-Z0-9,])?$'),Validators.minLength(3),Validators.maxLength(30)])),
      mrp: new FormControl('', Validators.required),
      discount: new FormControl('', Validators.required),
      volume: new FormControl('', Validators.required),
      volumeTypeId: new FormControl('5', Validators.required),
      categoryId: new FormControl('', Validators.required),
      colorId: new FormControl('', Validators.required),
      productType: new FormControl('', Validators.required),
      image: new FormControl(''),
      active: new FormControl('')
    });
  }

  // ngAfterViewInit() {
  //   this.tableDataReload();
  // }

  // setBreadCrumb() {
  //   this.items = this.translate.instant('PRODUCT.BREAD_CRUMB');
  //   this.translate.onLangChange.subscribe(() => {
  //     this.items = this.translate.instant('PRODUCT.BREAD_CRUMB');
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
        this.items = this.translate.instant('PRODUCT.BREAD_CRUMB');
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

  resultFeatch(result: any) {
    this.itemTypes.push({ name: 'Please Select Item Type', id: null});
    this.itemTypes.push({ name: 'Finish Goods', id: 'fg'});
    this.itemTypes.push({ name: 'Raw Material', id: 'rm'});
    this.itemTypes.push({ name: 'Packing Material', id: 'pm'});
    this.itemTypes.push({ name: 'Receipe Item', id: 'ri'});

    this.allColors.push({ name: 'Please Select Color', id: null });
    this.allCategories.push({ name: 'Please Select Category', id: null });
    this.allColors.push(...result.data1);
    this.allVolumeTypes.push(...result.data2);
    this.allCategories.push(...result.data3);
    this.allData = result.data4;
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
            else (this.transactionError('PRODUCT.' + response.errDetail))
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
            else (this.transactionError('PRODUCT.' + response.errDetail))
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
            else (this.transactionError('PRODUCT.' + response.errDetail))
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
        this.clearDataSave();
      }

      else if (type === 'updated') {
        alert = this.translate.instant('COMMON.UPDATE_ALERT');
        let filter = this.allData.filter(data => data.id == this.selectedData.id)
        if (filter.length > 0) {
          CommonFunctions.setValusToFrom(filter[0], result);
        }
        this.clearData();
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
        this.clearData();
      } else {
        alert = this.translate.instant('COMMON.ERROR_ALERT');
        this.clearData();
      }

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
    this.commonService.alertMessage('error', notice,alert);
    this.table.reset();
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

  print() {

    //create print here 
    let company: Company = this.setUpCompany();
    const doc = new jsPDF();

    const col = ["Category", "Color", 'Name', 'MRP', 'Discount', 'Volume', "Created Date"];
    const rows = [];

    for (const data of this.allData) {
      const temp = [
        data.categoryName,
        data.colorName,
        data.name,
        data.mrp.toFixed(2),
        data.discount.toFixed(2),
        data.volume,
        data.createdDate + '\n' + '[ ' + data.createdBy + ' ]',
      ];
      rows.push(temp);
    }

    doc.setFont("Arial");
    doc.setFont("bold");
    doc.setFontSize(22);
    doc.text(company.name, 7, 10);
    doc.text("Products", 203, 20, { align: 'right' });

    doc.setFont("normal");
    doc.setFontSize(10);
    doc.text(company.addressLine1 + ' ' + company.addressLine2 + '' + company.addressLine3, 7, 20);
    doc.setFont("bold");
    doc.setFontSize(9);
    doc.text('Tel:' + company.telephone, 7, 25);
    doc.setFont("normal");
    doc.setFontSize(10);
    doc.text('Email:' + company.email, 7, 30);
    doc.setFont("bold");

    doc.setFont("normal");
    doc.setFont("bold");

    doc.setFontSize(9);
    doc.text('CREATED DATE ', 155, 30);
    doc.text(' :', 180, 30);
    doc.text(new Date().toDateString(), 183, 30);

    doc.text('CREATED BY', 155, 35);
    doc.text(' :', 180, 35);
    doc.text(CommonFunctions.userName, 180, 35);

    autoTable(doc, {
      head: [col],
      body: rows,
      headStyles: { fillColor: Theme.autoTableHeaderColor },
      columnStyles: {
        0: { fontSize: 8, fontStyle: 'bold' },
        1: { fontSize: 8, fontStyle: 'bold' },
        2: { fontSize: 8, fontStyle: 'bold' },
        3: { fontSize: 8, fontStyle: 'bold', halign: 'right' },
        4: { fontSize: 8, fontStyle: 'bold', halign: 'right' },
        5: { fontSize: 8, fontStyle: 'bold', halign: 'center' },
        6: { fontSize: 8, fontStyle: 'bold', halign: 'center' }
      },
      theme: 'striped',
      startY: 42,
      margin: 7,
      tableWidth: 198
    })

    doc.autoPrint();
    var oHiddFrame = document.createElement("iframe");
    oHiddFrame.style.position = "fixed";
    oHiddFrame.style.visibility = "hidden";
    oHiddFrame.src = doc.output('bloburl').toString();
    document.body.appendChild(oHiddFrame);

  }

  /* PRIME NG GLOBEL FILTER */
  applyFilterGlobal($event: any, stringVal: string) {
    this.dt1!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  /* WHEN ROW SELECT AND UNSELECT */
  onRowSelect(event: any){
    this.dataForm.setValue({
      id: event.data.id,
      name: event.data.name,
      mrp: event.data.mrp,
      discount: event.data.discount,
      volume: event.data.volume,
      volumeTypeId: event.data.volumeTypeId,
      categoryId: event.data.categoryId,
      colorId: event.data.colorId,
      productType: event.data.productType,
      image: event.data.image,
      active: event.data.active
    });
  }

  onRowUnselect(event: any) {
    this.clearData();
  }

  /* CLEAR FORM DATA */
  clearData(){
    this.dataForm.reset();
    this.selectedData = undefined;
  }

  clearDataSave(){
    this.dataForm.patchValue({ mrp: null, volume: null });
    this.selectedData = undefined;
  }
}
