import { Component } from '@angular/core';
import { CommonFunctions } from 'src/app/util/CommonFunctions';
import { Authenticatorservice } from '../services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/Common.service';
import { Theme } from 'src/app/util/Theme';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {

  dataForm: any;
  commonFunctions = CommonFunctions;
  isLoading = false;
  items: any[] = [];
  // home: any;
  // theme = Theme;
  languageSubcriber: any;

  constructor(
    private dataService: Authenticatorservice,
    private commonService: CommonService,
    public translate: TranslateService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder) {
    translate.setDefaultLang(CommonFunctions.browserLang);
    translate.use(CommonFunctions.browserLang);
    // this.setBreadCrumb();

    this.dataForm = this.formBuilder.group({
      newPwd: new FormControl('', Validators.required),
      oldPwd: new FormControl('', Validators.required)
    });
  }


  ngOnInit(): void {
    CommonFunctions.isDashboardVisible = true;
    
    // this.home = { icon: 'pi pi-home', routerLink: '/setup/company' };
    this.languageSubcriber = CommonFunctions.language
      .pipe()
      .subscribe(value => {
        this.translate.use(value);
        this.items = this.translate.instant('USER_PROFILE.BREAD_CRUMB');
      })
  }

  substringUserName(userName: any) {
    let nameLength = userName.length;
    if (nameLength > 13) {
      userName = userName.substring(0, 13);
    }
    return userName;
  }

  updatePassword() // Featch data
  {
    this.isLoading = true;
    this.dataService.passwordUpdate(this.dataForm.value)
      .subscribe(
        {
          next: (response: any) => {
            if (response.status == 200) {
              if (response.result) {
                this.commonService.alertMessage('success','Notice','Password Updated');
                this.dataForm.reset();
              } else {
                this.dataForm.reset();
                this.commonService.alertMessage('error','Incorrect old Password','Notice');
              }
            }
          },
          error: () => this.featchError('connection error try again later'),
          complete: () => this.isLoading = false
        }
      );
  }


  featchError(error: string) {
    this.isLoading = false;
    this.commonService.alertMessage('error',error,'Error');
  }

  setBreadCrumb() {
    this.items = this.translate.instant('USER_PROFILE.BREAD_CRUMB');
    this.translate.onLangChange.subscribe(() => {
      this.items = this.translate.instant('USER_PROFILE.BREAD_CRUMB');
    });
  }

  /* CLEAR FORM */
  clearData() {
    this.dataForm.reset();
  }

}
