
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class grnService {
    
    errorMessage: any;
    private saveUrl = environment.baseUrl + 'sales/grn/save';
    private selectedProductAvailabilityUrl = environment.baseUrl + 'sales/grn/selectedProductAvailability';
    private getAllDependanciesUrl = environment.baseUrl + 'sales/grn/getAllDependencies';
    private grnListUrl = environment.baseUrl + 'sales/grn/grnList';
    private getSelectedGrnDetailsUrl = environment.baseUrl + 'sales/grn/getSelectedGrnDetails';
    private grnListForCancelUrl = environment.baseUrl + 'sales/grn/grnListForCancel';
    private grnCancelUrl = environment.baseUrl + 'sales/grn/grnCancel';

    constructor(private http: HttpClient) { }

    grnListForCancel(): Observable<any> {
        return this.http.get(this.grnListForCancelUrl);
    }

    grnCancel(id:any,data:any): Observable<any> {
        let queryParams = new HttpParams()
        .append("id", id);
        return this.http.put(this.grnCancelUrl,data,{ params: queryParams });
    }

    grnList(startDate:any,endDate:any): Observable<any> {
        let queryParams = new HttpParams()
        .append("endDate", endDate)
        .append("startDate",startDate);
        return this.http.get(this.grnListUrl,{ params: queryParams });
    }

    getSelectedGrnDetails(id:any): Observable<any> {
        let queryParams = new HttpParams()
        .append("id", id);
        return this.http.get(this.getSelectedGrnDetailsUrl,{ params: queryParams });
    }

    getAllDependancies(): Observable<any> {
        return this.http.get(this.getAllDependanciesUrl);
    }

    save(data:any): Observable<any> {
        return this.http.post(this.saveUrl,data);
    }

    selectedProductAvailability(id:number): Observable<any> {
        let queryParams = new HttpParams()
        .append("id", id);
        return this.http.delete(this.selectedProductAvailabilityUrl,{ params: queryParams });
    }

}