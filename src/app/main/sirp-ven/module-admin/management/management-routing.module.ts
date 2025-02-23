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
import { PrivatePostalOperatorComponent } from './private-postal-operator/private-postal-operator.component'
import { RegisterOppComponent } from 'app/main/pages/authentication/register-opp/register-opp.component'
import { AuthRegisterSubcontratorComponent } from 'app/main/pages/authentication/auth-register-subcontrator/auth-register-subcontrator.component'

const routes: Routes = [
  {
    path: 'management/private-postal-operator',
    component: PrivatePostalOperatorComponent,
    // canActivate:[AuthGuardGuard],
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: [3,6] },
  },
  {
    path: 'register-opp',
    component: RegisterOppComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: [3,6] },
  },
  {
    path: 'register-sub',
    component: AuthRegisterSubcontratorComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: [3,6] },
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
export class ManagementRoutingModule { }
