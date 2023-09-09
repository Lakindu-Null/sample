import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/Common.service';
import { CommonFunctions } from 'src/app/util/CommonFunctions';
import { TokenStorageService } from 'src/app/TokenStorage.service';
import { Authenticatorservice } from '../services/authentication.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: any;
  isLoading: boolean = false;

  constructor(
    private tokenStorage: TokenStorageService,
    private authenticateService: Authenticatorservice,
    private commonService: CommonService,
    public router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.logout();
    CommonFunctions.isDashboardVisible = false;
    CommonFunctions.loggedIn = false;
    CommonFunctions.isLoginPage = true;

    this.loginForm = this.formBuilder.group({
      tenantOrClientId: new FormControl(100, Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      checked: new FormControl(false, Validators.required)
    });
  }

  ngOnDestroy() {
    CommonFunctions.isLoginPage = false;
  }

  logout() {
    this.tokenStorage.signOut();
  }

  userLogin() {
    const formData = {
      tenantOrClientId: this.loginForm.value.tenantOrClientId,
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

    this.authenticateService.authenticate(formData)
      .subscribe(
        {
          next: (response: any) => {
            if (response.status == 200) (this.userAuhrnticated(response))
            else (this.authenticateError(response.errormsg))
          },
          error: () => this.authenticateError('Connection error try again'),
          complete: () => this.isLoading = false
        }
      );
  }

  userAuhrnticated(result: any) {
    if (result.userStatus) {
      
      this.tokenStorage.saveToken(result.accesstoken);
      this.tokenStorage.saveRefreshToken(result.refreshToken);
      this.setupClientAndUser();
      this.setUserDetails(result);
      localStorage.setItem("active-nav-id", "2");
      this.router.navigateByUrl('setup/company');
    } else {
      this.commonService.alertMessage('warn', 'Inactive User', "Warning");
    }
  }

  setupClientAndUser() {
    let token: any = this.tokenStorage.getToken();
    if (token) {
      let decodedToken: any = jwt_decode(token);
      CommonFunctions.userName=decodedToken.sub;
      console.log('userName '+CommonFunctions.userName);
    }
  }

  setUserDetails(result: any) {
    CommonFunctions.loggedIn = true;
    CommonFunctions.userPolicy=result.policy;
    CommonFunctions.branchId=result.branchId;
    CommonFunctions.accountType=result.userType;
    CommonFunctions.company=result.company;    
    console.log('br id '+CommonFunctions.branchId);
  }

  forgotPassword(){    
    // this.commonService.ErrorMessage("500");

    // this.commonService.ConfirmationMessage().then((status: boolean) => {
    //   console.log(status);
    // });
  }

  authenticateError(response: any) {
    this.isLoading = false;
    this.commonService.alertMessage('warn', response,'Warning');
  }
}
