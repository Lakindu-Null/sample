
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class receiptService {

    errorMessage: any;
    private getAllDependenciesUrl = environment.baseUrl + 'sales/receipt/getAllDependencies';
    private getCustomerOutstandingUrl = environment.baseUrl + 'sales/receipt/getCustomerOutstanding';
    private receiptSaveUrl = environment.baseUrl + 'sales/receipt/receiptSave';
    private getOverpaymentAndOutstandingsUrl = environment.baseUrl + 'sales/receipt/getOverpaymentAndOutstandings';
    private customerReceiptListUrl = environment.baseUrl + 'sales/receipt/customerReceiptList';
    private receiptCancelUrl = environment.baseUrl + 'sales/receipt/receiptCancel';
    private receiptListUrl = environment.baseUrl + 'sales/receipt/receiptList';
    private getSelectedReceiptDetailsUrl = environment.baseUrl + 'sales/receipt/getSelectedReceiptDetails';
    private chequenumberAvailabilityUrl = environment.baseUrl + 'sales/receipt/chequenumberAvailability';
    private pendingChequeListUrl = environment.baseUrl + 'sales/receipt/pendingChequeList';
    private chequeStatusUpdateUrl = environment.baseUrl + 'sales/receipt/chequeStatusUpdate';

    
    constructor(private http: HttpClient) { }

    pendingChequeList(): Observable<any> {
        return this.http.get(this.pendingChequeListUrl);
    }

    chequeStatusUpdate(id: any, status: any): Observable<any> {
        let queryParams = new HttpParams()
            .append("id", id)
            .append("status", status);
        return this.http.get(this.chequeStatusUpdateUrl, { params: queryParams });
    }

    chequenumberAvailability(controller: any): Observable<any> {
        let queryParams = new HttpParams()
            .append("controller", controller);
        return this.http.get(this.chequenumberAvailabilityUrl, { params: queryParams });
    }

    getAllDependencies(): Observable<any> {
        return this.http.get(this.getAllDependenciesUrl);
    }

    getCustomerOutstanding(id: number): Observable<any> {
        let queryParams = new HttpParams()
            .append("cusId", id);
        return this.http.get(this.getCustomerOutstandingUrl, { params: queryParams });
    }

    getSelectedReceiptDetails(id: number): Observable<any> {
        let queryParams = new HttpParams()
            .append("id", id);
        return this.http.get(this.getSelectedReceiptDetailsUrl, { params: queryParams });
    }


    receiptSave(data: any): Observable<any> {
        return this.http.post(this.receiptSaveUrl, data);
    }

    getOverpaymentAndOutstandings(id: number): Observable<any> {
        let queryParams = new HttpParams()
            .append("cusId", id);
        return this.http.get(this.getOverpaymentAndOutstandingsUrl, { params: queryParams });
    }

    customerReceiptList(id: number): Observable<any> {
        let queryParams = new HttpParams()
            .append("cusId", id);

        return this.http.get(this.customerReceiptListUrl, { params: queryParams });
    }

    receiptCancel(id: number, mcId: number): Observable<any> {
        let queryParams = new HttpParams()
            .append("id", id)
            .append("mcId", mcId);
        return this.http.get(this.receiptCancelUrl, { params: queryParams });
    }

    receiptList(startDate: any, endDate: any): Observable<any> {
        let queryParams = new HttpParams()
            .append("startDate", startDate).append("endDate", endDate);
        return this.http.get(this.receiptListUrl, { params: queryParams });
    }





}