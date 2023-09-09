import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
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
import { receiptService } from 'src/app/services/receipt.service';
import { CommonFunctions } from 'src/app/util/CommonFunctions';
import { PrintModule } from 'src/app/util/PrintModule';
import { Theme } from 'src/app/util/Theme';

@Component({
  selector: 'app-receipt-direct-pay',
  templateUrl: './receipt-direct-pay.component.html',
  styleUrls: ['./receipt-direct-pay.component.scss']
})
export class ReceiptDirectPayComponent {
  placeholderDay = this.formatDate(new Date());

  // displayedColumns = [
  //   'delete',
  //   'bank',
  //   'branch',
  //   'acountNumber',
  //   'chequeNo',
  //   'chequeDate',
  //   'amount'
  // ];

  // displayedColumnsOutstanding = [
  //   'invoicehGenId',
  //   'amount',
  //   'balance',
  //   'payment'
  // ];

  // selection = new SelectionModel<any>(false, []);


  myControl = new FormControl<string | any>('');
  filteredOptions!: Observable<any[]>;

  myControl2 = new FormControl<string | any>('');
  filteredOptions2!: Observable<any[]>;

  myControl3 = new FormControl<string | any>('');
  filteredOptions3!: Observable<any[]>;

  allData: any[] = [];
  allOutstanding: any[] = [];
  allOverPayments: any[] = [];
  bankList: any[] = [];

  allCustomers: any[] = [];

  allBanks: any[] = [];
  allBranches: any[] = [];
  allAccNo: any[] = [];


  @ViewChild('dt1') dt1: Table | undefined;
  @ViewChild('dt2') dt2: Table | undefined;
  @ViewChild(Table) table!: Table;
  // dataSource = new MatTableDataSource<any>();
  // dataSource2 = new MatTableDataSource<any>();

  items: any[] = [];
  // home: any;
  // theme = Theme;
  netTotal = 0;
  mcId = 0;
  cusId = 0;
  chequeEnable = 'no';
  chequeOptions: any[] = [];

  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataForm: any;
  chequeForm: any;
  errorMessage: any;
  isLoading: boolean = false;
  selectedBank: any;
  selectedBranch: any;
  selectedAccount: any;

  vatregisteredOptions: any[] = [{ value: true, name: 'yes' }, { value: false, name: 'no' }];

  // formHeaderTitle: string = 'Product';
  // formHeaderSubTitle: string = 'Please fill data ';
  // tableHeaderText: string = 'Product Details';
  languageSubcriber: any;

