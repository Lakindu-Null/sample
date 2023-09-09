import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CommonFunctions } from "./CommonFunctions";
import { Theme } from "./Theme";
import { Company } from "../models/Company";

export class PrintModule {

    static setUpCompany() {
        let companyName: string = '';
        let addressLine1: string = '';
        let addressLine2: string = '';
        let addressLine3: string = '';
        let telephone: string = '';
        let email: string = '';
        if (CommonFunctions.company != null) {
            companyName = CommonFunctions.company.name;
            addressLine1 = CommonFunctions.company.addressLine1;
            addressLine2 = CommonFunctions.company.addressLine2;
            addressLine3 = CommonFunctions.company.addressLine3;
            telephone = CommonFunctions.company.telephone;
            email = CommonFunctions.company.email;
        }
        return new Company(companyName, addressLine1, addressLine2, addressLine3, telephone, email);
    }

    commonPrint(col: any[], rows: any[], title: string)// most suitable for setup module  
    {
        let company: Company = PrintModule.setUpCompany();
        const doc = new jsPDF();

        doc.setFont("Arial");
        doc.setFont("bold");
        doc.setFontSize(22);
        doc.text(company.name, 7, 10);
        doc.text(title, 203, 20, { align: 'right' });

        doc.setFont("normal");
        doc.setFontSize(10);
        doc.text(company.addressLine1 + ' ' + company.addressLine2 + '' + company.addressLine3, 7, 20);
        doc.setFont("bold");
        doc.setFontSize(9);
        doc.text('Tel:' + company.telephone, 7, 25);
        doc.setFont("normal");
        doc.setFontSize(10);
        doc.text('Email:' + company.email, 7, 30);
        doc.setFont("bold");

        doc.setFont("normal");
        doc.setFont("bold");

        doc.setFontSize(9);
        doc.text('CREATED DATE ', 155, 30);
        doc.text(' :', 180, 30);
        doc.text(new Date().toDateString(), 183, 30);

        doc.text('CREATED BY', 155, 35);
        doc.text(' :', 180, 35);
        doc.text(CommonFunctions.userName, 180, 35);

        autoTable(doc, {
            head: [col],
            body: rows,
            headStyles: { fillColor: Theme.autoTableHeaderColor },
            columnStyles: {
                0: { fontSize: 8, fontStyle: 'bold' },
                1: { fontSize: 8, fontStyle: 'bold' },
                2: { fontSize: 8, fontStyle: 'bold' },
                3: { fontSize: 8, fontStyle: 'bold' },
                4: { fontSize: 8, fontStyle: 'bold' },
                5: { fontSize: 8, fontStyle: 'bold' },
                6: { fontSize: 8, fontStyle: 'bold' },
                7: { fontSize: 8, fontStyle: 'bold' }
            },
            theme: 'striped',
            startY: 42,
            margin: 7,
            tableWidth: 198
        })

        doc.autoPrint();
        var oHiddFrame = document.createElement("iframe");
        oHiddFrame.style.position = "fixed";
        oHiddFrame.style.visibility = "hidden";
        oHiddFrame.src = doc.output('bloburl').toString();
        document.body.appendChild(oHiddFrame);

    }

