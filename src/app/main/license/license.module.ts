import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DatePipe} from '@angular/common';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { CsvModule } from '@ctrl/ngx-csv';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { BlockUIModule } from 'ng-block-ui';


import { AngularFileUploaderModule } from "angular-file-uploader";
import { LicenseRoutingModule } from './license-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CoreCommonModule,
    ContentHeaderModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgbModule,
    NgSelectModule,
    BlockUIModule,
    CsvModule,
    AngularFileUploaderModule,
    LicenseRoutingModule
  ]
})
export class LicenseModule { }
