import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AngularFileUploaderModule } from "angular-file-uploader";


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MiscellaneousModule } from '../pages/miscellaneous/miscellaneous.module';

import { BlockUIModule } from 'ng-block-ui';

import { DashboardComponent } from './principal/dashboard.component';
import { OppComponent } from '../sirp-ven/module-opp-sub/business/opp/opp.component';

import { PaymentsListComponent } from '../sirp-ven/module-opp-sub/payments/payments-list/payments-list.component';
import { PaymentsRoutingModule } from '../sirp-ven/module-opp-sub/payments/payments-routing.module';
import { PostagePerMonthComponent } from '../sirp-ven/module-opp-sub/postage/postage-per-month/postage-per-month.component';
import { ManagementRoutingModule } from '../sirp-ven/module-admin/management/management-routing.module';
import { ReportsAdminComponent } from '../sirp-ven/module-admin/admin-reports/reports-admin/reports-admin.component';
import { SystemPullComponent } from '../sirp-ven/module-admin/update-system/system-pull/system-pull.component';
import { UpdateSystemRoutingModule } from '../sirp-ven/module-admin/update-system/update-system-routing.module';
import { OppReportsRoutingModule } from '../sirp-ven/module-opp-sub/opp-reports/opp-reports-routing.module';
import { ListPaymentsComponent } from '../sirp-ven/module-admin/trakings/list-payments/list-payments.component';
import { PostageRoutingModule } from '../sirp-ven/module-opp-sub/postage/postage-routing.module';
import { BusinessRoutingModule } from '../sirp-ven/module-opp-sub/business/business-routing.module';
import { AdminReportsRoutingModule } from '../sirp-ven/module-admin/admin-reports/admin-reports-routing.module';
import { TrakingsRoutingModule } from '../sirp-ven/module-admin/trakings/trakings-routing.module';
import { DigitalFileOppRoutingModule } from '../sirp-ven/module-admin/digital-file-opp/digital-file-opp-routing.module';
import { PrivatePostalOperatorComponent } from '../sirp-ven/module-admin/management/private-postal-operator/private-postal-operator.component';
import { PriceTableOppComponent } from '../sirp-ven/module-admin/postage/price-table-opp/price-table-opp.component';
import { PostageOppModule } from '../sirp-ven/module-admin/postage/postage.module';
import { ConnectionSettingsComponent } from '../sirp-ven/module-admin/settings/connection-settings/connection-settings.component';
import { SettingsModule } from '../sirp-ven/module-admin/settings/settings.module';
import { PostalSolvencyComponent } from '../sirp-ven/module-admin/postal-solvency/postal-solvency.component';
import { PostalSolvencyModule } from '../sirp-ven/module-admin/postal-solvency/postal-solvency.module';
import { FinesPenaltiesComponent } from '../sirp-ven/module-admin/fines-and-penalties/fines-penalties/fines-penalties.component';
import { FinesAndPenaltiesModule } from '../sirp-ven/module-admin/fines-and-penalties/fines-and-penalties.module';
import { PanelAsistenteVirtualComponent } from '../asistente-virtual/panel-asistente-virtual/panel-asistente-virtual.component';
import { SystemUsersComponent } from '../sirp-ven/module-admin/settings/system-users/system-users.component';
import { PaymentsObligationsModule } from '../sirp-ven/module-admin/payments-obligations/payments-obligations.module';
import { BranchOfficesModule } from '../sirp-ven/module-opp-sub/business/branch-offices/branch-offices.module';
import { ReportsRankingComponent } from '../sirp-ven/module-opp-sub/opp-reports/reports-ranking/reports-ranking.component';
import { UsersModule } from '../sirp-ven/users/users.module';
import { AuditModule } from '../audit/audit.module';
import { PaymetRelationsRoutingModule } from '../sirp-ven/module-admin/paymet-relations/paymet-relations-routing.module';
import { PaymetRelationsModule } from '../sirp-ven/module-admin/paymet-relations/paymet-relations.module';
import { LicenseRoutingModule } from '../license/license-routing.module';
import { ReportPaymentComponent } from '../license/report-payment/report-payment.component';
import { MaintenanceComponent } from '../sirp-ven/module-opp-sub/payments/maintenance/maintenance.component';
import { ObligationsComponent } from '../sirp-ven/module-opp-sub/payments/obligations/obligations.component';




@NgModule({
  declarations: [
    DashboardComponent,
    OppComponent,
    PaymentsListComponent,
    MaintenanceComponent,
    ObligationsComponent,
    PostagePerMonthComponent,
    ReportsAdminComponent,
    SystemPullComponent,
    ListPaymentsComponent,
    PrivatePostalOperatorComponent,
    PriceTableOppComponent,
    ConnectionSettingsComponent,
    PostalSolvencyComponent,
    FinesPenaltiesComponent,
    PanelAsistenteVirtualComponent,
    SystemUsersComponent,
    ReportPaymentComponent
  ],
  imports: [
    CommonModule,
    AngularFileUploaderModule,
    NgxDatatableModule,
    BlockUIModule,
    DashboardRoutingModule,
    PaymentsRoutingModule,
    ManagementRoutingModule,
    CommonModule,
    ContentHeaderModule,
    CoreCommonModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MiscellaneousModule,
    UpdateSystemRoutingModule,
    OppReportsRoutingModule,
    PostageRoutingModule,
    BusinessRoutingModule,
    AdminReportsRoutingModule,
    TrakingsRoutingModule,
    DigitalFileOppRoutingModule,
    PostageOppModule,
    SettingsModule,
    PostalSolvencyModule,
    FinesAndPenaltiesModule,
    PaymentsObligationsModule,
    BranchOfficesModule,
    UsersModule,
    AuditModule,
    PaymetRelationsRoutingModule,
    LicenseRoutingModule
  ],
  exports: [],
  providers: [DatePipe]

})
export class DashboardModule { }



