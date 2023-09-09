import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'primeng/table';
import { CommonService } from 'src/app/Common.service';
import { DialogConfim } from 'src/app/common-modules/pop-up-cards/pop-up-cards.component';
import { grnService } from 'src/app/services/grn.service';
import { stockService } from 'src/app/services/stock.service';
import { CommonFunctions } from 'src/app/util/CommonFunctions';
import { Theme } from 'src/app/util/Theme';

@Component({
  selector: 'app-current-stock',
  templateUrl: './current-stock.component.html',
  styleUrls: ['./current-stock.component.scss']
})
export class CurrentStockComponent {

  // displayedColumns = [
  //   'product',
  //   'currentQty'
  // ];

  // selection = new SelectionModel<any>(false, []);
  allData: any[] = [];

  // dataSource = new MatTableDataSource<any>();
  items: any[] = [];
  // home: any;
  // theme = Theme;
  netTotal = 0;

  @ViewChild('dt1') dt1: Table | undefined;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  errorMessage: any;
  isLoading: boolean = false;
  vatregisteredOptions: any[] = [{ value: true, name: 'yes' }, { value: false, name: 'no' }];

  formHeaderTitle: string = 'Product';
  formHeaderSubTitle: string = 'Please fill data ';
  tableHeaderText: string = 'Product Details';
  languageSubcriber: any;

  constructor(
    private dataService: stockService,
    private commonService: CommonService,
    public translate: TranslateService,
    private dialog: MatDialog) {
    translate.setDefaultLang(CommonFunctions.browserLang);
    translate.use(CommonFunctions.browserLang);
    this.setBreadCrumb();
  }


  // ngAfterViewInit() {
  //   this.tableDataReload();
  // }


  setBreadCrumb() {
    this.items = this.translate.instant('CURRENT_STOCK.BREAD_CRUMB');
    this.translate.onLangChange.subscribe(() => {
      this.items = this.translate.instant('CURRENT_STOCK.BREAD_CRUMB');
    });
  }

  ngOnInit(): void {
    CommonFunctions.isDashboardVisible = true;

    // this.home = { icon: 'pi pi-home', routerLink: '/dashBoard' };
    this.languageSubcriber = CommonFunctions.language
      .pipe()
      .subscribe(value => {
        this.translate.use(value);
        this.items = this.translate.instant('CURRENT_STOCK.BREAD_CRUMB');
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
    console.log('cstk ');

    this.isLoading = true;
    this.dataService.getCurrentStock()
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
    if (result != null) {
      this.allData = [];
      for (const iterator of result) {
        let filterStock: any[] = this.allData.filter(dat => dat.productId === iterator.productId);
        if (filterStock.length == 0) {
          this.allData.push(iterator);
        } else {
          filterStock[0].currentQty += iterator.currentQty;
        }
      }
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
    this.commonService.alertMessage('error', error, 'Error');
  }



  // tableFilter(event: any) //Table filter
  // {
  //   let filterValue = event.target.value;
  //   if (this.dataSource.data.length != 0) {
  //     filterValue = filterValue.trim();
  //     filterValue = filterValue.toLowerCase();
  //     this.dataSource.filter = filterValue;
  //   }
  // }

  /* PRIME NG GLOBEL FILTER */
  applyFilterGlobal($event: any, stringVal: string) {
    this.dt1!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
}