    static printInvoice(header: any, details: any[]) {

        let company: Company = this.setUpCompany();
        const doc = new jsPDF();
        const col = ["Product Name", '       Price (Rs)', '     Discount (%)', '      Quantity', '     Value (Rs)'];
        const rows = [];

        const colFooterL = [
            'Mrp Total' + '\n' + 'Item Disc' + '\n' + 'Net Total'
        ];
        const rowsFooterL: any = [];

        const colFooterR = [
            ':' + '\n' + ':' + '\n' + ':',
            header.mrpTotal.toFixed(2) + '\n' +
            header.itemDisc.toFixed(2) + '\n' +
            header.netTotal.toFixed(2)
        ];
        const rowsFooterR: any = [];

        for (const data of details) {
            const temp = [
                data.productName,
                data.price.toFixed(2),
                data.discount.toFixed(2),
                data.quantity,
                data.value.toFixed(2)
            ];
            rows.push(temp);
        }

        let compName = company.name;
        let addline1 = company.addressLine1;
        let addline2 = company.addressLine2;
        let addline3 = company.addressLine3;
        let telephone = company.telephone;
        let email = company.email;

        let cusName = header.cusName + ' | ' + header.customerTelephone + ' *';

        if (header.cashInvoice) {
            compName = 'CASH SALE';
            addline1 = '';
            addline2 = '';
            addline3 = '';
            telephone = 'none';
            email = 'none';
            cusName = header.cusName + ' *';
        }

        doc.setFont("Arial");
        doc.setFont("bold");
        doc.setFontSize(22);
        doc.text(compName.toUpperCase(), 7, 10);
        doc.text("INVOICE", 203, 20, { align: 'right' });

        doc.setFont("normal");
        doc.setFontSize(10);
        doc.text(CommonFunctions.capitalize(addline1) + ' ' + CommonFunctions.capitalize(addline2) + ' ' + CommonFunctions.capitalize(addline3), 7, 20);
        doc.setFont("bold");
        doc.setFontSize(9);
        doc.text('Tel : ' + telephone, 7, 25);
        doc.setFont("normal");
        doc.setFontSize(10);
        doc.text('Email : ' + email, 7, 30);
        doc.setFont("bold");

        doc.setFont("normal");
        doc.setFont("bold");

        doc.setFontSize(9);
        doc.text('CREATED DATE ', 152, 30);
        doc.text(' :', 177, 30);
        doc.text(header.createdDate, 180, 30);

        doc.text('CREATED BY', 152, 35);
        doc.text(' :', 177, 35);
        doc.text(CommonFunctions.userName, 180, 35);

        let invoiceNumber = header.genId;
        doc.text('INVOICE NO', 152, 40);
        doc.text(' :', 177, 40);
        doc.text(invoiceNumber, 180, 40);

        doc.text('Customer :  ' + CommonFunctions.capitalize(cusName), 7, 47);


        autoTable(doc, {
            head: [col],
            body: rows,
            headStyles: { fillColor: Theme.autoTableHeaderColor },
            columnStyles: {
                0: { fontSize: 8, fontStyle: 'bold' },
                1: { fontSize: 8, fontStyle: 'bold', halign: 'right' },
                2: { fontSize: 8, fontStyle: 'bold', halign: 'center' },
                3: { fontSize: 8, fontStyle: 'bold', halign: 'center' },
                4: { fontSize: 8, fontStyle: 'bold', halign: 'right' }
            },
            theme: 'striped',
            startY: 49,
            margin: 7,
            tableWidth: 198
        })

        let finalY = (doc as any).lastAutoTable.finalY;


        autoTable(doc, {
            head: [colFooterL],
            body: rowsFooterL,
            headStyles: {
                // fillColor: Theme.autoTableHeaderColor 
            },
            theme: 'plain',
            startY: finalY + 10,
            margin: { left: 153 },
            tableWidth: 35
        })

        autoTable(doc, {
            head: [colFooterR],
            body: rowsFooterR,
            headStyles: {
                halign: 'right'
            },
            theme: 'plain',
            startY: finalY + 10,
            margin: { left: 175 },
            tableWidth: 30
        })

        const pageCount = (doc as any).internal.getNumberOfPages();

        for (let i = 0; i < pageCount; i++) {
            doc.setPage(i);
            let pageCurrent = (doc as any).internal.getCurrentPageInfo().pageNumber; //Current Page
            doc.setFontSize(12);

            doc.setTextColor(8, 0, 1);
            doc.text('Page : ' + pageCurrent + '/' + pageCount, 10, doc.internal.pageSize.height - 10);

            doc.setTextColor(166, 163, 163);
            doc.text('Invoice No : ' + invoiceNumber, 75, doc.internal.pageSize.height - 10);

        }

        doc.setPage(0);
        doc.setTextColor(8, 0, 1);
        doc.setFontSize(10);
        doc.text('TOTAL PAGES', 152, 45);
        doc.text(' :', 177, 45);
        doc.text(pageCount.toString(), 180, 45);
        doc.setFontSize(9);

        doc.autoPrint();
        var oHiddFrame = document.createElement("iframe");
        oHiddFrame.style.position = "fixed";
        oHiddFrame.style.visibility = "hidden";
        oHiddFrame.src = doc.output('bloburl').toString();
        document.body.appendChild(oHiddFrame);
    }

