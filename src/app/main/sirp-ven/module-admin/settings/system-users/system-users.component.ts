import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { IPOSTEL_C_PagosDeclaracionOPP_SUB, IPOSTEL_C_UsuarioAdmin, IPOSTEL_DATA_DELEGADOP_ID, IPOSTEL_DATA_EMPRESA_ID, IPOSTEL_DATA_REPRESENTANTE_LEGAL_ID, IPOSTEL_I_OtorgamientoConcesion, IPOSTEL_U_CambiarStatusOPPSUB, IPOSTEL_U_Status_Opp_Sub, IPOSTEL_U_UsuarioAdmim } from '@core/services/empresa/form-opp.service';
import { UtilService } from '@core/services/util/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jwt_decode from "jwt-decode";
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import {Md5} from 'ts-md5/dist/md5';


@Component({
  selector: 'app-system-users',
  templateUrl: './system-users.component.html',
  styleUrls: ['./system-users.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SystemUsersComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public ICrearUsuariosAdmin : IPOSTEL_C_UsuarioAdmin = {
    email: '',
    role: undefined,
    id_user: 0,
    status: undefined,
    password: '',
    nombres_user: '',
    apellidos_user: '',
    cedula_user: '',
    created_user: 0,
    created_date: ''
  }

  public IUpdateUsuario : IPOSTEL_U_UsuarioAdmim = {
    email: '',
    role: undefined,
    status: undefined,
    nombres_user: '',
    apellidos_user: '',
    cedula_user: '',
    updated_user: 0,
    updated_date: '',
    id_user: 0
  }

  public ListaStatus = [
    { id: 1, name: 'Activo'},
    { id: 0, name: 'Inactivo'}
  ]

  public ListaPerfiles = [
    { id: 3, name: 'Administrador'},
    { id: 4, name: 'Tecnología'},
    { id: 5, name: 'Archivo Postal'},
    { id: 6, name: 'Recaudación'},
  ]


  public UserId
  public IdUser
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public searchValue = '';


  public passwordTextType: boolean;
  public confPasswordTextType: boolean;
  public resetPasswordForm: FormGroup;
  public submitted = false;


  public token
  public dataUser
  public ListaUsuario = []
  public rowsUsuarios
  public tempDataUsuarios = []
  public TipoRegistro

  public title_modal

  public btnUpdate = false
  public titleModal


  constructor(
    private apiService: ApiService,
    private utilservice: UtilService,
    private modalService: NgbModal,
    private router: Router,
    private _formBuilder: FormBuilder,
  ) { }

  async ngOnInit() {
    this.token =  jwt_decode(sessionStorage.getItem('token'));
    this.UserId = this.token.Usuario[0].id_user

    this.resetPasswordForm = this._formBuilder.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
    await this.ListaUsuarios()
  }

  async ListaUsuarios(){
    this.xAPI.funcion = "IPOSTEL_R_ListUsers_ADMIN";
    this.xAPI.parametros = '';
     await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(element => {
          element.nombres = element.nombres_user +' '+ element.apellidos_user
          this.ListaUsuario.push(element);
        });
        this.rowsUsuarios =  this.ListaUsuario
        this.tempDataUsuarios = this.rowsUsuarios
      },
      (error) => {
        console.log(error)
      }
    )
  }

  ChangePassword(){
    let clave = this.resetPasswordForm.value.newPassword
    let usuario = this.dataUser
    this.ChangePasswordUsers(usuario,clave)
  }


  ModalDetails(modal, data) {
    this.dataUser = data.UsuarioId
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async ChangePasswordUsers(usuario: any, clave: any){
  
  let datos = {
    usuario: usuario,
	  clave:  this.utilservice.md5(clave)
  }
  this.xAPI.funcion = 'RECOSUP_U_PasswordUsers_ADMIN'
  this.xAPI.parametros = ''
  this.xAPI.valores = JSON.stringify(datos)
  await this.apiService.Ejecutar(this.xAPI).subscribe(
    (data) => {
      // console.info(data)
      this.modalService.dismissAll('Close')
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'success',
        title: 'Contraseña actualizada exitosamente'
      })
    },
    (error) => {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'error',
        title: error
      })
    }
  )
  }


  filterUpdate(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataUsuarios.filter(function (d) {
      return d.nombres.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsUsuarios = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
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
  

    CrearUsuario(modal){
      this.titleModal = 'Registrar Usuario Administrador'
      this.modalService.open(modal, {
        centered: true,
        size: 'lg',
        backdrop: false,
        keyboard: false,
        windowClass: 'fondo-modal',
      });
    }

    UpdateUsuario(modal, data){
      this.btnUpdate = true
      this.titleModal = 'Actualizar Usuario Administrador'
      this.IUpdateUsuario.id_user = data.id_user
      this.ICrearUsuariosAdmin.email = data.email
      this.ICrearUsuariosAdmin.password = data.password
      this.ICrearUsuariosAdmin.nombres_user = data.nombres_user
      this.ICrearUsuariosAdmin.apellidos_user = data.apellidos_user
      this.ICrearUsuariosAdmin.cedula_user = data.cedula_user
      this.ICrearUsuariosAdmin.role = data.role
      this.ICrearUsuariosAdmin.status = data.status

      this.modalService.open(modal, {
        centered: true,
        size: 'lg',
        backdrop: false,
        keyboard: false,
        windowClass: 'fondo-modal',
      });
    }

    async ActualizarUsuarios(){
      this.IUpdateUsuario.email = this.ICrearUsuariosAdmin.email
      this.IUpdateUsuario.nombres_user = this.ICrearUsuariosAdmin.nombres_user
      // this.IUpdateUsuario.password = this.ICrearUsuariosAdmin.password
      this.IUpdateUsuario.apellidos_user = this.ICrearUsuariosAdmin.apellidos_user
      this.IUpdateUsuario.cedula_user = this.ICrearUsuariosAdmin.cedula_user
      this.IUpdateUsuario.role = this.ICrearUsuariosAdmin.role
      this.IUpdateUsuario.status = this.ICrearUsuariosAdmin.status
      this.IUpdateUsuario.updated_user = this.UserId
      this.IUpdateUsuario.updated_date = this.utilservice.FechaActual()
      this.xAPI.funcion = "IPOSTEL_U_UsuarioAdmim";
      this.xAPI.parametros = ''
      this.xAPI.valores = JSON.stringify(this.IUpdateUsuario)
       await this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          this.rowsUsuarios.push(this.ListaUsuario)
          if (data.tipo === 1) {
            this.ListaUsuario = []
            this.ListaUsuarios()
            this.modalService.dismissAll('Close')
            this.utilservice.alertConfirmMini('success', 'Usuario Actualizado Exitosamente!')
            this.router.navigate(['/settings/system-users']).then(() => { window.location.reload() });
          } else {
            this.utilservice.alertConfirmMini('warning', 'Oops, Lo sentimos ocurrio un error, intente de nuevo mas tarde')
          }
        },
        (error) => {
          console.error(error)
        }
       )
    }


    async RegistrarUsuarios(){
      // const md5 = new Md5();
      // const password =  md5.appendStr(this.ICrearUsuariosAdmin.password).end()
      this.ICrearUsuariosAdmin.created_user = this.UserId
      this.ICrearUsuariosAdmin.created_date = this.utilservice.FechaActual()
      this.ICrearUsuariosAdmin.password = this.utilservice.md5(this.ICrearUsuariosAdmin.password)
      this.xAPI.funcion = "IPOSTEL_C_UsuarioAdmin";
      this.xAPI.parametros = ''
      this.xAPI.valores = JSON.stringify(this.ICrearUsuariosAdmin)
      await this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          this.rowsUsuarios.push(this.ListaUsuario)
          if (data.tipo === 1) {
            this.ListaUsuario = []
            this.ListaUsuarios()
            this.modalService.dismissAll('Close')
            this.utilservice.alertConfirmMini('success', 'Usuario Creado Exitosamente!')
            this.router.navigate(['/settings/system-users']).then(() => { window.location.reload() });
          } else {
            this.utilservice.alertConfirmMini('warning', 'Oops, Lo sentimos ocurrio un error, intente de nuevo mas tarde')
          }
        },
        (error) => {
          console.error(error)
        }
       )
    }

    async DeleteUser(data: any) {
      await Swal.fire({
        title: 'Esta Seguro?',
        text: "De Eliminar Este Registro!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Eliminarlo!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.xAPI.funcion = "IPOSTEL_D_UsuarioAdmin";
          this.xAPI.parametros = `${data.id_user}`
          this.xAPI.valores = ''
          this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
              this.rowsUsuarios = []
              if (data.tipo === 1) {
                this.rowsUsuarios.push(this.ListaUsuario)
                this.ListaUsuario = []
                this.ListaUsuarios()
                this.utilservice.alertConfirmMini('success', 'Registro Eliminado Exitosamente')
              } else {
                this.utilservice.alertConfirmMini('error', 'Lo sentimos algo salio mal, intente de nuevo')
              }
            },
            (error) => {
              console.log(error)
            }
          )
        }
      })
    }

}
