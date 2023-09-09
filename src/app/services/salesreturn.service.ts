
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class salesreturnService {
    
    errorMessage: any;
    private makeSalesreturnUrl = environment.baseUrl + 'sales/salesReturn/makeSalesreturn';
    private mcListUrl = environment.baseUrl + 'sales/salesReturn/mcList';
    private getInvoiceByDateUrl= environment.baseUrl + 'sales/salesReturn/getInvoiceByDate';
    private salesReturnListUrl= environment.baseUrl + 'sales/salesReturn/salesReturnList';
    private getSelectedSalesReturnDetailsUrl= environment.baseUrl + 'sales/salesReturn/getSelectedSalesReturnDetails';
    private getAllDependenciesUrl= environment.baseUrl + 'sales/salesReturn/getAllDependencies';

    constructor(private http: HttpClient) { }

    getAllDependencies(): Observable<any> {
        return this.http.get(this.getAllDependenciesUrl);
    }
 
    mcList(): Observable<any> {
        return this.http.get(this.mcListUrl);
    }

    makeSalesreturn(data:any): Observable<any> {
        return this.http.post(this.makeSalesreturnUrl,data);
    }

    getInvoiceByDate(date:any): Observable<any> {
        let queryParams = new HttpParams()
        .append("date", date);
        return this.http.get(this.getInvoiceByDateUrl,{ params: queryParams });
    }

    salesReturnList(startDate:any,endDate:any): Observable<any> {
        let queryParams = new HttpParams()
        .append("endDate", endDate)
        .append("startDate",startDate);
        return this.http.get(this.salesReturnListUrl,{ params: queryParams });
    }

    getSelectedSalesReturnDetails(id:any): Observable<any> {
        let queryParams = new HttpParams()
        .append("id", id);
        return this.http.get(this.getSelectedSalesReturnDetailsUrl,{ params: queryParams });
    }

}