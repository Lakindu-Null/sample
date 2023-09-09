import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommonService } from 'src/app/Common.service';
import { DialogConfim } from 'src/app/common-modules/pop-up-cards/pop-up-cards.component';
import { Company } from 'src/app/models/Company';
import { productService } from 'src/app/services/product.service';
import { CommonFunctions } from 'src/app/util/CommonFunctions';
import { Theme } from 'src/app/util/Theme';

@Component({
  selector: 'app-product-points',
  templateUrl: './product-points.component.html',
  styleUrls: ['./product-points.component.scss']
})
export class ProductPointsComponent {

  displayedColumns = [
    'name',
    'category',
    'color',
    'volume',
    'mrp',
    'discount',
    'pointPre'];
  selection = new SelectionModel<any>(false, []);
  allData: any[] = [];
  allProducts: any[] = [];
  tempList: any[] = [];

  dataBulk:any;

  allColors: any[] = [];
  allCategories: any[] = [];
  allVolumeTypes: any[] = [];

  dataSource = new MatTableDataSource<any>();
  items: any[] = [];
  home: any;
  colorId: any;
  catId: any;
  theme = Theme;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  errorMessage: any;
  isLoading: boolean = false;
  vatregisteredOptions: any[] = [{ value: true, name: 'yes' }, { value: false, name: 'no' }];

  formHeaderTitle: string = 'Product';
  formHeaderSubTitle: string = 'Please fill data ';
  tableHeaderText: string = 'Product Details';
  languageSubcriber: any;

  constructor(
    private dataService: productService,
    private commonService: CommonService,
    public translate: TranslateService,
    private dialog: MatDialog) {
    translate.setDefaultLang(CommonFunctions.browserLang);
    translate.use(CommonFunctions.browserLang);
    this.setBreadCrumb();
  }

  dataForm = new FormGroup({
    categoryId: new FormControl('', Validators.required),
    points: new FormControl('', Validators.required),
    colorId: new FormControl('', Validators.required)
  });


  ngAfterViewInit() {
    this.tableDataReload();
  }

  setBreadCrumb() {
    this.items = this.translate.instant('PRODUCT.BREAD_CRUMB');
    this.translate.onLangChange.subscribe(() => {
      this.items = this.translate.instant('PRODUCT.BREAD_CRUMB');
    });
  }

  ngOnInit(): void {
    CommonFunctions.isDashboardVisible = true;
    
    this.getData();
    this.home = { icon: 'pi pi-home', routerLink: '/dashBoard' };
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
    return CommonFunctions.accessGrant(accesCode);
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

  categoryChange() {
    this.allColors = [];
    this.allColors.push({ name: 'All Colors', id: 0 });
    let filterProducts: any[] = this.allProducts.filter(pro => pro.categoryId === this.catId);
    for (const iterator of filterProducts) {
      let filterAvbColors: any[] = this.allColors.filter(col => col.id == iterator.colorId);
      if (filterAvbColors.length == 0) {
        this.allColors.push({ name: iterator.colorName, id: iterator.colorId });
      }
    }
    this.filterProduct();
  }

  filterProduct() {

    if (this.colorId == null || this.colorId == undefined) {
      this.colorId = 0;
    }

    if (this.catId == null || this.catId == undefined) {
      this.catId = 0;
    }

    if (this.colorId == 0 && this.catId == 0) {
      this.allData = this.allProducts;
    } else
      if (this.colorId == 0 && this.catId != 0) {
        let filterByColor: any[] = this.allProducts.filter(pro => pro.categoryId === parseInt(this.catId));
        this.allData = filterByColor;
      } else {
        let filterByColorAndCategory: any[] = this.allProducts.filter(pro => pro.categoryId === parseInt(this.catId) && pro.colorId === parseInt(this.colorId));
        this.allData = filterByColorAndCategory;
      }

    this.tableDataReload();
  }

  applyPre() {
    let pre = this.dataForm.controls['points'].value;
    if (pre != undefined && pre != null) {
      for (const iterator of this.allData) {
        iterator.pointPre = pre;
      }
    }
    this.tableDataReload();
  }

  resultFeatch(result: any) {

    this.dataBulk=result;

    this.allColors=[];
    this.allCategories=[];
    
    this.allColors.push({ name: 'All Colors', id: 0 });
    this.allCategories.push({ name: 'All Categories', id: 0 });

    this.allColors.push(...result.data1);
    this.allCategories.push(...result.data3);

    this.allProducts = result.data4;
    this.allData = result.data4;
    this.tempList = result.data4;
    this.tableDataReload();
  }

  tableDataReload() {
    setTimeout(() => {
      this.dataSource = new MatTableDataSource(this.allData);
      this.dataSource.paginator = this.paginator;
    }, 200);
  }

  featchError(error: string) {
    this.isLoading = false;
    this.commonService.alertMessage('error', 'Warning',error);
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

  // ----Transaction confirmation------

  saveConfirmation() {
    let confirmationText = this.translate.instant('COMMON.SAVE_CONFIRMATION');
    let filterUpdateList: any[] = this.allData.filter(dat => dat.pointPre != null && dat.pointPre != undefined);
    if (filterUpdateList.length > 0) {

      let dataList: any[] = [];
      for (const iterator of filterUpdateList) {
        dataList.push({ id: iterator.id, pointPre: iterator.pointPre });
      }

      this.confirm(confirmationText, dataList);
    } else {
      this.commonService.alertMessage('warn', 'Notice','No Changes Found');
    }
  }

  pointPreChange(data: any) {
    console.log('data ' + JSON.stringify(data));
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
        this.upadetData(data);
      }
    });
  }

  clearData() // Clear form 
  {
    
    this.dataForm.reset();
    this.selection.clear();
    this.getData();
  }

  // ----final crud transactions ---- 
  upadetData(data:any[]) {
    this.isLoading = true;
    this.dataService.updateProductPoints(data)
      .subscribe(
        {
          next: (response: any) => {
            if (response.status == 200) (this.transactionComplete(response.result))
            else (this.transactionError('PRODUCT.' + response.errDetail))
          },
          error: () => this.transactionError('COMMON.ERROR_OTHER'),
          complete: () => this.isLoading = false
        }
      );
  }

  transactionComplete(result: any) {

    this.dataForm.patchValue({points:null});
    this.allProducts = result;
    this.allData = result;
    this.tempList = result;
    this.catId=0;
    this.colorId = 0;
    this.tableDataReload();
  }

  transactionError(errorMsg: string) {
    this.isLoading = false
    let alert = this.translate.instant(errorMsg);
    let notice = this.translate.instant('COMMON.NOTICE');
    this.commonService.alertMessage('error', notice,alert);
    this.tableDataReload()
  }

}
