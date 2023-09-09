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
import { ReportsService } from 'src/app/services/reports.service';
import { CommonFunctions } from 'src/app/util/CommonFunctions';
import { Theme } from 'src/app/util/Theme';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent {
  // displayedColumns = [
  //   'product',
  //   'saleQty',
  //   'invoices',
  //   'retQty',
  //   'salesReturn',
  //   'netSale',
  //   'profit'
  // ];

  // selection = new SelectionModel<any>(false, []);
  allData: any[] = [];

  allColors: any[] = [];
  allCategories: any[] = [];
  allVolumeTypes: any[] = [];

  netSale = 0;
  netProfit = 0;

  // dataSource = new MatTableDataSource<any>();
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

  formHeaderTitle: string = 'Product';
  formHeaderSubTitle: string = 'Please fill data ';
  tableHeaderText: string = 'Product Details';
  languageSubcriber: any;

  constructor(
    private dataService: ReportsService,
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
    this.dataService.salesReportDetails(sd, ed)
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


  calculateInvoiceSale(data: any[]): number {
    return data.reduce((accumulator: any, current: any) => {
      return accumulator + current.value;
    }, 0)
  }

  calculateInvoiceCost(data: any): number {
    return data.reduce((accumulator: any, current: any) => {
      return accumulator + (current.cost * current.quantity);
    }, 0)
  }

  calculateSalesReturn(data: any): number {
    return data.reduce((accumulator: any, current: any) => {
      return accumulator + current.value;
    }, 0)
  }

  calculateSalesReturnCost(data: any): number {
    return data.reduce((accumulator: any, current: any) => {
      return accumulator + (current.invoiceDCost * current.quantity);
    }, 0)
  }

  calculateSaleQty(data: any[]): number {
    return data.reduce((accumulator: any, current: any) => {
      return accumulator + current.quantity;
    }, 0)
  }

  calculateReturnQty(data: any[]): number {
    return data.reduce((accumulator: any, current: any) => {
      return accumulator + current.quantity;
    }, 0)
  }

  resultFeatch(result: any) {

    this.allData = [];
    this.netSale = 0;
    this.netProfit = 0;

    let totalSale = 0;
    let totalSalesReturn = 0;
    let totalInvoiceCost = 0;
    let totalSalesReturnCost = 0;
    let totalProfit = 0;

    let nonRepeateItems: any[] = [];
    let invList: any[] = result.data1;
    let salesReturnList: any[] = result.data2;

    invList.forEach(element1 => {
      totalSale += element1.value;
      totalInvoiceCost += (element1.cost * element1.quantity);
      let filterItems: any[] = nonRepeateItems.filter(dat => dat.id == element1.productId);
      if (filterItems.length == 0) {
        nonRepeateItems.push({ id: element1.productId, name: element1.productName });
      }
    });

    salesReturnList.forEach(element2 => {
      totalSalesReturn += element2.value;
      totalSalesReturnCost += (element2.invoiceDCost * element2.quantity);
      let filterItems: any[] = nonRepeateItems.filter(dat => dat.id == element2.invoiceDProductId);
      if (filterItems.length == 0) {
        nonRepeateItems.push({ id: element2.invoiceDProductId, name: element2.invoiceDProductName });
      }
    });

    totalProfit = (totalSale - totalInvoiceCost) - (totalSalesReturn - totalSalesReturnCost);

    nonRepeateItems.forEach(element => {


      let itemsInvoices: any[] = invList.filter(inv => inv.productId === element.id);
      let itemsSalesReturn: any[] = salesReturnList.filter(inv => inv.invoiceDProductId === element.id);

      let saleQty = this.calculateSaleQty(itemsInvoices);
      let retQty = this.calculateReturnQty(itemsSalesReturn);
      let invoices: number = this.calculateInvoiceSale(itemsInvoices);
      let invoiceCost: number = this.calculateInvoiceCost(itemsInvoices);
      let salesReturn: number = this.calculateSalesReturn(itemsSalesReturn);
      let salesReturnCost: number = this.calculateSalesReturnCost(itemsSalesReturn);
      let profit = (invoices - invoiceCost) - (salesReturn - salesReturnCost);

      this.netSale += (invoices - salesReturn);
      this.netProfit += profit;

      let salePre = ((invoices / totalSale) * 100).toFixed(1);
      let saleReturnPre = ((salesReturn / totalSalesReturn) * 100).toFixed(1);
      let profitPre = ((profit / totalProfit) * 100).toFixed(1);

      this.allData.push({
        product: element.name,
        saleQty: saleQty,
        retQty: retQty,
        invoices: CommonFunctions.numberWithCommas(invoices),
        salesReturn: CommonFunctions.numberWithCommas(salesReturn),
        netSale: CommonFunctions.numberWithCommas(invoices - salesReturn),
        profit: CommonFunctions.numberWithCommas(profit),
        salePre: salePre,
        saleReturnPre: saleReturnPre,
        profitPre: profitPre
      });
    });

    this.netSale = CommonFunctions.numberWithCommas(this.netSale);
    this.netProfit = CommonFunctions.numberWithCommas(this.netProfit);

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


  clearData() // Clear form 
  {
    this.dataForm.reset();
    this.table.reset();
    this.allData = [];
    // this.selection.clear();
  }

  // clearDataSave() // Clear form after save
  // {
  //   this.selection.clear();
  // }


  transactionError(errorMsg: string) {
    this.isLoading = false
    let alert = this.translate.instant(errorMsg);
    let notice = this.translate.instant('COMMON.NOTICE');
    this.commonService.alertMessage('warn', notice, alert);
    // this.tableDataReload()
  }


  // patchData() {
  //   setTimeout(() => {
  //     let date: any = CommonFunctions.formatDate(new Date());
  //     this.dataForm.patchValue({
  //       startDate: date,
  //       endDate: date
  //     });
  //     this.getData();
  //   }, 50);
  // }

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

