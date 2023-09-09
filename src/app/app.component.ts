import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from './TokenStorage.service';
import { CommonFunctions } from './util/CommonFunctions';
import { Authenticatorservice } from './auth/services/authentication.service';
import jwt_decode from 'jwt-decode';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Uniro-SaaS-Project';
  isLoading = true;

  constructor(
    private tokenStorage: TokenStorageService,
    private authenticateService: Authenticatorservice,
    public router: Router
  ) { }

  ngOnInit() {
    this.checkingToken();
  }

  isLoggedIn() {
    return CommonFunctions.loggedIn;
  }

  checkingToken() {
    if (this.isAccessTokenValid() && this.isRefreshTokenValid())(this.getUserSession())
    else {
      this.isLoading = false;
      this.router.navigateByUrl('auth/login')
    }
  }

  getUserSession() {
    this.isLoading = true;
    this.authenticateService.getUserSession()
      .subscribe(
        {
          next: (response: any) => {
            if (response.status == 200) (this.userAuhrnticated(response.result))
            else (this.authenticateError())
          },
          error: () => this.authenticateError()
        }
      );
  }

  userAuhrnticated(result: any) {
    if (result.status) {
      this.setupClientAndUser();
      CommonFunctions.userPolicy=result.policy;
      CommonFunctions.accountType=result.userType;
      CommonFunctions.loggedIn = true;
      CommonFunctions.branchId=result.branchId;
      CommonFunctions.company=result.company;      
      this.isLoading = false;
    } else {
      this.isLoading = false
      this.router.navigateByUrl('auth/login');
    }
  }

  setupClientAndUser() {
    let token: any = this.tokenStorage.getToken();
    if (token) {
      let decodedToken: any = jwt_decode(token);
      CommonFunctions.userName=decodedToken.sub;
    }
  }

  authenticateError() {
    this.tokenStorage.signOut();
    this.router.navigateByUrl('auth/login');
    CommonFunctions.loggedIn = false;
    this.isLoading = false;
  }

  isAccessTokenValid(): boolean {
    let status = true;
    let token = this.tokenStorage.getToken();
    if (token === null || token === undefined || token === '') (status = false)
    return status;
  }

  isRefreshTokenValid(): boolean {
    let status = true;
    let token = this.tokenStorage.getRefreshToken();
    if (token === null || token === undefined || token === '') (status = false)
    return status;
  }


  isSideNavCollapsed = false;
  screenWidth = 0;

  isDashboardVisible() {
    return CommonFunctions.isDashboardVisible;
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
