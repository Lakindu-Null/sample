
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class CustomerPointService {

    errorMessage: any;
    private getCustomerListUrl = environment.baseUrl + 'sales/customerOtp/getCustomerList';
    private sendOtpUrl = environment.baseUrl + 'sales/customerOtp/sendOtp';
    private getCustomerPendingPointsUrl = environment.baseUrl + 'sales/customerOtp/getCustomerPendingPoints';
    private refundPointsUrl = environment.baseUrl + 'sales/customerOtp/refundPoints';
    private otpVerifyUrl = environment.baseUrl + 'sales/customerOtp/otpVerify';
    private customerRefundReprintUrl = environment.baseUrl + 'sales/customerOtp/customerRefundReprint';


    constructor(private http: HttpClient) {

    }

    getCustomerList(): Observable<any> {
        return this.http.get(this.getCustomerListUrl);
    }

    sendOtp(id: number): Observable<any> {
        let queryParams = new HttpParams()
            .append("id", id);
        return this.http.get(this.sendOtpUrl, { params: queryParams });
    }

    getCustomerPendingPoints(id: number): Observable<any> {
        let queryParams = new HttpParams()
            .append("id", id);
        return this.http.get(this.getCustomerPendingPointsUrl, { params: queryParams });
    }

    customerRefundReprint(cusId: number): Observable<any> {
        let queryParams = new HttpParams()
            .append("cusId", cusId);
        return this.http.get(this.customerRefundReprintUrl, { params: queryParams });
    }

    otpVerify(cusId: number,otp:any): Observable<any> {
        let queryParams = new HttpParams()
            .append("cusId", cusId).append("otp", otp);
        return this.http.get(this.otpVerifyUrl, { params: queryParams });
    }

    refundPoints(cusId: number, amt: number): Observable<any> {
        let obj: any;
        let queryParams = new HttpParams()
            .append("cusId", cusId).append("amt", amt);
        return this.http.put(this.refundPointsUrl, obj, { params: queryParams });
    }

}