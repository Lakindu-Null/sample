import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashBoardAuthGuardService } from './auth/services/dashboard-auth-guard.service';
import { LoginAuthGuardService } from './auth/services/login-auth-guard.service';
import { ModuleAuthGuard } from './auth/services/module-auth-guard.service';
import { ContentCardComponent } from './common-modules/content-card/content-card.component';
import { UnauthorizedPageComponent } from './common-modules/unauthorized-page/unauthorized-page.component';


const routes: Routes = [
  // {path: '**', redirectTo: ''}

  {
    path: '',
    component: LoginComponent,
    canActivate: [DashBoardAuthGuardService]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedPageComponent
  },
  {
    path: 'card',
    component: ContentCardComponent
  },
  {
    path: 'auth/user-access-policy',
    loadChildren: () => import('./auth/user-access-policy/user-access-policy.module').then(m => m.UserAccessPolicyModule)
  },
  {
    path: 'auth/login',
    component: LoginComponent,
    canActivate: [LoginAuthGuardService]
  },
  {
    path: 'setup/color', loadChildren: () => import('./modules/setup/color/color.module').then(m => m.ColorModule),
    canActivate: [ModuleAuthGuard],
    data: { module: 2, policy: 26 }
  },
  {
    path: 'setup/volume-type', loadChildren: () => import('./modules/setup/volume-type/volume-type.module').then(m => m.VolumeTypeModule),
    canActivate: [ModuleAuthGuard],
    data: { module: 2, policy: 81 }
  },
  {
    path: 'setup/category', loadChildren: () => import('./modules/setup/category/category.module').then(m => m.CategoryModule),
    canActivate: [ModuleAuthGuard]
  },
  {
    path: 'setup/product', loadChildren: () => import('./modules/setup/product/product.module').then(m => m.ProductModule),
    canActivate: [ModuleAuthGuard]
  },
  {
    path: 'setup/branch', loadChildren: () => import('./modules/setup/branch/branch.module').then(m => m.BranchModule),
    canActivate: [ModuleAuthGuard]
  },
  {
    path: 'setup/users', loadChildren: () => import('./modules/setup/users/users.module').then(m => m.UsersModule),
    canActivate: [ModuleAuthGuard]
  },
  {
    path: 'sales/grn', loadChildren: () => import('./modules/sales/grn/grn.module').then(m => m.GrnModule),
    canActivate: [ModuleAuthGuard]
  },
  {
    path: 'sales/invoice', loadChildren: () => import('./modules/sales/invoice/invoice.module').then(m => m.InvoiceModule)
  },
  {
    path: 'sales/invoiceReprint', loadChildren: () => import('./modules/sales/invoice-reprint/invoice-reprint.module').then(m => m.InvoiceReprintModule)
  },
  {
    path: 'sales/salesReturnReprint', loadChildren: () => import('./modules/sales/sales-return-reprint/sales-return-reprint.module').then(m => m.SalesReturnReprintModule)
  },
  {
    path: 'sales/salesReturn', loadChildren: () => import('./modules/sales/sales-return/sales-return.module').then(m => m.SalesReturnModule)
  },
  {
    path: 'reports/currentStock', loadChildren: () => import('./modules/reports/current-stock/current-stock.module').then(m => m.CurrentStockModule)
  },
  { path: 'reports/commision', loadChildren: () => import('./modules/reports/commision/commision.module').then(m => m.CommisionModule) },

  { path: 'auth/userProfile', loadChildren: () => import('./auth/user-profile/user-profile.module').then(m => m.UserProfileModule) },

  { path: 'setup/productPoints', loadChildren: () => import('./modules/setup/product-points/product-points.module').then(m => m.ProductPointsModule),canActivate: [ModuleAuthGuard] },
  { path: 'sales/grnReprint', loadChildren: () => import('./modules/sales/grn-reprint/grn-reprint.module').then(m => m.GrnReprintModule) },
  { path: 'setup/company', loadChildren: () => import('./modules/setup/company/company.module').then(m => m.CompanyModule) },
 
 
  { path: 'sales/receiptDirectPay', loadChildren: () => import('./modules/sales/receipt-direct-pay/receipt-direct-pay.module').then(m => m.ReceiptDirectPayModule) },
  { path: 'sales/receiptOverPay', loadChildren: () => import('./modules/sales/receipt-over-pay/receipt-over-pay.module').then(m => m.ReceiptOverPayModule) },
  { path: 'sales/receiptCancel', loadChildren: () => import('./modules/sales/receipt-cancel/receipt-cancel.module').then(m => m.ReceiptCancelModule) },
  { path: 'sales/receiptReprint', loadChildren: () => import('./modules/sales/receipt-reprint/receipt-reprint.module').then(m => m.ReceiptReprintModule) },
  { path: 'sales/chequeStatusUpdate', loadChildren: () => import('./modules/sales/cheque-status-update/cheque-status-update.module').then(m => m.ChequeStatusUpdateModule) },
  { path: 'sales/grnCancel', loadChildren: () => import('./modules/sales/grn-cancel/grn-cancel.module').then(m => m.GrnCancelModule) },
  { path: 'reports/salesReport', loadChildren: () => import('./modules/reports/sales-report/sales-report.module').then(m => m.SalesReportModule) }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  
}
