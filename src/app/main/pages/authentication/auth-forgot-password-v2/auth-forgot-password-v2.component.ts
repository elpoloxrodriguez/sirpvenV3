import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CoreConfigService } from '@core/services/config.service';
import { UtilService } from '@core/services/util/util.service';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-auth-forgot-password-v2',
  templateUrl: './auth-forgot-password-v2.component.html',
  styleUrls: ['./auth-forgot-password-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthForgotPasswordV2Component implements OnInit {

  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    valores : {},
  };

  public  img
  public appLogoImage
  public appName

  public SelectedTipoRegistro = [
    {id: '1', name: 'Operador Postal Privado'},
    {id: '2', name: 'Subcontratista'}
  ]
  public SelectedTipoEmpresa = []

  public SelectedTipoAgencia = []

  public SelectedTipologia = []
  
  public tokenPWD

  
  // Public
  public emailVar;
  public coreConfig: any;
  public forgotPasswordForm: FormGroup;
  public submitted = false;

  public show = false
  public btn = false
  public btnValidarCorreo = 'Validar Correo Electronico'
  public btnRestablecerCorreo = 'Restablecer Contraseña'

  public inputEmail
  public inputRif
  public inputTipoRegistro
  public inputTipologia
  public inputTipoAgencia
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   *
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private utilservice: UtilService,
    private apiService: ApiService,
    private _router: Router,
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
    return this.forgotPasswordForm.controls;
  }

  /**
   * On Submit
   */
  async onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }    
    this.xAPI.funcion = 'IPOSTEL_R_forgotpassword1'
    this.xAPI.parametros = this.forgotPasswordForm.value.email
    this.xAPI.valores = ''
    await this.apiService.EjecutarDev(this.xAPI).subscribe(
      (data) => {
           if (data.Cuerpo.length > 0) {
      this.show = true
      this.btn = true
    } else {
        this.utilservice.alertConfirmMini('error','<font color="red">Oops Lo sentimos!</font><br> Correo Electronico no valido, verifiquelo e intente de nuevo')
    }
      },
      (error) => {
        console.error(error)
      }
    )
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  async ngOnInit() {
    this.forgotPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });


    await this.Select_TipoAgencia()
    await this.Select_TipologiaEmpresa()

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
      this.img = this.coreConfig.layout.skin
      this.appLogoImage = this.coreConfig.app.appLogoImage
      this.appName = this.coreConfig.app.appName

    });
  }

  async Select_TipoAgencia() {
    this.xAPI.funcion = 'IPOSTEL_tipo_agencia'
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    await this.apiService.EjecutarDev(this.xAPI).subscribe(
      (data) => {
        this.SelectedTipoAgencia = data.Cuerpo.map(e => {
          e.id = e.id_tipo_agencia
          e.name = e.nombre_tipo_agencia
          return e
        })
      },
      (error) => {
        console.error(error)
      }
    )
  }

  async Select_TipologiaEmpresa() {
    this.xAPI.funcion = 'IPOSTEL_tipologia_empresa'
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    await this.apiService.EjecutarDev(this.xAPI).subscribe(
      (data) => {
        this.SelectedTipologia = data.Cuerpo.map(e => {
          e.id = e.id_tipologia
          e.name = e.nombre_tipologia
          return e
        })
      },
      (error) => {
        console.error(error)
      }
    )
  }


  async ValidarInfo(){
    this.xAPI.funcion = 'IPOSTEL_R_forgotpassword2'
    this.xAPI.parametros = this.forgotPasswordForm.value.email+','+this.inputRif+','+this.inputTipoRegistro+','+this.inputTipologia+','+this.inputTipoAgencia
    this.xAPI.valores = ''
    await this.apiService.EjecutarDev(this.xAPI).subscribe(
      (data) => {
           if (data.Cuerpo.length > 0) {
        this.tokenPWD = this.utilservice.TokenAleatorio(50)
        sessionStorage.setItem("TokenResetPassEmail", btoa(this.forgotPasswordForm.value.email));
        sessionStorage.setItem("TokenResetPass", btoa(this.tokenPWD));
        this.utilservice.alertConfirmMini('success',' Datos Validos <br> por favor ingrese la nueva contraseña')
        this._router.navigate(['reset-password/',this.tokenPWD])
    } else {
        this.utilservice.alertConfirmMini('warning','<font color="red">Oops Lo sentimos!</font><br> Alguno de los campos son incorrectos, verifiquelos e intente de nuevo')
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
