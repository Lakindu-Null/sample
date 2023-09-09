import { INavbarData } from "./nav-helper";

export const navbarData: INavbarData[] = [
    /* --------------
        SETUP MODULE 
    ----------------*/
    {
        parentId: 2,
        childId: 1,
        routeLink: 'setup/company',
        icon: 'fal fa-building',
        label: 'Company',
    },
    {
        parentId: 2,
        childId: 2,
        routeLink: 'setup/volume-type',
        icon: 'fal fa-scale-balanced',
        label: 'Volume Type',
    },
    {
        parentId: 2,
        childId: 3,
        routeLink: 'setup/color',
        icon: 'fal fa-palette',
        label: 'Color',
    },
    {
        parentId: 2,
        childId: 4,
        routeLink: 'setup/category',
        icon: 'fal fa-bars-staggered',
        label: 'Category',
    },
    {
        parentId: 2,
        childId: 5,
        routeLink: 'setup/product',
        icon: 'fal fa-fill-drip',
        label: 'Product',
    },
    {
        parentId: 2,
        childId: 6,
        routeLink: 'setup/users',
        icon: 'fal fa-users',
        label: 'Users',
    },
    /*----------------
        SALES MODULE
    -----------------*/
    {
        parentId: 3,
        childId: 1,
        routeLink: 'sales/grn',
        icon: 'fal fa-credit-card',
        label: 'Grn',
        items: [
            {
                routeLink: 'sales/grn',
                label: 'Create Grn'
            },
            {
                routeLink: 'sales/grnCancel',
                label: 'Grn Cancel'
            },
            {
                routeLink: 'sales/grnReprint',
                label: 'Grn Reprint'
            }
        ]
    },
    {
        parentId: 3,
        childId: 2,
        routeLink: 'sales/invoice',
        icon: 'fal fa-file-invoice-dollar',
        label: 'Invoice',
        items: [
            {
                routeLink: 'sales/invoice',
                label: 'Create Invoice'
            },
            {
                routeLink: 'sales/invoiceReprint',
                label: 'Invoice Reprint'
            }
        ]
    },
    {
        parentId: 3,
        childId: 3,
        routeLink: 'sales/sales',
        icon: 'fal fa-chart-pie',
        label: 'Sales',
        items: [
            {
                routeLink: 'sales/salesReturn',
                label: 'Sales Return'
            },
            {
                routeLink: 'sales/salesReturnReprint',
                label: 'Sales Return Reprint'
            }
        ]
    },
    {
        parentId: 3,
        childId: 4,
        routeLink: 'sales/receipt',
        icon: 'fal fa-receipt',
        label: 'Receipt',
        items: [
            {
                routeLink: 'sales/receiptDirectPay',
                label: 'Create Receipt'
            },
            {
                routeLink: 'sales/receiptCancel',
                label: 'Receipt Cancel'
            },
            {
                routeLink: 'sales/receiptReprint',
                label: 'Receipt Reprint'
            }
        ]
    },
    {
        parentId: 3,
        childId: 5,
        routeLink: 'sales/chequeStatusUpdate',
        icon: 'fal fa-money-check-dollar',
        label: 'Pending Cheques'
    },
    /*------------------
        REPORT MODULE
    -------------------*/
    {
        parentId: 4,
        childId: 1,
        routeLink: 'reports/currentStock',
        icon: 'fal fa-boxes-stacked',
        label: 'Current Stock'
    },
    {
        parentId: 4,
        childId: 2,
        routeLink: 'reports/salesReport',
        icon: 'fal fa-coins',
        label: 'Sales Report'
    }
];