    static printSalesReturn(header: any, details: any[]) {

        let company: Company = this.setUpCompany();
        let productName='';

        const doc = new jsPDF();
        const col = ['Invoice No', 'Product Price (Rs)', 'Return Quantity ', 'Value (Rs)'];
        const rows = [];

        const colFooterL = [
            'Net Total : '
        ];
        const rowsFooterL: any = [];

        const colFooterR = [
            header.netAmt.toFixed(2)
        ];
        const rowsFooterR: any = [];


        for (const data of details) {
            productName=data.invoiceDProductName;
            const temp = [
                data.invoiceDHeaderGenId,
                data.price.toFixed(2),
                data.quantity,
                data.value.toFixed(2)
            ];
            rows.push(temp);
        }

        doc.setFont("Arial");
        doc.setFont("bold");
        doc.setFontSize(22);
        doc.text(company.name.toUpperCase(), 7, 10);
        doc.text("SALES RETURN", 203, 20, { align: 'right' });

        doc.setFont("normal");
        doc.setFontSize(10);
        doc.text(CommonFunctions.capitalize(company.addressLine1) + ' ' + CommonFunctions.capitalize(company.addressLine2) + ' ' + CommonFunctions.capitalize(company.addressLine3), 7, 20);
        doc.setFont("bold");
        doc.setFontSize(9);
        doc.text('Tel : ' + company.telephone, 7, 25);
        doc.setFont("normal");
        doc.setFontSize(10);
        doc.text('Email : ' + company.email, 7, 30);
        doc.setFont("bold");

        doc.setFont("normal");
        doc.setFont("bold");

        doc.setFontSize(9);
        doc.text('CREATED DATE ', 153, 30);
        doc.text(' :', 178, 30);
        doc.text(header.createdDate, 181, 30);

        doc.text('CREATED BY', 153, 35);
        doc.text(' :', 178, 35);
        doc.text(CommonFunctions.userName, 181, 35);

        let retNo = header.genId;

        doc.text('RETURN NO', 153, 40);
        doc.text(' :', 178, 40);
        doc.text(retNo, 181, 40);

        doc.text('Customer : ' + header.customerName + ' *', 7, 55);
        doc.text('Product    : ' + productName + ' *', 7, 51);

        autoTable(doc, {
            head: [col],
            body: rows,
            headStyles: { fillColor: Theme.autoTableHeaderColor },
            columnStyles: {
                0: { fontSize: 8, fontStyle: 'bold' },
                1: { fontSize: 8, fontStyle: 'bold', halign: 'left' },
                2: { fontSize: 8, fontStyle: 'bold', halign: 'left' },
                3: { fontSize: 8, fontStyle: 'bold', halign: 'left' }
            },
            theme: 'striped',
            startY: 57,
            margin: 7,
            tableWidth: 198
        })

        let finalY = (doc as any).lastAutoTable.finalY;

        autoTable(doc, {
            head: [colFooterL],
            body: rowsFooterL,
            headStyles: {
                // fillColor: Theme.autoTableHeaderColor 
            },
            theme: 'plain',
            startY: finalY + 10,
            margin: 153,
            tableWidth: 35
        })

        autoTable(doc, {
            head: [colFooterR],
            body: rowsFooterR,
            headStyles: {
                halign: 'right'
            },
            theme: 'plain',
            startY: finalY + 10,
            margin: 175,
            tableWidth: 30
        })

        const pageCount = (doc as any).internal.getNumberOfPages();

        for (let i = 0; i < pageCount; i++) {
            doc.setPage(i);
            let pageCurrent = (doc as any).internal.getCurrentPageInfo().pageNumber; //Current Page
            doc.setFontSize(12);

            doc.setTextColor(8, 0, 1);
            doc.text('Page : ' + pageCurrent + '/' + pageCount, 10, doc.internal.pageSize.height - 5);

            doc.setTextColor(166, 163, 163);
            doc.text('Sales Return No : ' + retNo, 75, doc.internal.pageSize.height - 5);

        }

        doc.setTextColor(8, 0, 1);
        doc.setFontSize(10);
        doc.text('TOTAL PAGES', 153, 50);
        doc.text(' :', 178, 50);
        doc.text(pageCount.toString(), 181, 50);

        doc.setFontSize(9);


        doc.autoPrint();
        var oHiddFrame = document.createElement("iframe");
        oHiddFrame.style.position = "fixed";
        oHiddFrame.style.visibility = "hidden";
        oHiddFrame.src = doc.output('bloburl').toString();
        document.body.appendChild(oHiddFrame);
    }

