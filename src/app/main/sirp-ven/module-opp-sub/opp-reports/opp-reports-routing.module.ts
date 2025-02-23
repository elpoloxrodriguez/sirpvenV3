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
import { ReportsRankingComponent } from './reports-ranking/reports-ranking.component'

const routes: Routes = [
  {
    path: 'opp-reports/reports-ranking',
    component: ReportsRankingComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: [1] },

  }
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
export class OppReportsRoutingModule { }