  constructor(
    private dataService: receiptService,
    private commonService: CommonService,
    public translate: TranslateService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private formBuilder: FormBuilder) {
    translate.setDefaultLang(CommonFunctions.browserLang);
    translate.use(CommonFunctions.browserLang);
    // this.setBreadCrumb();

    this.dataForm = this.formBuilder.group({
      customerId: new FormControl('', Validators.required),
      outstanding: new FormControl(''),
      cash: new FormControl('', Validators.required),
      cheque: new FormControl(''),
      allOverPayments: new FormControl(''),
      payOverPayment: new FormControl(''),
      chequeEnable: new FormControl('')
    });

    this.chequeForm = this.formBuilder.group({
      bank: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z]*$'), Validators.maxLength(30)])),
      branch: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z]*$'), Validators.maxLength(30)])),
      acountNumber: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9](?:[0-9-,/ ]*[0-9])?$')])),
      chequeDate: new FormControl('', Validators.required),
      chequeNo: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9]{6}?$'), Validators.maxLength(6), Validators.minLength(6)])),
      amount: new FormControl('', Validators.required)
    });

  }

  setOptions1() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.allBanks.slice();
      }),
    );
  }

  setOptions2() {
    this.filteredOptions2 = this.myControl2.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.allBranches.slice();
      }),
    );
  }

  setOptions3() {
    this.filteredOptions3 = this.myControl3.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.allAccNo.slice();
      }),
    );
  }

  displayFn(user: any): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.allBanks.filter(option => option.name.toLowerCase().includes(filterValue));
  }


  ngAfterViewInit() {
    // this.tableDataReload();
    this.table.reset();
  }

  // setBreadCrumb() {
  //   this.items = this.translate.instant('GRN.BREAD_CRUMB');
  //   this.translate.onLangChange.subscribe(() => {
  //     this.items = this.translate.instant('GRN.BREAD_CRUMB');
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
        this.items = this.translate.instant('GRN.BREAD_CRUMB');
      })

      this.test();
  }

  ngOnDestroy() {
    this.languageSubcriber.unsubscribe();
  }

  grantAccess(accesCode: number) // access grant
  {
    return true;
  }

  clearCartFeild() {
    setTimeout(() => {
     this.myControl.reset();
    }, 200);
  }

  addTocartData() {

    let bank: any = this.chequeForm.controls['bank'].value;
    let branch: any = this.chequeForm.controls['branch'].value;
    let acountNumber: any = this.chequeForm.controls['acountNumber'].value;
    let chequeNo: any = this.chequeForm.controls['chequeNo'].value;
    let chequeDate: any = this.formatDate(this.chequeForm.controls['chequeDate'].value);
    let today: any = this.formatDate(new Date());

    let amount: any = this.chequeForm.controls['amount'].value;
    let controller = (bank.toLowerCase()).trim() + "#" + (branch.toLowerCase()).trim() + "#" + acountNumber + "#" + chequeNo;

    if (amount > 0) {
      if (chequeDate > today) {
        this.isLoading = true;
        this.dataService.chequenumberAvailability(controller)
          .subscribe(
            {
              next: (response: any) => {
                if (response.status == 200) {

                  if (response.result) {

                    let filterData: any[] = this.allData
                      .filter(data => data.bank === (bank.toLowerCase()).trim() && data.branch === (branch.toLowerCase()).trim() && data.acountNumber === acountNumber && data.chequeNo === chequeNo)
                    if (filterData.length == 0) {

                      this.allData.push({
                        bank: (bank.toLowerCase()).trim(),
                        branch: (branch.toLowerCase()).trim(),
                        acountNumber: acountNumber,
                        chequeNo: chequeNo,
                        chequeDate: chequeDate,
                        controller: controller,
                        amount: amount
                      });

                      this.chequeForm.reset();
                      this.clearCartFeild();
                      // this.tableDataReload();
                      this.table.reset();
                      this.getTotalCheques();
                    } else {
                      this.commonService.alertMessage('warn','Notice','Data Already Exsist ');
                    }
                  } else {
                    this.commonService.alertMessage('warn','Notice','Data Already Exsist ');
                  }

                }
                else (this.featchError('Featch Error'))
              },
              error: () => this.featchError('connection error try again later'),
              complete: () => this.isLoading = false
            }
          );
      } else {
        this.commonService.alertMessage('warn','Notice','Invalid Cheque Date', );
      }

    } else {
      this.commonService.alertMessage('warn','Notice','Invalid Cheque Amount');
    }



  }

  payAmtChange(data: any) {

    let totalAmt = 0;
    let cashAmt: any = this.dataForm.controls['cash'].value;
    let chequeAmt: any = this.dataForm.controls['cheque'].value;
    let payOverPayment: any = this.dataForm.controls['payOverPayment'].value;

    if (cashAmt == '' || cashAmt == null || cashAmt == undefined) {
      cashAmt = 0;
    }

    if (chequeAmt == '' || chequeAmt == null || chequeAmt == undefined) {
      chequeAmt = 0;
    }

    if (payOverPayment == '' || payOverPayment == null || payOverPayment == undefined) {
      payOverPayment = 0;
    }

    totalAmt = cashAmt + chequeAmt + payOverPayment;
    let totalPaid = this.getTotalPaid();

    if (totalPaid > totalAmt) {
      data.payment = null;
      this.commonService.alertMessage('warn','Notice','Invalid pay amount');
      this.reloadOutstandings();
    }

  }

  reloadOutstandings() {

    let outlist: any[] = [];
    for (const dt of this.allOutstanding) {
      outlist.push({
        id: dt.id,
        amount: dt.amount,
        balance: dt.balance,
        payAmount: dt.payAmount,
        creditNote: dt.creditNote,
        debitNote: dt.debitNote,
        salesReturn: dt.salesReturn,
        returnCheques: dt.returnCheques,
        invoicehGenId: dt.invoicehGenId,
        invoicehId: dt.invoicehId,
        payment: dt.payment
      });
    }
    this.allOutstanding = [];
    this.allOutstanding = outlist;
    // this.tableDataReload();
    this.table.reset();

  }

  getTotalOutstanding() {
    return this.allOutstanding.reduce((accumulator, current) => {
      return accumulator + current.balance;
    }, 0);
  }

  getTotalOverPayments() {
    return this.allOverPayments.reduce((accumulator, current) => {
      return accumulator + current.cashOverPaymentBalance;
    }, 0);
  }

  getTotalCheques() {
    this.dataForm.patchValue({
      cheque:
        this.allData.reduce((accumulator, current) => {
          return accumulator + current.amount;
        }, 0)
    });
  }

  getTotalPaid() {
    return this.allOutstanding.reduce((accumulator, current) => {
      return accumulator + current.payment;
    }, 0);
  }

  getData() // Featch data
  {
    this.isLoading = true;
    this.dataService.getAllDependencies()
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

  removeData(cartObj: any) {
    let index = this.allData.indexOf(cartObj);
    if (index !== -1) {
      this.allData.splice(index, 1);
    }
    // this.tableDataReload();
    this.table.reset();
    this.getTotalCheques();

    for (const iterator of this.allOutstanding) {
      iterator.payment = null;
    }
    // this.tableDataReload();
    this.table.reset();
  }

  customerChange(data: any) {
    if (data != null) {
      this.isLoading = true;
      this.dataService.getOverpaymentAndOutstandings(data)
        .subscribe(
          {
            next: (response: any) => {
              if (response.status == 200) (this.addtoCart(response.result))
              else (this.featchError('Featch Error'))
            },
            error: () => this.featchError('connection error try again later'),
            complete: () => this.isLoading = false
          }
        );
    } else {
      this.dataForm.patchValue(
        { outstanding: null, allOverPayments: null, payOverPayment: 0 }
      );
    }
  }

  setBranches() {
    let filterBranches: any[] = this.bankList.filter(bk => bk.bank === this.selectedBank.name);
    for (const brnc of filterBranches) {
      let filterData: any[] = this.allBranches.filter(bk => bk.name === brnc.branch);
      if (filterData.length == 0) {
        this.allBranches.push({ id: 0, name: brnc.branch });
      }
    }
    this.setOptions2();
  }

  setAccountNumbers() {
    let filterBranches: any[] = this.bankList.filter(bk => bk.branch === this.selectedBranch.name && bk.bank === this.selectedBank.name);
    for (const brnc of filterBranches) {
      let filterData: any[] = this.allAccNo.filter(bk => bk.name === brnc.acountNumber);
      if (filterData.length == 0) {
        this.allAccNo.push({ id: 0, name: brnc.acountNumber });
      }
    }
    this.setOptions3();
  }


  bankChange() {
    let nunChecking = parseInt(this.selectedBank.id)
    if (!isNaN(nunChecking)) {
      this.setBranches();
      this.chequeForm.patchValue({ bank: this.selectedBank.name });
    } else {
      this.myControl2.reset();
      this.allBranches = [];
      this.chequeForm.patchValue({ bank: this.selectedBank });
    }
  }

  branchChange() {
    let nunChecking = parseInt(this.selectedBranch.id)
    if (!isNaN(nunChecking)) {
      this.chequeForm.patchValue({ branch: this.selectedBranch.name });
      this.setAccountNumbers();
    } else {
      this.myControl3.reset();
      this.allAccNo = [];
      this.chequeForm.patchValue({ branch: this.selectedBranch });
    }
  }

  accNoChange() {
    let nunChecking = parseInt(this.selectedAccount.id)
    if (!isNaN(nunChecking)) {
      this.chequeForm.patchValue({ acountNumber: this.selectedAccount.name });
    } else {
      this.chequeForm.patchValue({ acountNumber: this.selectedAccount });
    }
  }



  addtoCart(data: any) {
    this.allBanks = [];
    this.allOverPayments = data.data2;
    this.allOutstanding = data.data1;
    this.bankList = data.data3;
    for (const iterator of this.allOutstanding) {
      iterator.payment = null;
    }

    for (const blist of this.bankList) {
      let filterBanks: any[] = this.allBanks.filter(bk => bk.name === blist.bank)
      if (filterBanks.length == 0) {
        this.allBanks.push({ name: blist.bank, id: 0 });
      }
    }

    this.setOptions1();

    this.dataForm.patchValue({ outstanding: this.getTotalOutstanding() });
    this.dataForm.patchValue({ allOverPayments: this.getTotalOverPayments() });

    // this.tableDataReload();
    this.table.reset();
  }

  opChange() {
    let op: any = this.dataForm.controls['allOverPayments'].value;
    let payOp: any = this.dataForm.controls['payOverPayment'].value;
    let outs: any = this.dataForm.controls['outstanding'].value;


    if (op < payOp) {
      this.dataForm.patchValue({ payOverPayment: null });
      this.commonService.alertMessage('warn','Notice','Overpayment not enough' );
    }

    if (this.allOutstanding.length == 0) {
      this.dataForm.patchValue({ payOverPayment: null });
      this.commonService.alertMessage('warn', 'Notice','No Outstanding Found');
    }

    if (outs < payOp) {
      this.dataForm.patchValue({ payOverPayment: null });
      this.commonService.alertMessage('warn', 'Notice','Outstanding Amount Exceeded !');
    }

  }

  resultFeatch(result: any) {
    let mcList = result.data1;
    if (mcList.length > 0) {
      this.mcId = parseInt(mcList[0].id) + 1;
    } else {
      this.mcId = 1;
    }
    this.allCustomers.push({ name: 'Please Select Customer', id: null });
    this.allCustomers.push(...result.data2);

    this.chequeOptions.push(
      { name: 'No', id: 'no' },
      { name: 'Yes', id: 'yes' }
    );

  }

  // tableDataReload() {
  //   setTimeout(() => {
  //     this.dataSource = new MatTableDataSource(this.allData);
  //     this.dataSource2 = new MatTableDataSource(this.allOutstanding);
  //     this.dataSource2.paginator = this.paginator;
  //   }, 200);
  // }

  featchError(error: string) {
    this.isLoading = false;
    this.commonService.alertMessage('error',error ,'Warning');
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
  //   if (this.dataSource2.data.length != 0) {
  //     filterValue = filterValue.trim();
  //     filterValue = filterValue.toLowerCase();
  //     this.dataSource2.filter = filterValue;
  //   }
  // }

  // ----Transaction confirmation------

  saveConfirmation() {

    let cashAmt: any = this.dataForm.controls['cash'].value;
    let chequeAmt: any = this.dataForm.controls['cheque'].value;
    let overPay: any = this.dataForm.controls['payOverPayment'].value;

    if (cashAmt == undefined || cashAmt == null || cashAmt == "") {
      cashAmt = 0;
    }

    if (chequeAmt == undefined || chequeAmt == null || chequeAmt == "") {
      chequeAmt = 0;
    }

    if (overPay == undefined || overPay == null || overPay == "") {
      overPay = 0;
    }

    let toatlAmt = cashAmt + chequeAmt + overPay;

    if (toatlAmt > 0) {

      let filterData: any[] = this.allOutstanding.filter(dat => dat.payment > 0);
      if ((cashAmt + chequeAmt) == 0 && overPay > 0) {
        if (filterData.length > 0) {
          let confirmationText = this.translate.instant('COMMON.SAVE_CONFIRMATION');
          this.confirm(confirmationText, 1);
        } else {
          this.commonService.alertMessage('warn', 'Notice','Please Add Pay Amount');
        }
      } else {
        let confirmationText = this.translate.instant('COMMON.SAVE_CONFIRMATION');
        this.confirm(confirmationText, 1);
      }

    } else {
      this.commonService.alertMessage('warn', 'Notice','Please Add Pay Amount');
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
        this.saveData();
      }
    });
  }


  clearData() // Clear form 
  {
    this.dataForm.reset();
    // this.selection.clear();
    this.allData = [];
    this.allOutstanding = [];
    // this.tableDataReload();
    this.table.reset();

  }

  clearDataBank(){
    this.chequeForm.reset();
    this.myControl.reset();
    this.myControl2.reset();
    this.myControl3.reset();
  }

  cashAmountChange(event: any) {
    for (const iterator of this.allOutstanding) {
      iterator.payment = null;
    }
    // this.tableDataReload();
    this.table.reset();
  }

  clearDataSave() // Clear form after save
  {
    this.dataForm.patchValue({

    });
    // this.selection.clear();

    this.allData = [];
    // this.tableDataReload();
    this.table.reset();
  }

  saveData() {

    let detlist: any[] = [];
    let outstanding: any[] = [];
    let payByCashOverPayment: any[] = [];
    let overPayments = 0;

    let cashAmt: any = this.dataForm.controls['cash'].value;
    let chequeAmt: any = this.dataForm.controls['cheque'].value;
    let outs: any = this.dataForm.controls['outstanding'].value;
    let overPay: any = this.dataForm.controls['payOverPayment'].value;

    if (cashAmt == undefined || cashAmt == null || cashAmt == "") {
      cashAmt = 0;
    }

    if (chequeAmt == undefined || chequeAmt == null || chequeAmt == "") {
      chequeAmt = 0;
    }

    if (overPay == undefined || overPay == null || overPay == "") {
      overPay = 0;
    }

    let totalAmount = cashAmt + chequeAmt;
    let totPaid = this.getTotalPaid();
    let totalPayAmt = totPaid - overPay;
    if (totalPayAmt < 0) {
      totalPayAmt = 0;
    }
    let balance = outs - totPaid;

    let realOverPay = overPay;
    if (overPay > totPaid) {
      realOverPay = totPaid;
    }

    console.log('cashAmt ' + cashAmt);
    console.log('chequeAmt ' + chequeAmt);
    console.log('outs ' + outs);
    console.log('overPay ' + overPay);
    console.log('totalAmount ' + totalAmount);
    console.log('totPaid ' + totPaid);
    console.log('totalPayAmt ' + totalPayAmt);
    console.log('balance ' + balance);


    //calculating overpayment balances
    if (realOverPay > 0) {
      let remainingAmt = realOverPay;
      for (const opData of this.allOverPayments) {
        if (remainingAmt == 0) {
          break;
        } else {
          let lineBalance = opData.cashOverPaymentBalance;
          if (remainingAmt <= lineBalance)// line stock enough
          {
            opData.cashOverPaymentBalance = lineBalance - remainingAmt;
            payByCashOverPayment.push({
              overPaymentReceiptId: opData.id,
              payAmount: remainingAmt
            });
            remainingAmt = 0;
          } else {
            opData.cashOverPaymentBalance = remainingAmt - lineBalance;
            payByCashOverPayment.push({
              overPaymentReceiptId: opData.id,
              payAmount: lineBalance
            });
            remainingAmt = remainingAmt - lineBalance;
          }
        }
      }
    }

    if (totalPayAmt < totalAmount) {
      overPayments = totalAmount - totalPayAmt;
    }

    console.log('overPayments ' + overPayments);


    for (const detList of this.allOutstanding) {
      if (detList.payment != 0 && detList.payment != undefined && detList.payment != "" && detList.payment != null) {
        detlist.push(
          {
            receiptPaymentId: detList.id,
            payAmount: detList.payment
          }
        );
        outstanding.push({
          id: detList.id,
          payAmount: detList.payment,
          balance: detList.balance - detList.payment
        });
      }
    }

    let header = {
      outstanding: outs,
      cashPay: cashAmt + realOverPay,
      chequePay: chequeAmt,
      balance: balance,
      customerId: this.dataForm.controls['customerId'].value,
      chequeFullAmount: chequeAmt,
      cashOverPayment: overPayments,
      cashOverPaymentBalance: overPayments
    };

    let data = {
      mcId: this.mcId,
      header: header,
      det: detlist,
      chequeList: this.allData,
      outstanding: outstanding,
      opBalances: this.allOverPayments,
      payByCashOverPayment: payByCashOverPayment
    };

    //console.log('data ' + JSON.stringify(data));

    this.isLoading = true;
    this.dataService.receiptSave(data)
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
      let mcList = result.data1;
      if (mcList.length > 0) {
        this.mcId = parseInt(mcList[0].id) + 1;
      } else {
        this.mcId = 1;
      }
      alert = this.translate.instant('COMMON.SAVE_ALERT');
      this.printReceipt(result.data2, result.data3, result.data4);
      this.clearData();
      // this.tableDataReload();

      let notice = this.translate.instant('COMMON.NOTICE');
      this.commonService.alertMessage('success', notice,alert);
      this.table.reset();
    } else {
      this.transactionError('COMMON.ERROR_OTHER')
    }
  }

  printReceipt(header: any, details: any[], chequeList: any[]) {
    PrintModule.printReceipt(header, details, chequeList);
  }


  transactionError(errorMsg: string) {
    this.isLoading = false
    let alert = this.translate.instant(errorMsg);
    let notice = this.translate.instant('COMMON.NOTICE');
    this.commonService.alertMessage('warn', notice,alert);
    // this.tableDataReload();
    this.table.reset();
  }

  /* PRIME NG GLOBEL FILTER */
  applyFilterGlobal1($event: any, stringVal: string) {
    this.dt1!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  applyFilterGlobal2($event: any, stringVal: string) {
    this.dt2!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
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

  test(){
    setTimeout(() => {
      console.log(this.myControl);
      this.test();
    }, 4000);
  }
}
