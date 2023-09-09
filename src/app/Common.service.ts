import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    constructor(private messageService: MessageService) { }

    alertMessage(type:string, action: string, message: string) {
        switch(type){
            case 'success':
                this.successMessage(action,message);
                break;
            case 'info':
                this.infoMessage(action,message);
                break;
            case 'warn':
                this.warningMessage(action,message);
                break;
            case 'error':
                this.errorMessage(action,message);
                break;    

        }
    }

    successMessage(action: string, message: string) {
        this.messageService.add({ severity: 'success', summary: action, detail: message });
    }

    infoMessage(message: string, action: string) {
        this.messageService.add({ severity: 'info', summary: action, detail: message });
    }
    
    warningMessage(message: string, action: string) {
        this.messageService.add({ severity: 'warn', summary: action, detail: message });
    }

    errorMessage(message: string, action: string) {
        this.messageService.add({ severity: 'error', summary: action, detail: message });
    }    

}