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
import { OppComponent } from './opp/opp.component'

const routes: Routes = [
  {
    path: 'business/opp',
    component: OppComponent,
    // canActivate:[AuthGuardGuard],
    canActivate: [AuthGuard,AuthGuardGuard],
    // data: { roles: ['0','1','2','3','4','5','6','7','8','9'] },
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
export class BusinessRoutingModule { }
