import { Injectable } from "@angular/core";
import { MenuItem } from "../models/MenuItem";
import { CommonFunctions } from "../util/CommonFunctions";

@Injectable()
export class MenuService 
{
    setupMenu = [
        new MenuItem('Company', '', '/setup/company', [],CommonFunctions.menuAccess()),
        new MenuItem('Volume Type', '', '/setup/volume-type', [],CommonFunctions.menuAccess()),
        new MenuItem('Color', '', '/setup/color', [],CommonFunctions.menuAccess()),
        new MenuItem('Category', '', '/setup/category', [],CommonFunctions.menuAccess()),
        new MenuItem('Product', '', '/setup/product', [],CommonFunctions.menuAccess()),
        new MenuItem('Users', '', '/setup/users', [],CommonFunctions.menuAccess())
    ];

    salesMenu = [
        new MenuItem('Grn', '', '/sales/grn', [],true),
        new MenuItem('Grn Cancel', '', '/sales/grnCancel', [],true),
        new MenuItem('Grn Reprint', '', '/sales/grnReprint', [],true),
        new MenuItem('Invoice', '', '/sales/invoice', [],true),      
        new MenuItem('Invoice Reprint', '', '/sales/invoiceReprint', [],true),
        new MenuItem('Sales Return', '', '/sales/salesReturn', [],true),      
        new MenuItem('Sales Return Reprint', '', '/sales/salesReturnReprint', [],true),
        new MenuItem('Receipt', '', '/sales/receiptDirectPay', [],true),
        new MenuItem('Receipt Cancel', '', '/sales/receiptCancel', [],true),
        new MenuItem('Receipt Reprint', '', '/sales/receiptReprint', [],true),
        new MenuItem('Pending Cheques', '', '/sales/chequeStatusUpdate', [],true)   
    ];

    reportsMenu = [
        new MenuItem('Current Stock', '', '/reports/currentStock', [],true),
        new MenuItem('Sales Report', '', '/reports/salesReport', [],true)
    ];

}