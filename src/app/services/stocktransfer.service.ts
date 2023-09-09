
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class stockTransferService {
    
    errorMessage: any;
    private makeStockTransferUrl = environment.baseUrl + 'sales/stockTransfer/makeStockTransfer';
    private getSelectedBranchStockByProductUrl = environment.baseUrl + 'sales/stockTransfer/getSelectedBranchStockByProduct';
    private getAllDependanciesUrl = environment.baseUrl + 'sales/stockTransfer/getAllDependencies';

    private getBranchPendingConfirmationListUrl = environment.baseUrl + 'sales/stockTransfer/getBranchPendingConfirmationList';
    private getAllDepTransferConfirmationUrl = environment.baseUrl + 'sales/stockTransfer/getAllDepTransferConfirmation';
    private makeTransferConfirmByOtherBranchUrl = environment.baseUrl + 'sales/stockTransfer/makeTransferConfirmByOtherBranch';
    private makeTransferConfirmByMainBranchUrl = environment.baseUrl + 'sales/stockTransfer/makeTransferConfirmByMainBranch';
    private stockTransferListUrl = environment.baseUrl + 'sales/stockTransfer/stockTransferList';
    private getSelectedTransferDataUrl = environment.baseUrl + 'sales/stockTransfer/getSelectedTransferData';
    private cancelStockTransferUrl = environment.baseUrl + 'sales/stockTransfer/cancelStockTransfer';
    private getMcListUrl = environment.baseUrl + 'sales/stockTransfer/getMcList';

    constructor(private http: HttpClient) { }


    getMcList(): Observable<any> {
        return this.http.get(this.getMcListUrl);
    }

     getBranchPendingConfirmationList(): Observable<any> {
        return this.http.get(this.getBranchPendingConfirmationListUrl);
    }

    getAllDepTransferConfirmation(): Observable<any> {
        return this.http.get(this.getAllDepTransferConfirmationUrl);
    }

    makeTransferConfirmByOtherBranch(obj:any,mcId:number,branchId:number): Observable<any> {
        let queryParams = new HttpParams()
        .append("branchId", branchId)
        .append("mcId", mcId);
        return this.http.put(this.makeTransferConfirmByOtherBranchUrl,obj,{ params: queryParams });
    }

    makeTransferConfirmByMainBranch(obj:any,mcId:number): Observable<any> {
        let queryParams = new HttpParams()
        .append("mcId", mcId);
        return this.http.put(this.makeTransferConfirmByMainBranchUrl,obj,{ params: queryParams });
    }

    stockTransferList(startDate:any,endDate:any): Observable<any> {
        let queryParams = new HttpParams()
        .append("startDate", startDate)
        .append("endDate", endDate);
        return this.http.get(this.stockTransferListUrl,{ params: queryParams });
    }

    getSelectedTransferData(id:any): Observable<any> {
        let queryParams = new HttpParams()
        .append("id", id);
        return this.http.get(this.getSelectedTransferDataUrl,{ params: queryParams });
    }

    
    cancelStockTransfer(id:number,mcId:number): Observable<any> {
        let queryParams = new HttpParams()
        .append("id", id)
        .append("mcId", mcId);
        return this.http.get(this.cancelStockTransferUrl,{ params: queryParams });
    }

    getAllDependancies(): Observable<any> {
        return this.http.get(this.getAllDependanciesUrl);
    }

    save(data:any): Observable<any> {
        return this.http.post(this.makeStockTransferUrl,data);
    }

    getSelectedBranchStockByProduct(productId:number,branchId:number): Observable<any> {
        let queryParams = new HttpParams()
        .append("productId", productId)
        .append("branchId", branchId);
        return this.http.get(this.getSelectedBranchStockByProductUrl,{ params: queryParams });
    }

}