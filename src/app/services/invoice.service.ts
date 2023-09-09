
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class invoiceService {
    
    errorMessage: any;
    private saveUrl = environment.baseUrl + 'sales/invoice/save';
    private getAllDependanciesUrl = environment.baseUrl + 'sales/invoice/getAllDependencies';
    private productAvailabilityUrl= environment.baseUrl + 'sales/invoice/productAvailability';
    private invoiceListUrl= environment.baseUrl + 'sales/invoice/invoiceList';
    private getSelectedInvoiceDetailsUrl= environment.baseUrl + 'sales/invoice/getSelectedInvoiceDetails';
    private getSelectedInvoiceDetailsByCustomerAndProductUrl= environment.baseUrl + 'sales/invoice/getSelectedInvoiceDetailsByCustomerAndProduct';

    constructor(private http: HttpClient) { }

    getSelectedInvoiceDetailsByCustomerAndProduct(productId:any,cusId:any): Observable<any> {
        let queryParams = new HttpParams()
        .append("productId", productId)
        .append("cusId", cusId);
        return this.http.get(this.getSelectedInvoiceDetailsByCustomerAndProductUrl,{ params: queryParams });
    }
    
    getAllDependancies(): Observable<any> {
        return this.http.get(this.getAllDependanciesUrl);
    }

    save(data:any): Observable<any> {
        return this.http.post(this.saveUrl,data);
    }

    productAvailability(productId:any): Observable<any> {
        let queryParams = new HttpParams()
        .append("productId", productId);
        return this.http.get(this.productAvailabilityUrl,{ params: queryParams });
    }

    InvoiceList(startDate:any,endDate:any): Observable<any> {
        let queryParams = new HttpParams()
        .append("endDate", endDate)
        .append("startDate",startDate);
        return this.http.get(this.invoiceListUrl,{ params: queryParams });
    }

    getSelectedInvoiceDetails(id:any): Observable<any> {
        let queryParams = new HttpParams()
        .append("id", id);
        return this.http.get(this.getSelectedInvoiceDetailsUrl,{ params: queryParams });
    }

}