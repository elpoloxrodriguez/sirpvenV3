import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreCommonModule } from '@core/common.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';



//  subir Environment
import { environment } from '../../../../environments/environment';
// Recaptcha V3
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
//  Recaptcha V2
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';



import { AuthLoginV2Component } from 'app/main/pages/authentication/auth-login-v2/auth-login-v2.component';
import { AuthResetPasswordV2Component } from './auth-reset-password-v2/auth-reset-password-v2.component';
import { AuthForgotPasswordV2Component } from './auth-forgot-password-v2/auth-forgot-password-v2.component';
import { AuthAdminComponent } from './auth-admin/auth-admin.component';
import { AuthRegisterSubcontratorComponent } from './auth-register-subcontrator/auth-register-subcontrator.component';
import { BlockUIModule } from 'ng-block-ui';
import { FooterComponent } from './footer/footer.component';
import { AuthGuardGuard } from '@core/services/seguridad/auth-guard.guard';
import { AsistenteVirtualComponent } from 'app/main/asistente-virtual/asistente-virtual/asistente-virtual.component';
import { RegisterOppComponent } from './register-opp/register-opp.component';



// routing
const routes: Routes = [
  {
    path: 'login',
    component: AuthLoginV2Component,
    // canActivate: [AuthGuard,AuthGuardGuard],
  },
  {
    path: 'certificate/:id',
    component: AuthLoginV2Component,
    // canActivate: [AuthGuard,AuthGuardGuard],
  },
  {
    path: 'philately/:id',
    component: AuthLoginV2Component,
    // canActivate: [AuthGuard,AuthGuardGuard],
  },
  {
    path: 'sirpv-admin',
    component: AuthAdminComponent,
  },
  {
    path: '',
    component: AuthLoginV2Component,
  },
  // {
  //   path: 'register-private-post-offices',
  //   component: RegisterOppComponent,
  // },
  // {
  //   path: 'register-private-post-offices-subcontrator',
  //   component: AuthRegisterSubcontratorComponent,
  // },
  {
    path: 'reset-password/:id',
    component: AuthResetPasswordV2Component,
  },
  {
    path: 'forgot-password',
    component: AuthForgotPasswordV2Component,
  },
];

@NgModule({
  declarations: [
    AuthLoginV2Component,
    AuthResetPasswordV2Component,
    AuthForgotPasswordV2Component,
    AuthRegisterSubcontratorComponent,
    FooterComponent,
    AsistenteVirtualComponent,
    AuthAdminComponent,
    RegisterOppComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CoreCommonModule,
    ContentHeaderModule,
    BlockUIModule,
    CardSnippetModule,
    //  Recaptcha V3
    RecaptchaV3Module,
    //  Recaptcha V2
    RecaptchaFormsModule,
    RecaptchaModule,
  ],
  providers: [
    //  Recaptcha V3
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptcha.siteKey },
    // Recaptcha V2
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    },
    // Fin de Recaptcha
  ],
})
export class AuthenticationModule { }
