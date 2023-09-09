
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/TokenStorage.service';

@Injectable()
export class DashBoardAuthGuardService implements CanActivate {

    constructor(private router: Router, private tokenStorage: TokenStorageService) { }

    canActivate(): boolean {
        if ((this.isAccessTokenValid() && this.isRefreshTokenValid())) {
            return true;
        }
        this.router.navigateByUrl('/auth/login');
        return false;
    }

    // istokenValid() {
    //     let tokenValid = false;
    //     let token = this.tokenStorage.getToken();
    //     if (token) {
    //         const decoded: any = jwt_decode(token);
    //         const now = Date.now().valueOf() / 1000;
    //         if (!(typeof decoded.exp !== 'undefined' && decoded.exp < now)) {
    //             tokenValid = true;
    //         }
    //     }
    //     return tokenValid;
    // }

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

} 