    static printGrn(header: any, details: any[]) {

        let company: Company = this.setUpCompany();

        const doc = new jsPDF();
        const col = ["Product", 'Price (Rs)', 'Quantity', 'Value (Rs)'];
        const rows = [];

        const colFooterL = [
            'Net Total'
        ];
        const rowsFooterL: any = [];

        const colFooterR = [
            header.netTotal.toFixed(2)
        ];
        const rowsFooterR: any = [];

        for (const data of details) {
            const temp = [
                data.productName,
                data.cost.toFixed(2),
                data.basedQty,
                (data.basedQty * data.cost).toFixed(2)
            ];
            rows.push(temp);
        }

        doc.setFont("Arial");
        doc.setFont("bold");
        doc.setFontSize(22);
        doc.text(company.name.toUpperCase(), 7, 10);
        doc.text("GRN", 203, 20, { align: 'right' });

        doc.setFont("normal");
        doc.setFontSize(10);
        doc.text(company.addressLine1 + ' ' + company.addressLine2, 7, 20);
        doc.setFont("bold");
        doc.setFontSize(9);
        doc.text('Tel : ' + company.telephone, 7, 25);
        doc.setFont("normal");
        doc.setFontSize(10);
        doc.text('Email : ' + company.email, 7, 30);
        doc.setFont("bold");

        doc.setFont("normal");
        doc.setFont("bold");

        doc.setFontSize(9);
        doc.text('CREATED DATE ', 153, 30);
        doc.text(' :', 178, 30);
        doc.text(header.createdDate, 181, 30);

        doc.text('CREATED BY', 153, 35);
        doc.text(' :', 178, 35);
        doc.text(CommonFunctions.userName, 181, 35);

        let grnNumber = header.genId;
        doc.text('GRN NO', 153, 40);
        doc.text(' :', 178, 40);
        doc.text(grnNumber, 181, 40);

        doc.text('SUP INVOICE NO', 153, 45);
        doc.text(' :', 178, 45);
        doc.text(header.supInvoice, 181, 45);

        doc.text('Supplier :  ' + header.supplierName+' | '+header.supplierTelephone, 7, 52);

        autoTable(doc, {
            head: [col],
            body: rows,
            headStyles: { fillColor: Theme.autoTableHeaderColor },
            columnStyles: {
                0: { fontSize: 8, fontStyle: 'bold' },
                1: { fontSize: 8, fontStyle: 'bold' },
                2: { fontSize: 8, fontStyle: 'bold' },
                3: { fontSize: 8, fontStyle: 'bold', halign: 'right' },
                4: { fontSize: 8, fontStyle: 'bold', halign: 'center' },
                5: { fontSize: 8, fontStyle: 'bold', halign: 'right' }
            },
            theme: 'striped',
            startY: 54,
            margin: 7,
            tableWidth: 198
        })

        let finalY = (doc as any).lastAutoTable.finalY;

        autoTable(doc, {
            head: [colFooterL],
            body: rowsFooterL,
            headStyles: {
                // fillColor: Theme.autoTableHeaderColor 
            },
            theme: 'plain',
            startY: finalY + 10,
            margin: 153,
            tableWidth: 35
        })

        autoTable(doc, {
            head: [colFooterR],
            body: rowsFooterR,
            headStyles: {
                halign: 'right'
            },
            theme: 'plain',
            startY: finalY + 10,
            margin: 175,
            tableWidth: 30
        })

        const pageCount = (doc as any).internal.getNumberOfPages();

        for (let i = 0; i < pageCount; i++) {
            doc.setPage(i);
            let pageCurrent = (doc as any).internal.getCurrentPageInfo().pageNumber; //Current Page
            doc.setFontSize(12);

            doc.setTextColor(8, 0, 1);
            doc.text('Page : ' + pageCurrent + '/' + pageCount, 10, doc.internal.pageSize.height - 5);

            doc.setTextColor(166, 163, 163);
            doc.text('Grn No : ' + grnNumber, 75, doc.internal.pageSize.height - 5);
        }

        doc.setTextColor(8, 0, 1);
        doc.setFontSize(10);
        doc.text('TOTAL PAGES', 153, 50);
        doc.text(' :', 178, 50);
        doc.text(pageCount.toString(), 181, 50);
        doc.setFontSize(9);
        doc.autoPrint();
        var oHiddFrame = document.createElement("iframe");
        oHiddFrame.style.position = "fixed";
        oHiddFrame.style.visibility = "hidden";
        oHiddFrame.src = doc.output('bloburl').toString();
        document.body.appendChild(oHiddFrame);
    }

