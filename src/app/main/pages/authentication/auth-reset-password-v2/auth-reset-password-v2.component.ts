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
import jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';


@Component({
  selector: 'app-auth-reset-password-v2',
  templateUrl: './auth-reset-password-v2.component.html',
  styleUrls: ['./auth-reset-password-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthResetPasswordV2Component implements OnInit {

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public ResetPWD: IPOSTEL_U_ResetPassword = {
    password: '',
    correo_electronico: ''
  }

  public foto = 'assets/images/background/background.jpeg'

  public Qr
  public TipoVerificacion = [
    { id: 1, name: 'Certificado' },
    // { id: 2, name: 'Filatelia' }
  ]
  public TipoSeleccion
  public tipo


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

  public firstId
  public secondId

  public stoken: { Usuario: { [key: string]: any }[] }
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

    this.uri = this.rutaActiva.snapshot.params['id'];
    this.stoken = jwt_decode(this.uri) as { Usuario: { [key: string]: any }[] };

    try {
      const decodedToken: { exp?: number } = jwt_decode(this.uri); // Decodifica el token
      // console.log('Token decodificado:', decodedToken);

      if (decodedToken.exp) {
        const exp = decodedToken.exp; // Obtén el valor de exp
        const expirationDate = new Date(exp * 1000); // Convierte a fecha
        // console.log('El token expira el:', expirationDate.toUTCString());

        // Verifica si el token ha expirado
        const currentDate = new Date();
        if (currentDate > expirationDate) {
          console.log('El token ha expirado.');
          this.utilservice.alertConfirmMini('error', 'Ooops!<br> Lo sentimos el token ha expirado!');
          this._router.navigate(['/']);
          sessionStorage.clear();
        } else {
          // console.log('El token aún es válido.');
        }
      } else {
        console.error('El token no tiene un campo exp.');
        this.utilservice.alertConfirmMini('error', 'Ooops!<br> El token no tiene un campo exp!');
        this._router.navigate(['/']);
        sessionStorage.clear();
      }
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      this.utilservice.alertConfirmMini('error', 'Ooops!<br> Error al decodificar el token!');
      this._router.navigate(['/']);
      sessionStorage.clear();

    }

  }

  ValidarSeleccion(event, Qr) {
    if (Qr !== undefined) {
      switch (event) {
        case 1:
          this.Certificado(Qr)
          break;
        case 2:
          this.Philately(Qr)
          break;

        default:
          break;
      }
    } else {
      Swal.fire({
        title: 'Oops Lo Sentimos!',
        text: 'El Campo Codigo QR es obligatorio',
        icon: 'warning',
      })
    }
  }

  async Certificado(id: string) {
    // console.log(id)
    this.xAPI.funcion = "IPOSTEL_R_Certificados";
    this.xAPI.parametros = `${id}`
    this.xAPI.valores = ''
    await this.apiService.EjecutarDev(this.xAPI).subscribe(
      (data) => {
        // console.log(data)
        if (data.Cuerpo.length != 0) {
          this.Qr = ''
          this.TipoSeleccion = undefined
          // console.log(data.Cuerpo[0])
          var cert = data.Cuerpo[0]
          switch (cert.type) {
            case 1:
              this.tipo = 'Certificado Unico de Inscripción'
              break;
            case 2:
              this.tipo = 'Autorización Postal'
              break;
            default:
              break;
          }
          Swal.fire({
            html: `
                      <div class="card card-congratulations">
                        <div class="card-body text-center">
                          <div class="avatar avatar-xl bg-primary shadow">
                          </div>
                          <div class="text-center">
                            <h1 class="mb-1 text-white">${cert.nombre_empresa}</h1>
                            <p class="card-text m-auto w-50">
                            RIF: ${cert.rif}
                            </p>
                            <p class="card-text m-auto w-100">
                            DIRECCIÓN: ${cert.direccion_empresa}
                            </p>
                            <p class="card-text m-auto w-75">
                            ${cert.correo_electronico}
                            </p>
                          </div>
                          <br>
                          <p align="left">
                          ${this.tipo}
                          </p>
                          <p align="right">
                          ${cert.token}
                          </p>
                        </div>
                      </div>
                `,
            footer: `
                <div class="auth-footer-btn d-flex justify-content-center">
                  <p class="text-center mt-2">
                <small align="center"><strong>INSTITUTO POSTAL TELEGRÁFICO DE VENEZUELA</strong> <br>  RIF G-20000043-0
                <br>
                Dirección : Avenida José Ángel Lamas, San Martín, Caracas, edificio Centro Postal Caracas, Distrito Capital
                <br>
                E-mail: <a href="mailto:tsuarez@ipostel.gob.ve">tsuarez@ipostel.gob.ve</a>
                <br>
                Telf: <a href="Tel:02124053340">0212-405.33.40</a> / 0412-711.08.00 / fax: 0212-405.33.66
                </small>
                </p>
              </div>
                `,
            icon: 'success',
            width: '900px',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showConfirmButton: false,
            showCloseButton: true,
          })
        } else {
          // this.Qr = ''
          Swal.fire({
            title: 'Certificado NO Valido!',
            text: 'Lo sentimos, este certificado no es generado por nuestro sistema.',
            icon: 'error',
          })
        }
      },
      (error) => {
        //   console.log(error)
        this.utilservice.alertMessageAutoCloseTimer(5000, '<font color="red">Estimado Usuario</font>', '<strong><h4>En este momento estamos presentando fallas de conexión, intente de nuevo</h4></strong>')
      }
    )
  }

  async Philately(id: string) {
    Swal.fire({
      title: 'Franqueo Postal Previo',
      text: 'El Codigo del QR es de prueba',
      icon: 'warning',
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Custom image',
    })
    this.Qr = ''
    this.TipoSeleccion = undefined

  }

  async ResetPassword() {
    // Validar que las contraseñas coincidan
    if (this.resetPasswordForm.value.newPassword !== this.resetPasswordForm.value.confirmPassword) {
      this.utilservice.alertConfirmMini('error', '<font color="red">Oops!</font> <br> Las contraseñas no coinciden. Verifique e intente de nuevo.');
      return; // Detener la ejecución si las contraseñas no coinciden
    }

    this.ResetPWD.correo_electronico = this.stoken.Usuario[0].correo_electronico;
    this.ResetPWD.password = this.utilservice.md5(this.resetPasswordForm.value.newPassword);
    this.xAPI.funcion = 'IPOSTEL_U_ResetPassword';
    this.xAPI.parametros = '';
    this.xAPI.valores = JSON.stringify(this.ResetPWD);

    try {
      const data = await this.apiService.EjecutarDev(this.xAPI).toPromise();
      if (data.tipo == 1) {
        this.utilservice.alertConfirmMini('success', 'Felicidades<br> su contraseña fue actualizada satisfactoriamente!');
        this._router.navigate(['/']);
        sessionStorage.clear();
      } else {
        this.utilservice.alertConfirmMini('error', '<font color="red">Oops Lo sentimos!</font> <br> Algo salio mal!, Verifique e intente de nuevo');
      }
    } catch (error) {
      console.error(error);
    }
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
