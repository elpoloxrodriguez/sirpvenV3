import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DatePipe } from '@angular/common';

import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { coreConfig } from 'app/app-config';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { DashboardModule } from 'app/main/dashboard/dashboard.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

// Subir Archivos
import { AngularFileUploaderModule } from "angular-file-uploader";
import { HashLocationStrategy, JsonPipe, LocationStrategy } from '@angular/common';

import { AuthGuardGuard } from '@core/services/seguridad/auth-guard.guard';

import { AuthInterceptorService } from '@core/services/seguridad/auth-interceptor.service';
import { AuthLoginV2Component } from './main/pages/authentication/auth-login-v2/auth-login-v2.component';
import { ErrorInterceptor, JwtInterceptor } from './auth/helpers';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ContentHeaderModule } from './layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { ChartsModule } from 'ng2-charts';
import { AuthAdminComponent } from './main/pages/authentication/auth-admin/auth-admin.component';
import { PriceTableComponent } from './main/sirp-ven/module-opp-sub/postage/price-table/price-table.component';
import { StatementOfPartiesComponent } from './main/sirp-ven/module-opp-sub/postage/statement-of-parties/statement-of-parties.component';
import { ReportsRankingComponent } from './main/sirp-ven/module-opp-sub/opp-reports/reports-ranking/reports-ranking.component';
import { DigitalFileOppModule } from './main/sirp-ven/module-admin/digital-file-opp/digital-file-opp.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

//  subir Archivos

// Recaptcha V3
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
//  Recaptcha V2
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { PaymentsObligationsComponent } from './main/sirp-ven/module-admin/payments-obligations/payments-obligations/payments-obligations.component';
import { BranchOfficesComponent } from './main/sirp-ven/module-opp-sub/business/branch-offices/branch-offices/branch-offices.component';
import { OppReportsModule } from './main/sirp-ven/module-opp-sub/opp-reports/opp-reports.module';
import { ProfileComponent } from './main/sirp-ven/users/profile/profile.component';

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';


registerLocaleData(localeEs);



const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule),
  },
  {
    path: '**',
    redirectTo: '/miscellaneous/error' //Error 404 - Page not found
  }
];

@NgModule({
  declarations: [
    AppComponent,
    // AuthAdminComponent,
    PriceTableComponent,
    StatementOfPartiesComponent,
    ReportsRankingComponent,
    PaymentsObligationsComponent,
    BranchOfficesComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    NgxDatatableModule,
    ChartsModule,
    DigitalFileOppModule,
    BrowserAnimationsModule,
    HttpClientModule,

    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled', // Add options right here
      relativeLinkResolution: 'legacy',
      useHash: true
    }),
    TranslateModule.forRoot(),
    BlockUIModule.forRoot(),
    // NgBootstrap,
    NgbModule,

    // Core modules
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    AngularFileUploaderModule,
    CoreThemeCustomizerModule,

    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,

    //  Recaptcha V3
    RecaptchaV3Module,
    //  Recaptcha V2
    RecaptchaFormsModule,
    RecaptchaModule,


    // App modules
    LayoutModule,
    DashboardModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    // PagesModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: [LocationStrategy, AuthGuardGuard, JsonPipe], useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
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
  bootstrap: [AppComponent]
})
export class AppModule { }
