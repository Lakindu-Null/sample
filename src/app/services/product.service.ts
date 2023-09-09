
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class productService {
    
    errorMessage: any;
    private getAllUrl = environment.baseUrl + 'setup/product/getAll';
    private saveUrl = environment.baseUrl + 'setup/product/save';
    private updateUrl = environment.baseUrl + 'setup/product/update';
    private deleteUrl = environment.baseUrl + 'setup/product/delete';
    private getAllDependanciesUrl = environment.baseUrl + 'setup/product/getAllDependencies';
    private updateProductPointsUrl = environment.baseUrl + 'setup/product/updateProductPoints';

    constructor(private http: HttpClient) { }

    updateProductPoints(data:any): Observable<any> {
        return this.http.put(this.updateProductPointsUrl,data);
    }

    getAllDependancies(): Observable<any> {
        return this.http.get(this.getAllDependanciesUrl);
    }

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