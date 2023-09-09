
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class stockService {

    errorMessage: any;
    private getCurrentStockUrl = environment.baseUrl + 'sales/stock/getCurrentStock';

    constructor(private http: HttpClient) { }

    getCurrentStock(): Observable<any> {
        return this.http.get(this.getCurrentStockUrl);
    }

}