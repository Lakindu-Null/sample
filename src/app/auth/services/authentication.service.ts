import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { environment } from "src/environments/environment";

const httpOptions = {
    headers: new HttpHeaders(
        {
            'Content-Type': 'application/json',
        }
    )
};


@Injectable()
export class Authenticatorservice {

    errorMessage: any;

    private authUrl = environment.baseUrl + 'auth/authenticate';
    private refreshtokenUrl = environment.baseUrl + 'auth/refreshtoken';
    private logoutUrl = environment.baseUrl + 'auth/logout';
    private getUserSessionUrl = environment.baseUrl + 'auth/getUserSession';
    private userRegisterEmailVerificationUrl = environment.baseUrl + 'users/userRegisterEmailVerification';
    private verificationCodeConfirmationUrl = environment.baseUrl + 'users/verificationCodeConfirmation';
    private fogotPasswordEmailVerificationUrl = environment.baseUrl + 'users/fogotPasswordEmailVerification';
    private changePasswordUrl = environment.baseUrl + 'users/changePassword';
    private userRegisterMobileOtpUrl = environment.baseUrl + 'users/userRegisterMobileOtp';
    private userRegisterUrl = environment.baseUrl + 'auth/userRegister';
    private registerUrl = environment.baseUrl + 'auth/userRegister';
    private userUpdateUrl = environment.baseUrl + 'auth/userUpdate';
    private userDeleteUrl = environment.baseUrl + 'auth/delete';
    private userGetallUrl = environment.baseUrl + 'auth/getAll';
    private passwordResetUrl = environment.baseUrl + 'auth/passwordReset';
    private passwordUpdateUrl = environment.baseUrl + 'auth/passwordUpdate';

 
    constructor(private http: HttpClient) 
    {

    }

    passwordReset(id:number): Observable<any> {
        let queryParams = new HttpParams()
        .append("id", id);
        return this.http.get(this.passwordResetUrl,{ params: queryParams });
    }

    passwordUpdate(data:any): Observable<any> {
        let queryParams = new HttpParams()
        .append("oldPwd", data.oldPwd).append("newPwd", data.newPwd);
        return this.http.get(this.passwordUpdateUrl,{ params: queryParams });
    }

    userGetall(): Observable<any> {
        return this.http.get(this.userGetallUrl);
    }

    userRegister(data: any): Observable<any> {
        return this.http.post(this.userRegisterUrl,data);
    }

    userUpdate(data: any): Observable<any> {
        return this.http.put(this.userUpdateUrl,data);
    }

    delete(id:number): Observable<any> {
        let queryParams = new HttpParams()
        .append("id", id);
        return this.http.delete(this.userDeleteUrl,{ params: queryParams });
    }

    userRegisterMobileOtp(telephone: string): Observable<any> {
        let queryParams = new HttpParams()
            .append("telephone", telephone);
        return this.http.get(this.userRegisterMobileOtpUrl, { params: queryParams });
    }

    changePassword(data: any) {
        return this.http.patch(this.changePasswordUrl, data, httpOptions);
    }

    fogotPasswordEmailVerification(email: string): Observable<any> {
        let queryParams = new HttpParams()
            .append("email", email);
        return this.http.get(this.fogotPasswordEmailVerificationUrl, { params: queryParams });
    }

    register(data: any) {
        return this.http.post(this.registerUrl, data);
    }

    verificationCodeConfirmation(referance: string, otp: any): Observable<any> {
        let queryParams = new HttpParams()
            .append("referance", referance)
            .append("otp", otp);
        return this.http.get(this.verificationCodeConfirmationUrl, { params: queryParams });
    }

    userRegisterEmailVerification(email: string): Observable<any> {
        let queryParams = new HttpParams()
            .append("email", email);
        return this.http.get(this.userRegisterEmailVerificationUrl, { params: queryParams });
    }

    getUserSession(): Observable<any> {
        return this.http.get(this.getUserSessionUrl);
    }

    authenticate(data: any) {
        return this.http.post(this.authUrl, data, httpOptions);
    }

    logOut(): Observable<any> {
        return this.http.get(this.logoutUrl);
    }

    refreshToken(token: string) {
        return this.http.post(this.refreshtokenUrl, {
            refreshToken: token
        },httpOptions);
    }

    userCreate(data: any) {
        return this.http.post(this.refreshtokenUrl, data, httpOptions);
    }

}