    static printReceipt(header: any, details: any[], chequeList: any[]) {

        let company: Company = this.setUpCompany();
        const doc = new jsPDF();

        let colInvoicePayment = ["Invoice Number", 'Pay Amount'];

        const rowsInvoicePayment = [];

        if (details.length == 0) {
            colInvoicePayment = [" ", ''];
            rowsInvoicePayment.push([
                "Invoice Payments Not Available ,Overpayment Receipt *",
                ""
            ]);
        }



        for (const recDet of details) {
            rowsInvoicePayment.push([
                recDet.receiptPaymentInvoicehGenId,
                recDet.payAmount.toFixed(2)
            ]);
        }


        const colChequeList = [
            'Bank', 'Branch', 'Account Number', 'Cheque No', 'Cheque Date ', 'Amount'
        ];
        const rowsChequeList = [];

        for (const chqList of chequeList) {
            rowsChequeList.push([
                chqList.bank,
                chqList.branch,
                chqList.acountNumber,
                chqList.chequeNo,
                chqList.chequeDate,
                chqList.amount.toFixed(2)
            ]);
        }

        const colFooterL = [
            'Outstanding'
            + '\n' + 'Cash Pay'
            + '\n' + 'Cheques Pay'
            + '\n' + 'Balance'
            + '\n' + 'OverPayment'
        ];
        const rowsFooterL: any = [];

        const colFooterR = [
            ':' + '\n' +
            ':' + '\n' +
            ':' + '\n' +
            ':' + '\n' +
            ':',
            header.outstanding.toFixed(2) + '\n' +
            header.cashPay.toFixed(2) + '\n' +
            header.chequePay.toFixed(2) + '\n' +
            header.balance.toFixed(2) + '\n' +
            header.cashOverPayment.toFixed(2)
        ];
        const rowsFooterR: any = [];

        let compName = company.name;
        let addline1 = company.addressLine1;
        let addline2 = company.addressLine2;
        let addline3 = company.addressLine3;
        let telephone = company.telephone;
        let email = company.email;

        let cusName = header.customerName + ' *';

        doc.setFont("Arial");
        doc.setFont("bold");
        doc.setFontSize(22);
        doc.text(compName.toUpperCase(), 7, 10);
        doc.text("RECEIPT", 203, 20, { align: 'right' });

        doc.setFont("normal");
        doc.setFontSize(10);
        doc.text(CommonFunctions.capitalize(addline1) + ' ' + CommonFunctions.capitalize(addline2) + ' ' + CommonFunctions.capitalize(addline3), 7, 20);
        doc.setFont("bold");
        doc.setFontSize(9);
        doc.text('Tel : ' + telephone, 7, 25);
        doc.setFont("normal");
        doc.setFontSize(10);
        doc.text('Email : ' + email, 7, 30);
        doc.setFont("bold");

        doc.setFont("normal");
        doc.setFont("bold");

        doc.setFontSize(9);
        doc.text('CREATED DATE ', 152, 30);
        doc.text(' :', 177, 30);
        doc.text(header.createdDate, 180, 30);

        doc.text('CREATED BY', 152, 35);
        doc.text(' :', 177, 35);
        doc.text(CommonFunctions.userName, 180, 35);

        let invoiceNumber = header.genId;
        doc.text('RECEIPT NO', 152, 40);
        doc.text(' :', 177, 40);
        doc.text(invoiceNumber, 180, 40);
        doc.text('Customer :  ' + CommonFunctions.capitalize(cusName), 7, 47);

        autoTable(doc, {
            head: [colInvoicePayment],
            body: rowsInvoicePayment,
            headStyles: { fillColor: Theme.autoTableHeaderColor },
            columnStyles: {
                0: { fontSize: 8, fontStyle: 'bold' },
                1: { fontSize: 8, fontStyle: 'bold', halign: 'right' },
                2: { fontSize: 8, fontStyle: 'bold', halign: 'center' },
                3: { fontSize: 8, fontStyle: 'bold', halign: 'center' },
                4: { fontSize: 8, fontStyle: 'bold', halign: 'right' }
            },
            theme: 'striped',
            startY: 49,
            margin: 7,
            tableWidth: 198
        })

        let finalY = (doc as any).lastAutoTable.finalY;
        console.log('finalY ' + finalY);
        let finalY2 = finalY;

        if (chequeList.length > 0) {

            doc.text('Cheques * ', 7, finalY + 8);

            autoTable(doc, {
                head: [colChequeList],
                body: rowsChequeList,
                headStyles: { fillColor: Theme.autoTableHeaderColor },
                columnStyles: {
                    0: { fontSize: 8, fontStyle: 'bold' },
                    1: { fontSize: 8, fontStyle: 'bold', halign: 'right' },
                    2: { fontSize: 8, fontStyle: 'bold', halign: 'center' },
                    3: { fontSize: 8, fontStyle: 'bold', halign: 'center' },
                    4: { fontSize: 8, fontStyle: 'bold' },
                    5: { fontSize: 8, fontStyle: 'bold', halign: 'right' }
                },
                theme: 'striped',
                startY: finalY + 10,
                margin: 7,
                tableWidth: 198
            })
            finalY2 = (doc as any).lastAutoTable.finalY;
        }

        console.log('finalY2 ' + finalY2);


        autoTable(doc, {
            head: [colFooterL],
            body: rowsFooterL,
            headStyles: {
                // fillColor: Theme.autoTableHeaderColor 
            },
            theme: 'plain',
            startY: finalY2 + 10,
            margin: { left: 153 },
            tableWidth: 35
        })

        autoTable(doc, {
            head: [colFooterR],
            body: rowsFooterR,
            headStyles: {
                halign: 'right'
            },
            theme: 'plain',
            startY: finalY2 + 10,
            margin: { left: 175 },
            tableWidth: 30
        })

        const pageCount = (doc as any).internal.getNumberOfPages();

        for (let i = 0; i < pageCount; i++) {
            doc.setPage(i);
            let pageCurrent = (doc as any).internal.getCurrentPageInfo().pageNumber; //Current Page
            doc.setFontSize(12);

            doc.setTextColor(8, 0, 1);
            doc.text('Page : ' + pageCurrent + '/' + pageCount, 10, doc.internal.pageSize.height - 5);

            doc.setTextColor(166, 163, 163);
            doc.text('Receipt No : ' + invoiceNumber, 75, doc.internal.pageSize.height - 5);
        }

        doc.setPage(0);
        doc.setTextColor(8, 0, 1);
        doc.setFontSize(10);
        doc.text('TOTAL PAGES', 152, 45);
        doc.text(' :', 177, 45);
        doc.text(pageCount.toString(), 180, 45);

        doc.setFontSize(9);

        doc.autoPrint();
        var oHiddFrame = document.createElement("iframe");
        oHiddFrame.style.position = "fixed";
        oHiddFrame.style.visibility = "hidden";
        oHiddFrame.src = doc.output('bloburl').toString();
        document.body.appendChild(oHiddFrame);
    }








}
