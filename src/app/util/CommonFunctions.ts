import { FormControl, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";

export class CommonFunctions {
  static isDashboardVisible: boolean = true;

  //module access 
  static salesModuleAccess: boolean = false;
  static productionModuleAccess: boolean = false;
  static accountsModuleAccess: boolean = false;

  //user details
  static userName: any = '';
  static accountType: any = '';
  static clientId: string = '';
  static userImage: string = '';
  static sth: string;
  static stm: string;
  static eth: string;
  static etm: string;
  static cth: string;
  static ctm: string;

  static userPolicy: any[] = [];//user policy details
  static company: any = null; //company details
  static branchId: any = 0;

  //login status
  static isLoginPage: boolean = false;
  static loggedIn: boolean = false;

  static language = new Subject<string>();

  //language
  static browserLang: any = 'en';

  static menuAccess() {
    let access = true;
    //if (CommonFunctions.branchId == 1) { access = true; }
    return access;
  }

  static capitalize(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  static formatDate(date: any): any {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  static accessGrant(accessKey: number) {
    let status = false;
    // if (CommonFunctions.userPolicy.length > 0) {
    //   let filterPolicy: any[] = CommonFunctions.userPolicy.filter(policy => policy.policyId === accessKey);
    //   if (filterPolicy.length > 0) (status = true)
    // }
    if (CommonFunctions.branchId == 1) { status = true; }
    return status;
  }

  static trimFormValues(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control instanceof FormControl) {
        const value = control.value;
        if (typeof value === 'string') {
          const trimmedValue = value.trim();
          control.setValue(trimmedValue);
        }
      }
    });
  }

  static setValusToFrom(target: any, source: any) {
    for (let prop in source) {
      target[prop] = source[prop];
    }
  }

  static jacksNumberOutPut(jack: number) {
    let result = Math.round(jack * 100) / 100;
    return result;
  }

  static numberWithCommas(x:any) {
    let converted=x.toFixed(2);
    return converted.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  static jlanguageLabel(label: string) {
    let newLabel = 'En';
    if (label === 'si') {
      newLabel = 'සිං';
    }
    return newLabel;
  }

  static makeInvoiceNumber(invNo: any) {
    let invNumber = '0';

    let curSize: number = invNo.toString().length;
    if (curSize < 11) {


      let balance = 11 - curSize;

      for (let index = 0; index < balance; index++) {
        invNumber += '0';
      }

    }

    return invNumber + invNo;
  }


}
