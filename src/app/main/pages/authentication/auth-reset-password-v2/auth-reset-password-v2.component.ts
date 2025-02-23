import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CoreConfigService } from '@core/services/config.service';
import { Router } from '@angular/router';
import { UtilService } from '@core/services/util/util.service';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { IPOSTEL_U_ResetPassword } from '@core/services/empresa/form-opp.service';

@Component({
  selector: 'app-auth-reset-password-v2',
  templateUrl: './auth-reset-password-v2.component.html',
  styleUrls: ['./auth-reset-password-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthResetPasswordV2Component implements OnInit {

  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    valores : {},
  };

  public ResetPWD : IPOSTEL_U_ResetPassword = {
    password: '',
    correo_electronico: ''
  }


  // Public
  public coreConfig: any;
  public passwordTextType: boolean;
  public confPasswordTextType: boolean;
  public resetPasswordForm: FormGroup;
  public submitted = false;

  public img
  public appLogoImage
  public appName


  public TokenEmail
  public token
  public uri
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private utilservice: UtilService,
    private apiService: ApiService,

    private rutaActiva: ActivatedRoute
    ) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.resetPasswordForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  /**
   * Toggle confirm password
   */
  toggleConfPasswordTextType() {
    this.confPasswordTextType = !this.confPasswordTextType;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  async ngOnInit() {
    this.resetPasswordForm = this._formBuilder.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });


    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
      this.img = this.coreConfig.layout.skin
      this.appLogoImage = this.coreConfig.app.appLogoImage
      this.appName = this.coreConfig.app.appName
    });

    this.token = atob(sessionStorage.getItem('TokenResetPass'))
    this.uri = this.rutaActiva.snapshot.params.id
    if (this.token === this.uri ) {
      
    } else {
      this.utilservice.alertConfirmMini('error','<font color="red">Oops Lo sentimos!</font><br> El Token de verificación es invalido, verifiquelo e intente de nuevo')
      // this._router.navigate(['forgot-password'])
      // sessionStorage.clear();
    }
  }


  async ResetPassword(){
    this.TokenEmail = atob(sessionStorage.getItem('TokenResetPassEmail'))
    this.ResetPWD.correo_electronico = this.TokenEmail
    this.ResetPWD.password = this.utilservice.md5(this.resetPasswordForm.value.newPassword)
    this.xAPI.funcion = 'IPOSTEL_U_ResetPassword'
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.ResetPWD)
    await this.apiService.EjecutarDev(this.xAPI).subscribe(
      (data) => {
        if (data.tipo == 1) {
          this.utilservice.alertConfirmMini('success','Felicidades<br> su contraseña fue actualizada satisfactoriamente!')
          this._router.navigate(['login'])
          sessionStorage.clear();    
        } else {
          this.utilservice.alertConfirmMini('error','<font color="red">Oops Lo sentimos!</font> <br> Algo salio mal!, Verifique e intente de nuevo')
        }
      },
      (error) => {
        console.error(error)
      }
    )
  }


  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
