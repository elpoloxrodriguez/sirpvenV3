import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import jwt_decode from "jwt-decode";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UtilService } from '@core/services/util/util.service';
import { Md5 } from 'ts-md5/dist/md5';
import { CambiarClave } from '@core/services/empresa/form-opp.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],
})
export class ProfileComponent implements OnInit {



  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public pass : CambiarClave = {
    id_opp: 0,
    password: ''
  }

  public token
  public Rif
  public Codigo
  public NewUser
  public UsuarioId
  public passwordTextType: boolean;
  public confPasswordTextType: boolean;
  public resetPasswordForm: FormGroup;
  public submitted = false;

  public BtnCambiarClave = 0

  public password1
  public password2

  constructor(
    private utilService: UtilService,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {

    this.token = jwt_decode(sessionStorage.getItem('token'));
    let tok = parseInt(this.token)
    // console.log(this.token.Usuario[0])
    // console.log(tok)
    // if (tok >= 1) {
      // 1 Administrador
      //  0 Usuario Empresa
    //   this.BtnCambiarClave = 1
    // } else {
    //   this.BtnCambiarClave = 0
    // }
    this.UsuarioId = this.token.Usuario[0].UsuarioId
    this.Rif = this.token.Usuario[0].rif
    this.Codigo = this.token.Usuario[0].Codigo
    this.NewUser = `${this.token.Usuario[0].nombre_empresa} (${this.Rif})`

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

  async ChangePassword(){
    const md5 = new Md5();
    const password = md5.appendStr(this.password1).end()
    this.pass.id_opp = this.token.Usuario[0].id_opp
    this.pass.password = password
    this.xAPI.funcion = "IPOSTEL_U_CambiarClaveUsuario";
    this.xAPI.valores = JSON.stringify(this.pass)
    if (this.password1 === this.password2) {
      await this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
         if (data.tipo === 1) {
          this.password1 = ''
          this.password2 = ''
          this.utilService.alertConfirmMini('success', 'Felicidades! Contraseña Actualizada Exitosamente')
         } else {
          this.utilService.alertConfirmMini('error', 'Oops Lo Sentimos! Algo Salio Mal, Verifique e intente nuevamente')
         }
        },
        (error) => {
          console.log(error)
        }
      )
    } else {
      this.utilService.alertConfirmMini('error', 'Oops Lo Sentimos! Las Contraseñas deben ser iguales')
    }
  }


}
