
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class ColorService {

    errorMessage: any;
    private getAllUrl = environment.baseUrl + 'setup/colors/getAll';
    private saveUrl = environment.baseUrl + 'setup/colors/save';
    private updateUrl = environment.baseUrl + 'setup/colors/update';
    private deleteUrl = environment.baseUrl + 'setup/colors/delete';

    constructor(private http: HttpClient) { }

    getData(): Observable<any> {
        return this.http.get(this.getAllUrl);
    }

    save(data:any): Observable<any> {
        return this.http.post(this.saveUrl,data);
    }

    update(data:any): Observable<any> {
        return this.http.put(this.updateUrl,data);
    }

    delete(id:number): Observable<any> {
        let queryParams = new HttpParams()
        .append("id", id);
        return this.http.delete(this.deleteUrl,{ params: queryParams });
    }

}