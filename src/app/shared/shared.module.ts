import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DropdownModule } from 'primeng/dropdown';
import { LoaderComponent } from '../common-modules/loader/loader.component';
import {ColorPickerModule} from 'primeng/colorpicker';
import {MatStepperModule} from '@angular/material/stepper';
import { InputNumberModule } from 'primeng/inputnumber';
import { NumbersOnlyDirective } from '../util/numbers-only.directive';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [LoaderComponent,NumbersOnlyDirective],
  imports: [
    CommonModule,
    ToastModule,
    FormsModule,
    MatSelectModule,
    DropdownModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    BreadcrumbModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatStepperModule,
    InputNumberModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    InputTextModule,
    TooltipModule,
    TableModule,
    CheckboxModule,
    ButtonModule,
    CalendarModule,
    AutoCompleteModule
  ],
  exports: [
    CommonModule,
    ToastModule,
    TranslateModule,
    MatSelectModule,
    LoaderComponent,
    FormsModule,
    DropdownModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    BreadcrumbModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    ColorPickerModule,
    MatDatepickerModule,
    MatStepperModule,
    InputNumberModule,
    NumbersOnlyDirective,
    InputTextModule,
    TooltipModule,
    TableModule,
    CheckboxModule,
    ButtonModule,
    CalendarModule,
    AutoCompleteModule
  ]
})
export class SharedModule { }
