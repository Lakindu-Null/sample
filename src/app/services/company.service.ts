
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class CompanyService {

    errorMessage: any;
    private getAllUrl = environment.baseUrl + 'setup/company/getAll';
    private updateUrl = environment.baseUrl + 'setup/company/update';

    constructor(private http: HttpClient) 
    {

    }

    getData(): Observable<any> {
        return this.http.get(this.getAllUrl);
    }

    update(data:any): Observable<any> {
        return this.http.put(this.updateUrl,data);
    }

}