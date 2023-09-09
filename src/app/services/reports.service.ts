
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class ReportsService {

    errorMessage: any;
    private currentStockSummaryUrl = environment.baseUrl + 'reports/currentStockSummary';
    private chequeInHandSummaryUrl = environment.baseUrl + 'reports/chequeInHandSummary';
    private dailySaleSummaryUrl = environment.baseUrl + 'reports/dailySaleSummary';
    private dailyProfitSummaryUrl = environment.baseUrl + 'reports/dailyProfitSummary';
    private salesReportDetailsUrl = environment.baseUrl + 'reports/salesReportDetails';

    constructor(private http: HttpClient) {

    }


    currentStockSummary(): Observable<any> {
        return this.http.get(this.currentStockSummaryUrl);
    }

    chequeInHandSummary(): Observable<any> {
        return this.http.get(this.chequeInHandSummaryUrl);
    }

    dailySaleSummary(): Observable<any> {
        return this.http.get(this.dailySaleSummaryUrl);
    }

    dailyProfitSummary(): Observable<any> {
        return this.http.get(this.dailyProfitSummaryUrl);
    }

    salesReportDetails(startdate: any, endDate: any): Observable<any> {
        let queryParams = new HttpParams()
            .append("startDate", startdate)
            .append("endDate", endDate);
        return this.http.get(this.salesReportDetailsUrl, { params: queryParams });
    }

}