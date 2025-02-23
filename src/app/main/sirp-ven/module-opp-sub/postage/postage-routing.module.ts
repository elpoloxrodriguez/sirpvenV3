import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { NgSelectModule } from '@ng-select/ng-select'
import { CoreCommonModule } from '@core/common.module'
import { TranslateModule } from '@ngx-translate/core'
import { AuthGuardGuard } from '@core/services/seguridad/auth-guard.guard';
import { AuthGuard } from 'app/auth/helpers';
import { Role } from 'app/auth/models';
import { PriceTableComponent } from './price-table/price-table.component'
import { StatementOfPartiesComponent } from './statement-of-parties/statement-of-parties.component'
import { PostagePerMonthComponent } from './postage-per-month/postage-per-month.component'

const routes: Routes = [
  {
    path: 'postage/price-table',
    component: PriceTableComponent,
    // canActivate:[AuthGuardGuard],
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: [1] },
  },
  {
    path: 'postage/postage-per-month',
    component: PostagePerMonthComponent,
    // canActivate:[AuthGuardGuard],
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: [1] },
  },
  {
    path: 'postage/movement-of-parts/:id',
    component: StatementOfPartiesComponent,
    // canActivate:[AuthGuardGuard],
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: [1] },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    CoreCommonModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [RouterModule]
})
export class PostageRoutingModule { }
