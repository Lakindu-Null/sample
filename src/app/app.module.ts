import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms'; // for Template-driven forms
import { ReactiveFormsModule } from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {InputTextModule} from 'primeng/inputtext';
import {MatSelectModule} from '@angular/material/select';
import {CheckboxModule} from 'primeng/checkbox';
import { authInterceptorProviders } from './AuthInterceptor';
import { TokenStorageService } from './TokenStorage.service';
import { Authenticatorservice } from './auth/services/authentication.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonService } from './Common.service';
import { LoginAuthGuardService } from './auth/services/login-auth-guard.service';
import { LoginComponent } from './auth/login/login.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { DashBoardAuthGuardService } from './auth/services/dashboard-auth-guard.service';
import { MenuService } from './services/menu.service';
import { AuthService } from './auth/services/AuthService';
import { ModuleAuthGuard } from './auth/services/module-auth-guard.service';
import { ContentCardComponent } from './common-modules/content-card/content-card.component';
import { HeaderComponent } from './common-modules/header/header.component';
import { UnauthorizedPageComponent } from './common-modules/unauthorized-page/unauthorized-page.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from './shared/shared.module';
import { ChartModule } from 'primeng/chart';
import { CarouselModule } from 'primeng/carousel';
import {MatGridListModule} from '@angular/material/grid-list';
import { ReportsService } from './services/reports.service';
import { SidenavComponent } from './common-modules/sidenav/sidenav.component';
import { SublevelMenuComponent } from './common-modules/sidenav/sub-level-menu.component';
import { TopbarComponent } from './common-modules/topbar/topbar.component';
import { BodyComponent } from './common-modules/body/body.component';
import { DropdownModule } from 'primeng/dropdown';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    SidenavComponent,
    SublevelMenuComponent,
    BodyComponent,
    TopbarComponent,
    AppComponent,
    ContentCardComponent,
    HeaderComponent,
    UnauthorizedPageComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CarouselModule,
    MatGridListModule,
    ChartModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    InputTextModule,
    MatSelectModule,
    CheckboxModule,
    DropdownModule,
    BadgeModule,
    TooltipModule,
    ToastModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    authInterceptorProviders,
    Authenticatorservice,
    MessageService,
    ReportsService,
    CommonService,
    MenuService,
    DashBoardAuthGuardService,
    ModuleAuthGuard,
    AuthService,
    LoginAuthGuardService,
    TokenStorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
