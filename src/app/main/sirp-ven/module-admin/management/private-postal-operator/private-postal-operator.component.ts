import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { ICrearCertificados, IPOSTEL_C_PagosDeclaracionOPP_SUB, IPOSTEL_DATA_DELEGADOP_ID, IPOSTEL_DATA_EMPRESA_ID, IPOSTEL_DATA_REPRESENTANTE_LEGAL_ID, IPOSTEL_I_OtorgamientoConcesion, IPOSTEL_U_CambiarStatusOPPSUB, IPOSTEL_U_Status_Opp_Sub } from '@core/services/empresa/form-opp.service';
import { UtilService } from '@core/services/util/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jwt_decode from "jwt-decode";
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { PdfService } from '@core/services/pdf/pdf.service';
import { parse } from 'path';
import { GenerarPagoService } from '@core/services/generar-pago.service';

@Component({
  selector: 'app-private-postal-operator',
  templateUrl: './private-postal-operator.component.html',
  styleUrls: ['./private-postal-operator.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrivatePostalOperatorComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public ICrearConcesion: IPOSTEL_I_OtorgamientoConcesion = {
    id_opp: undefined,
    status_curp: undefined,
    punto_cuenta_curp: undefined,
    fecha_punto_cuenta_curp: undefined,
    concesion_postal_curp: undefined,
    n_contrato_curp: undefined,
    periodo_contrato_curp: undefined,
    n_archivo_curp: undefined,
    tomo_archivo_curp: undefined,
    fecha_archivo_curp: undefined,
    user_created: undefined,
    tiempo_concesion: 0
  }

  public IpagarRecaudacion: IPOSTEL_C_PagosDeclaracionOPP_SUB = {
    id_opp: 0,
    status_pc: 0,
    tipo_pago_pc: 0,
    monto_pc: '',
    monto_pagar: '',
    dolar_dia: '',
    petro_dia: '',
    archivo_adjunto: undefined,
    user_created: 0,
    fecha_pc: '',
    mantenimiento: ''
  }

  public DataEmpresa: IPOSTEL_DATA_EMPRESA_ID = {
    id_opp: undefined,
    nombre_empresa: undefined,
    rif: undefined,
    role: undefined,
    status_empresa: undefined,
    tipo_registro: undefined,
    opp: undefined,
    direccion_empresa: undefined,
    estado_empresa: undefined,
    ciudad_empresa: undefined,
    parroquia_empresa: undefined,
    correo_electronico: undefined,
    empresa_facebook: undefined,
    empresa_instagram: undefined,
    empresa_twitter: undefined,
    tipo_agencia: undefined,
    nombre_tipo_agencia: undefined,
    sucursales: undefined,
    subcontrataciones: undefined,
    tipologia_empresa: undefined,
    nombre_tipologia: undefined,
    tipo_servicio: undefined,
    especificacion_servicio: undefined,
    licencia_actividades_economicas_municipales: undefined,
    actividades_economicas_seniat: undefined,
    certificado_rupdae: undefined,
    patronal_ivss: undefined,
    matricula_inces: undefined,
    identificacion_laboral_ministerio_trabajo: undefined,
    certificado_eomic: undefined,
    permiso_bomberos: undefined,
    registro_sapi: undefined,
    registro_nacional_contratista: undefined,
    flota_utilizada: undefined,
    cantidad_trabajadores: undefined,
    cantidad_subcontratados: undefined,
    municipio_empresa: undefined
  }

  public DataRepresentanteLegal: IPOSTEL_DATA_REPRESENTANTE_LEGAL_ID = {
    apellidos_representante_legal: undefined,
    cargo_representante_legal: undefined,
    cedula_representante_legal: undefined,
    direccion_representante_legal: undefined,
    email_representante_legal: undefined,
    facebook_representante_legal: undefined,
    fecha_registro: undefined,
    id_opp: undefined,
    id_representante_legal: undefined,
    instagram_representante_legal: undefined,
    n_registro: undefined,
    nombres_representante_legal: undefined,
    telefono_movil_representante_legal: undefined,
    telefono_residencial_representante_legal: undefined,
    tomo: undefined,
    twitter_representante_legal: undefined,
    fecha_registro_contrato: undefined,
    tomo_contrato: undefined,
    n_registro_contrato: undefined
  }

  public DataDelegado: IPOSTEL_DATA_DELEGADOP_ID = {
    apellidos_delegado: undefined,
    cargo_delegado: undefined,
    cedula_delegado: undefined,
    email_delegado: undefined,
    facebook_delegado: undefined,
    id_delegado: undefined,
    id_opp: undefined,
    instagram_delegado: undefined,
    nombres_delegado: undefined,
    telefono_delegado: undefined,
    twitter_delegado: undefined
  }

  public IUpdateStatusEmpresa: IPOSTEL_U_CambiarStatusOPPSUB = {
    status_empresa: undefined,
    observacion: '',
    id_opp: 0
  }

  public fecha = new Date('yyyy-MM-dd HH:mm:ss');
  public fechax = new Date();
  public aniox = this.fechax.getFullYear();
  public anio = this.fecha.getFullYear();
  public mes = this.fechax.getMonth();
  public hora
  public fecha_Actual_convert
  public hora_Actual_convert
  public n_curp

  public ListaOPPSUB = []
  public DolarPetroDia: number = 0
  public obligacion
  public observacion

  public monto: number = 0
  public pPetro: number = 0
  public conversion: number = 0
  public pDolar: number = 0
  public tasa_petro:any = 0



  public ListaTipoObligacion = []

  public title = ''

  public cantidadObligaciones = 0


  public showIncumplimiento: boolean = false


  public DatosEmpresa = []
  public DatosSub_OPP = []


  public CrearCert: ICrearCertificados = {
    usuario: 0,
    token: '',
    type: 0,
    created_user: 0
  }

  public loadingIndicator: boolean = true;

  public loadingIndicatorSub: boolean = true

  public IdUser
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public searchValue = '';
  public searchValueCOMBINACION = ''
  public searchValueListaSubC = ''

  public passwordTextType: boolean;
  public passwordTextTypeX: boolean;

  public SelectStatus = [
    { id: 0, name: 'Inactivo' },
    { id: 1, name: 'Activo' },
    { id: 2, name: 'Revocatoria' },
    { id: 3, name: 'Finiquito' },
    { id: 4, name: 'No Movilización de Piezas' },
  ]

  public cantidadCombinacion: number


  public rowsCOMBINACION
  public tempDataCOMBINACION = []
  public List_COMBINACION = []

  public rowsListaSubC
  public tempDataListaSubC = []
  public List_ListaSubC = []


  public IDResetStatus
  public token
  public idOPP
  public NewPassword
  public ConfirmNewPassword
  public idOPPSelected
  public n_opp = '1'
  public rowsOPP_SUB
  public tempDataOPP_SUB = []
  public List_OPP_SUB = []
  public Subcontratista = []
  public rowsSubcontratistas
  public tempDataSubcontratas = []
  public TipoRegistro

  public title_modal

  public valorPosicion

  public arregloSubcontratistas = []

  public ListaSubcontratistasCombinacion = []

  public totalsubagen: number = 0

  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private modalService: NgbModal,
    private router: Router,
    private _formBuilder: FormBuilder,
    private pdf: PdfService,
    private generarConciliacion: GenerarPagoService,
  ) { }

  async ngOnInit() {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    // console.log(this.token)
    this.idOPP = this.token.Usuario[0].id_opp
    this.IdUser = this.token.Usuario[0].id_user
    this.TipoRegistro = this.token.Usuario[0].tipo_registro
    // console.log(this.IdUser)
    await this.ListaOPP_SUB(1)
    await this.LstObligaciones()
    await this.Precio_Dolar_Petro()
  }

  filterUpdate(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataOPP_SUB.filter(function (d) {
      return d.nombre_empresa.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsOPP_SUB = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  CapturarNav(event) {
    switch (event.target.id) {
      case 'ngb-nav-0':
        this.List_OPP_SUB = []
        this.rowsOPP_SUB = []
        this.n_opp = '1'
        this.ListaOPP_SUB(1)
        break;
      case 'ngb-nav-1':
        this.List_OPP_SUB = []
        this.rowsOPP_SUB = []
        this.n_opp = '2'
        this.ListaOPP_SUB(2)
        break;
      case 'ngb-nav-2':
        this.List_COMBINACION = []
        this.List_ListaSubC = []
        this.ListaCOMBINACION()
        break;
      default:
        break;
    }
  }

  async ListaOPP_SUB(n_opp: any) {
    this.loadingIndicator = true
    this.List_OPP_SUB = []
    this.rowsOPP_SUB = []
    this.xAPI.funcion = "IPOSTEL_R_OPP_SUB"
    this.xAPI.parametros = n_opp.toString()
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.List_OPP_SUB = []
        data.Cuerpo.map(e => {
          if (n_opp != '2') {
            this.List_OPP_SUB.push(e)
            this.loadingIndicator = false
          } else {
            if (e.status_empresa == 1) {
              this.List_OPP_SUB.push(e)
              this.loadingIndicator = false
            }
          }
        });
        this.rowsOPP_SUB = this.List_OPP_SUB;
        this.tempDataOPP_SUB = this.rowsOPP_SUB
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async EliminarOPP(data: any) {
    this.xAPI.funcion = "IPOSTEL_D_EliminarOPP"
    this.xAPI.parametros = `${data.id_opp}`
    this.xAPI.valores = ''
    Swal.fire({
      title: 'Esta seguro de eliminar?',
      text: data.nombre_empresa,
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Deseo Eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            // console.log(data)
            this.sectionBlockUI.start('Eliminando Registro, por favor Espere!!!');
            this.rowsOPP_SUB.push(this.List_OPP_SUB)
            if (data.tipo === 1) {
              this.List_OPP_SUB = []
              this.ListaOPP_SUB(1)
              this.modalService.dismissAll('Close')
              this.sectionBlockUI.stop()
              this.utilService.alertConfirmMini('success', 'Registro Eliminado Exitosamente!')
            } else {
              this.sectionBlockUI.stop();
              this.utilService.alertConfirmMini('error', 'Algo salio mal! <br> Verifique e intente de nuevo')
            }
          },
          (error) => {
            console.log(error)
          }
        )
      }
    })
  }

  async EmpresaRIF(id: any) {
    this.xAPI.funcion = "IPOSTEL_R_empresa_id";
    this.xAPI.parametros = `${id}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.DatosEmpresa.push(data.Cuerpo);
      },
      (error) => {
        console.log(error)
      }
    )
  }

  EmpresaOppSub(id: any) {
    this.xAPI.funcion = "IPOSTEL_R_EmpresaOppSub";
    this.xAPI.parametros = `${id}`
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.forEach(e => {
          this.DatosSub_OPP.push(e)
        });
      },
      (err) => {
        console.log(err)
      }
    )
  }

  async GenerarCertificadoInscripcion(data) {
    this.EmpresaRIF(data.id_opp)
    this.CrearCert.created_user = this.IdUser
    this.CrearCert.usuario = data.id_opp
    this.CrearCert.token = this.utilService.TokenAleatorio(10)
    this.CrearCert.type = 1
    // 1 CERTIFICADO UNICO OPP
    // 2 AUTORIZACION UNICA  SUB
    this.xAPI.funcion = "IPOSTEL_C_Certificados";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.CrearCert)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.sectionBlockUI.start('Generando Certificado, por favor Espere!!!');
        this.n_curp = data.msj + '-IP' + this.aniox
        if (data.tipo === 1) {
          var id = this.CrearCert.token
          let ruta: string = btoa('https://sirp.ipostel.gob.ve/app/#/certificate');
          this.apiService.GenQR(id, ruta).subscribe(
            (data) => {
              // INSERT API
              this.apiService.LoadQR(id).subscribe(
                (xdata) => {
                  var sdata = this.DatosEmpresa[0]
                  // console.log(sdata)
                  this.pdf.CertificadoInscripcion(sdata[0], xdata.contenido, this.CrearCert.token, this.n_curp)
                  this.sectionBlockUI.stop()
                  this.utilService.alertConfirmMini('success', 'Certificado Descagado Exitosamente')
                },
                (error) => {
                  console.log(error)
                }
              )
            },
            (error) => {
              console.log(error)
            }
          )
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! Algo salio mal, intente de nuevo')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async GenerarAutorizacionInscripcion(data) {
    this.EmpresaOppSub(data.id_opp)
    this.CrearCert.usuario = this.token.Usuario[0].id_opp
    this.CrearCert.created_user = this.token.Usuario[0].id_opp
    this.CrearCert.token = this.utilService.TokenAleatorio(10),
      this.CrearCert.type = 2,
      // 1 CERTIFICADO UNICO OPP
      // 2 AUTORIZACION UNICA  SUB
      this.CrearCert.created_user = this.token.Usuario[0].id_opp
    this.xAPI.funcion = "IPOSTEL_C_Certificados";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.CrearCert)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.sectionBlockUI.start('Generando Autorización, por favor Espere!!!');
        this.n_curp = data.msj + '-IP' + this.aniox
        if (data.tipo === 1) {
          var id = this.CrearCert.token
          let ruta: string = btoa('https://sirp.ipostel.gob.ve/app/#/certificate');
          this.apiService.GenQR(id, ruta).subscribe(
            (data) => {
              // INSERT API
              this.apiService.LoadQR(id).subscribe(
                (xdata) => {
                  var sdata = this.DatosSub_OPP
                  this.pdf.AutorizacionInscripcion(sdata[0], xdata.contenido, this.CrearCert.token, this.n_curp)
                  this.sectionBlockUI.stop()
                  this.utilService.alertConfirmMini('success', 'Autorización Descagada Exitosamente')
                },
                (error) => {
                  console.log(error)
                }
              )
            },
            (error) => {
              console.log(error)
            }
          )
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! Algo salio mal, intente de nuevo')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  AddMovilizacionPiezas(modal) {
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async EmpresaOPP(id: any) {
    this.xAPI.funcion = "IPOSTEL_R_OPP_ID"
    this.xAPI.parametros = `${id}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.DataEmpresa.id_opp = e.id_opp
          this.DataEmpresa.nombre_empresa = e.nombre_empresa
          this.DataEmpresa.rif = e.rif
          this.DataEmpresa.role = e.role
          this.DataEmpresa.status_empresa = e.status_empresa
          if (e.tipo_registro === 1) {
            this.DataEmpresa.tipo_registro = 'Oficina Postal Privada'
            this.TipoRegistro = e.tipo_registro
          } else {
            this.DataEmpresa.tipo_registro = 'Subcontratista'
            this.TipoRegistro = e.tipo_registro
          }
          this.DataEmpresa.opp = e.opp
          this.DataEmpresa.direccion_empresa = e.direccion_empresa
          this.DataEmpresa.estado_empresa = e.estado_empresa
          this.DataEmpresa.ciudad_empresa = e.ciudad_empresa
          this.DataEmpresa.parroquia_empresa = e.parroquia_empresa
          this.DataEmpresa.correo_electronico = e.correo_electronico
          this.DataEmpresa.empresa_facebook = e.empresa_facebook
          this.DataEmpresa.empresa_instagram = e.empresa_instagram
          this.DataEmpresa.empresa_twitter = e.empresa_twitter
          this.DataEmpresa.tipo_agencia = e.tipo_agencia
          this.DataEmpresa.nombre_tipo_agencia = e.nombre_tipo_agencia
          this.DataEmpresa.sucursales = e.sucursales
          this.DataEmpresa.subcontrataciones = e.subcontrataciones
          this.DataEmpresa.tipologia_empresa = e.tipologia_empresa
          this.DataEmpresa.nombre_tipologia = e.nombre_tipologia
          this.DataEmpresa.tipo_servicio = JSON.parse(e.tipo_servicio)
          this.DataEmpresa.especificacion_servicio = e.especificacion_servicio
          this.DataEmpresa.licencia_actividades_economicas_municipales = e.licencia_actividades_economicas_municipales
          this.DataEmpresa.actividades_economicas_seniat = e.actividades_economicas_seniat
          this.DataEmpresa.certificado_rupdae = e.certificado_rupdae
          this.DataEmpresa.patronal_ivss = e.patronal_ivss
          this.DataEmpresa.matricula_inces = e.matricula_inces
          this.DataEmpresa.identificacion_laboral_ministerio_trabajo = e.identificacion_laboral_ministerio_trabajo
          this.DataEmpresa.certificado_eomic = e.certificado_eomic
          this.DataEmpresa.permiso_bomberos = e.permiso_bomberos
          this.DataEmpresa.registro_sapi = e.registro_sapi
          this.DataEmpresa.registro_nacional_contratista = e.registro_nacional_contratista
          this.DataEmpresa.flota_utilizada = JSON.parse(e.flota_utilizada)
          this.DataEmpresa.cantidad_trabajadores = e.cantidad_trabajadores
          this.DataEmpresa.cantidad_subcontratados = e.cantidad_subcontratados
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaCOMBINACION() {
    this.loadingIndicator = true
    this.List_COMBINACION = []
    this.rowsCOMBINACION = []
    this.xAPI.funcion = "IPOSTEL_R_ListaOpp_Sub_Combinada"
    this.xAPI.parametros = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.arregloSubcontratistas.push(JSON.parse(e.subcontratistas))
          this.List_COMBINACION.push(e)
          this.loadingIndicator = false
        });
        const sumaCantidad = this.List_COMBINACION.reduce((total, item) => total + item.cantidad, 0);
        this.totalsubagen = this.List_COMBINACION.reduce((total, item) => total + item.cantidad, 0);
        this.cantidadCombinacion = sumaCantidad
        this.rowsCOMBINACION = this.List_COMBINACION
        this.tempDataCOMBINACION = this.rowsCOMBINACION
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async Subcontratistas(id: any) {
    this.Subcontratista = []
    this.xAPI.funcion = "IPOSTEL_R_Subcontratista_ID"
    this.xAPI.parametros = `${id}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          if (e.tipo_registro == '1') {
            e.tipo_registro = 'Oficina Postal Privada'
          } else {
            e.tipo_registro = 'Subcontratista'
          }
          this.Subcontratista.push(e)
        });
        this.rowsSubcontratistas = this.Subcontratista;
        this.tempDataSubcontratas = this.rowsSubcontratistas
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async RepresentanteLegal(id: any) {
    this.xAPI.funcion = "IPOSTEL_R_RepresentanteLegal_ID"
    this.xAPI.parametros = `${id}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.DataRepresentanteLegal.apellidos_representante_legal = e.apellidos_representante_legal
          this.DataRepresentanteLegal.cargo_representante_legal = e.cargo_representante_legal
          this.DataRepresentanteLegal.cedula_representante_legal = e.cedula_representante_legal
          this.DataRepresentanteLegal.direccion_representante_legal = e.direccion_representante_legal
          this.DataRepresentanteLegal.email_representante_legal = e.email_representante_legal
          this.DataRepresentanteLegal.facebook_representante_legal = e.facebook_representante_legal
          this.DataRepresentanteLegal.fecha_registro = this.utilService.FechaMomentL(e.fecha_registro)
          this.DataRepresentanteLegal.id_opp = e.id_opp
          this.DataRepresentanteLegal.id_representante_legal = e.id_representante_legal
          this.DataRepresentanteLegal.instagram_representante_legal = e.instagram_representante_legal
          this.DataRepresentanteLegal.n_registro = e.n_registro
          this.DataRepresentanteLegal.nombres_representante_legal = e.nombres_representante_legal
          this.DataRepresentanteLegal.telefono_movil_representante_legal = e.telefono_movil_representante_legal
          this.DataRepresentanteLegal.telefono_residencial_representante_legal = e.telefono_residencial_representante_legal
          this.DataRepresentanteLegal.tomo = e.tomo
          this.DataRepresentanteLegal.twitter_representante_legal = e.twitter_representante_legal

        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async Delegado(id: any) {
    this.xAPI.funcion = "IPOSTEL_R_Delegado_ID"
    this.xAPI.parametros = `${id}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.DataDelegado.apellidos_delegado = e.apellidos_delegado
          this.DataDelegado.cargo_delegado = e.cargo_delegado
          this.DataDelegado.cedula_delegado = e.cedula_delegado
          this.DataDelegado.email_delegado = e.email_delegado
          this.DataDelegado.facebook_delegado = e.facebook_delegado
          this.DataDelegado.id_delegado = e.id_delegado
          this.DataDelegado.id_opp = e.id_opp
          this.DataDelegado.instagram_delegado = e.instagram_delegado
          this.DataDelegado.nombres_delegado = e.nombres_delegado
          this.DataDelegado.telefono_delegado = e.telefono_delegado
          this.DataDelegado.twitter_delegado = e.twitter_delegado
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }
  togglePasswordTextTypeX() {
    this.passwordTextTypeX = !this.passwordTextTypeX;
  }

  filterUpdateSubcontratistas(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataSubcontratas.filter(function (d) {
      return d.nombre_empresa.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsSubcontratistas = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }



  filterUpdateListaSubC(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataListaSubC.filter(function (d) {
      return d.oss_nombre_empresa.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsListaSubC = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }


  filterUpdateCOMBINACION(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataCOMBINACION.filter(function (d) {
      return d.operador.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsCOMBINACION = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  async DetallesOPP(modal, data) {
    // console.log(data)
    // this.TipoRegistro = data.tipo_registro
    await this.EmpresaOPP(data.id_opp)
    await this.Subcontratistas(data.id_opp)
    await this.RepresentanteLegal(data.id_opp)
    await this.Delegado(data.id_opp)
    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async GenerarConcesionPostalPrivada() {
    this.ICrearConcesion.user_created = this.IdUser
    this.xAPI.funcion = "IPOSTEL_I_OtorgamientoConcesion"
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.ICrearConcesion)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.sectionBlockUI.start('Generando Concesión Postal, por favor Espere!!!');
        this.rowsOPP_SUB.push(this.List_OPP_SUB)
        if (data.tipo === 1) {
          this.List_OPP_SUB = []
          this.ListaOPP_SUB(1)
          this.modalService.dismissAll('Close')
          this.sectionBlockUI.stop()
          this.utilService.alertConfirmMini('success', 'Concesión Generada Exitosamente!')
        } else {
          this.sectionBlockUI.stop();
          this.utilService.alertConfirmMini('error', 'Algo salio mal! <br> Verifique e intente de nuevo')
        }
      },
      (error) => {
        console.log(error)
      }
    )

  }

  CalcularFecha(event: any) {
    var enero = new Date(this.ICrearConcesion.fecha_archivo_curp);
    var febrero = new Date(enero.setFullYear(enero.getFullYear() + event));
    this.ICrearConcesion.periodo_contrato_curp = this.utilService.FechaMomentL(febrero)
  }

  async DeleteConcesionPostalPrivada(id: any) {
    this.xAPI.funcion = "IPOSTEL_D_OtorgamientoConcesion"
    this.xAPI.parametros = `${id.id_curp}`
    this.xAPI.valores = ''
    Swal.fire({
      title: 'Esta seguro de revocar esta concesión?',
      text: "Tenga en cuenta que este cambio es irreversible !",
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Deseo Revocar esta Concesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            // console.log(data)
            // this.sectionBlockUI.start('Generando Concesión Postal, por favor Espere!!!');
            this.rowsOPP_SUB.push(this.List_OPP_SUB)
            if (data.tipo === 1) {
              this.List_OPP_SUB = []
              this.ListaOPP_SUB(1)
              this.modalService.dismissAll('Close')
              // this.sectionBlockUI.stop()
              this.utilService.alertConfirmMini('success', 'Concesión Revocada Exitosamente!')
            } else {
              this.sectionBlockUI.stop();
              this.utilService.alertConfirmMini('error', 'Algo salio mal! <br> Verifique e intente de nuevo')
            }
          },
          (error) => {
            console.log(error)
          }
        )
      }
    })


  }

  async AprobarEmpresaOPP(modal, data) {
    this.title_modal = data.nombre_empresa
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async ModalAprobarConcesionPostal(modal, data) {
    // console.log(modal);
    this.ICrearConcesion.id_opp = data.id_opp
    this.ICrearConcesion.status_curp = 1
    this.ICrearConcesion.user_created = this.idOPP

    this.IpagarRecaudacion.id_opp = data.id_opp
    this.IpagarRecaudacion.status_pc =
    this.IpagarRecaudacion.tipo_pago_pc
    this.IpagarRecaudacion.monto_pc
    this.IpagarRecaudacion.monto_pagar
    this.IpagarRecaudacion.dolar_dia
    this.IpagarRecaudacion.petro_dia
    this.IpagarRecaudacion.archivo_adjunto
    this.IpagarRecaudacion.user_created

    this.title_modal = data.nombre_empresa
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async VerSubContratistas(opp: any) {
    this.ListaSubcontratistasCombinacion = []
    this.rowsListaSubC = []
    this.tempDataListaSubC = []
    this.loadingIndicatorSub = true
    // console.log(opp)
    this.xAPI.funcion = "IPOSTEL_R_VerSubContratistasCombinacion"
    this.xAPI.parametros = `${opp}`
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.ListaSubcontratistasCombinacion.push(e)
          this.loadingIndicatorSub = false
        });
        this.cantidadObligaciones = this.ListaSubcontratistasCombinacion.length
        this.ListaOPPSUB = this.ListaSubcontratistasCombinacion
        // console.log(this.ListaSubcontratistasCombinacion)
        this.rowsListaSubC = this.ListaSubcontratistasCombinacion
        this.tempDataListaSubC = this.rowsListaSubC

        console.log(this.ListaOPPSUB)

      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ModalVerSubContratistas(modal: any, data: any) {
    // console.log(data)
    this.VerSubContratistas(data.id_opp)
    this.title_modal = data.operador
    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }


  async ModalPagosObligaciones(modal: any, data: any) {
    // console.log(data)
    this.title = data.operador
    await this.VerSubContratistas(data.id_opp)
    this.title_modal = data.operador
    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async ProcesarOblicacionColectivas() {
    let array = this.ListaOPPSUB
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      this.IpagarRecaudacion.id_opp = element.oss_id_sub
      this.IpagarRecaudacion.status_pc = 4
      this.IpagarRecaudacion.tipo_pago_pc = this.obligacion.id
      this.IpagarRecaudacion.monto_pc = '0'
      this.IpagarRecaudacion.dolar_dia = this.pDolar.toString()
      this.IpagarRecaudacion.petro_dia = this.pPetro.toString()
      this.IpagarRecaudacion.observacion_pc = this.observacion
      this.IpagarRecaudacion.fecha_pc = this.utilService.FechaActual()
      this.IpagarRecaudacion.user_created = element.os_id_opp
      await this.ProcesarObligacionesColectiva(this.IpagarRecaudacion)
    }
    // console.log(this.IpagarRecaudacion)
  }

  ProcesarObligacionesColectiva(obligacionColectiva: any) {
    console.log(obligacionColectiva)
    this.sectionBlockUI.start('Generando Recibo, Por favor Espere!!!');
    this.generarConciliacion.GuardarCreacionRecaudacionIndividual(obligacionColectiva)
      .then((resultado) => {
        // Manejar el resolve
        // console.log('Operación exitosa:', resultado);
        // this.List_Pagos_Recaudacion = []
        this.modalService.dismissAll('Cerrar Modal')
        // this.LimpiarModal()
        this.utilService.alertConfirmMini('success', 'Recibos Generados Exitosamente')
      })
      .catch((error) => {
        // Manejar el reject
        // console.error('Error en la operación:', error);
        this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal!')
      })
      .finally(() => {
        // Este bloque se ejecutará después de que la promesa se resuelva o se rechace
        // console.log('Procesamiento finalizado');
        // this.ListaPagosObligaciones()
        this.sectionBlockUI.stop()
      });
  }

  CapturarObligacion(obligacion: any) {
    this.tasa_petro = obligacion.tasa_petro

    // console.log(obligacion)
    switch (obligacion.id) {
      case 2: // Derecho Semestral 1
        this.observacion = obligacion.nombre_tipo_pagos
        if (this.TipoRegistro === 1) { // OPP
          this.monto = this.pPetro
          this.conversion = this.monto * this.pDolar
          let montoTotal = this.conversion * parseInt(this.tasa_petro)
          this.IpagarRecaudacion.monto_pagar = montoTotal.toFixed(2)
        } else { // SUB
          this.monto = this.pPetro / 2
          this.conversion = this.monto * this.pDolar
          let montoTotal = this.conversion * parseInt(this.tasa_petro)
          this.IpagarRecaudacion.monto_pagar = montoTotal.toFixed(2)
        }
        break;
      case 3: // Derecho Semestral 2
        this.observacion = obligacion.nombre_tipo_pagos
        if (this.TipoRegistro === 1) { // OPP
          this.monto = this.pPetro
          this.conversion = this.monto * this.pDolar
          let montoTotal = this.conversion * parseInt(this.tasa_petro)
          this.IpagarRecaudacion.monto_pagar = montoTotal.toFixed(2)

        } else { // SUB
          this.monto = this.pPetro / 2
          this.conversion = this.monto * this.pDolar
          let montoTotal = this.conversion * parseInt(this.tasa_petro)
          this.IpagarRecaudacion.monto_pagar = montoTotal.toFixed(2)

        }
        break;
      case 4: //Anualidad
        this.observacion = obligacion.nombre_tipo_pagos
        if (this.TipoRegistro === 1) { // OPP
          this.monto = this.pPetro * 6
          this.conversion = this.monto * this.pDolar
          this.IpagarRecaudacion.monto_pagar = this.conversion.toString()
        } else { // SUB
          this.monto = this.pPetro * 3
          this.conversion = this.monto * this.pDolar
          this.IpagarRecaudacion.monto_pagar = this.conversion.toString()
        }
        break;
      case 5: // Autorizacion de Subcontrato
        this.observacion = obligacion.nombre_tipo_pagos
        if (this.TipoRegistro === 2) { // OPP
          this.monto = this.pPetro
          this.conversion = this.monto * this.pDolar
          this.IpagarRecaudacion.monto_pagar = this.conversion.toString()
        } else {
          this.utilService.alertConfirmMini('error', 'Los OPP no cancelan Autorización')
          // this.LimpiarModal()
          this.modalService.dismissAll('Cerrar Modal')
        }
        break;
      case 9: // Renovación
        this.observacion = obligacion.nombre_tipo_pagos
        if (this.TipoRegistro === 1) { // OPP
          this.monto = this.pPetro
          this.conversion = this.monto * this.pDolar
          // this.IpagarRecaudacion.monto_pagar = this.conversion.toString()
          let montoTotal = this.conversion * parseInt(this.tasa_petro)
          this.IpagarRecaudacion.monto_pagar = montoTotal.toFixed(2)
        } else {
          this.monto = this.pPetro
          this.conversion = this.monto * this.pDolar
          // this.IpagarRecaudacion.monto_pagar = this.conversion.toString()
          let montoTotal = this.conversion * parseInt(this.tasa_petro)
          this.IpagarRecaudacion.monto_pagar = montoTotal.toFixed(2)
        }
        break;
        case 10: // Mantenimiento SUB
        this.observacion = obligacion.nombre_tipo_pagos
        // if (this.TipoRegistro === 2) { // OPP
          this.monto = this.tasa_petro
          this.conversion = this.monto * this.pDolar
          // this.IpagarRecaudacion.monto_pagar = this.conversion.toString()
          let montoTotal = this.conversion 
          this.IpagarRecaudacion.monto_pagar = montoTotal.toFixed(2)
        // }
        break;
      default:
        break;
    }

    // console.log(this.monto, this.conversion, this.pPetro, this.pDolar)
  }

  CapturarDolarPetro(valores: any) {
    // console.log(valores)
    this.pPetro = valores.petro
    this.pDolar = valores.dolar
  }


  async Precio_Dolar_Petro() {
    this.xAPI.funcion = "IPOSTEL_R_PRECIO_PETRO_DOLAR";
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.DolarPetroDia = data.Cuerpo.map(e => {
          this.CapturarDolarPetro(e)
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async CambiarStatusOPP(modal, data) {
    // console.log(data.status_empresa);
    this.title_modal = data.nombre_empresa
    this.IDResetStatus = data.id_opp
    this.IUpdateStatusEmpresa.status_empresa = data.status_empresa
    this.IUpdateStatusEmpresa.observacion = data.observacion
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async RenovarConcesion(modal, data) {
    // console.log(data);
    this.title_modal = data.nombre_empresa
    this.IDResetStatus = data.id_opp
    this.IUpdateStatusEmpresa.periodo_contrato_curp = data.periodo_contrato_curp
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async LstObligaciones() {
    this.xAPI.funcion = "IPOSTEL_R_Tipo_Pagos_Obligaciones";
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.ListaTipoObligacion = data.Cuerpo.map(e => {
          e.id = e.id_tipo_pagos
          e.name = `(${e.iniciales_tipo_pagos}) ${e.nombre_tipo_pagos}`
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ResetStatus() {
    Swal.fire({
      title: 'Esta seguro de cambiar el estatus ?',
      text: "Tenga en cuenta que este cambio afectara al usuario!",
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Deseo Actualizar el Estatus',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.IUpdateStatusEmpresa.id_opp = this.IDResetStatus
        this.xAPI.funcion = 'IPOSTEL_U_CambiarStatusOPPSUB'
        this.xAPI.parametros = ''
        this.xAPI.valores = JSON.stringify(this.IUpdateStatusEmpresa)
        this.apiService.EjecutarDev(this.xAPI).subscribe(
          (data) => {
            this.rowsOPP_SUB.push(this.List_OPP_SUB)
            if (data.tipo == 1) {
              this.List_OPP_SUB = []
              this.ListaOPP_SUB(1)
              this.modalService.dismissAll('Close')
              this.utilService.alertConfirmMini('success', 'Felicidades<br>El Estatus fue actualizada satisfactoriamente!')
            } else {
              this.utilService.alertConfirmMini('error', '<font color="red">Oops Lo sentimos!</font> <br> Algo salio mal!, Verifique e intente de nuevo')
            }
          },
          (error) => {
            console.error(error)
          }
        )
      }
    })
  }

// Función para convertir la fecha
convertirFecha(fecha: string): string {
  // Crea un objeto Date a partir de la cadena
  const fechaObj = new Date(fecha + 'T00:00:00-04:00'); // Ajusta la hora a la zona horaria de Venezuela (UTC-4)

  const dia = String(fechaObj.getUTCDate()).padStart(2, '0'); // Obtiene el día en UTC
  const mes = String(fechaObj.getUTCMonth() + 1).padStart(2, '0'); // Obtiene el mes en UTC
  const anio = fechaObj.getUTCFullYear(); // Obtiene el año en UTC

  return `${dia}/${mes}/${anio}`; // Retorna la fecha en formato DD/MM/YYYY
}

  async RenovarFechaConcesion() {
    this.IUpdateStatusEmpresa.periodo_contrato_curp = this.convertirFecha(this.IUpdateStatusEmpresa.periodo_contrato_curp)
    Swal.fire({
      title: 'Esta seguro de cambiar la fecha ?',
      text: "Tenga en cuenta que este cambio afectara al usuario!",
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Deseo Actualizarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.IUpdateStatusEmpresa.id_opp = this.IDResetStatus
        this.xAPI.funcion = 'IPOSTEL_U_CambiarFechaCertificadoOPP'
        this.xAPI.parametros = ''
        this.xAPI.valores = JSON.stringify(this.IUpdateStatusEmpresa)
        this.apiService.EjecutarDev(this.xAPI).subscribe(
          (data) => {
            this.rowsOPP_SUB.push(this.List_OPP_SUB)
            if (data.tipo == 1) {
              this.List_OPP_SUB = []
              this.ListaOPP_SUB(1)
              this.modalService.dismissAll('Close')
              this.utilService.alertConfirmMini('success', 'Felicidades<br>La Fecha fue actualizada satisfactoriamente!')
            } else {
              this.utilService.alertConfirmMini('error', '<font color="red">Oops Lo sentimos!</font> <br> Algo salio mal!, Verifique e intente de nuevo')
            }
          },
          (error) => {
            console.error(error)
          }
        )
      }
    })
  }

  async CambiarContrasena(modal, data) {
    this.title_modal = data.nombre_empresa
    this.idOPPSelected = data.id_opp
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async ResetPassword() {
    this.rowsOPP_SUB.push(this.List_OPP_SUB)
    if (this.ConfirmNewPassword != this.NewPassword) {
      this.utilService.alertConfirmMini('error', '<font color="red">Oops Lo sentimos!</font> <br> Las Contraseñas deben ser iguales!, Verifique e intente de nuevo')
      this.List_OPP_SUB = []
      this.ListaOPP_SUB(1)
    } else {
      const pwd = this.NewPassword
      this.xAPI.funcion = 'IPOSTEL_U_CambiarPasswordOPPSUB'
      this.xAPI.parametros = `${this.idOPPSelected}` + ',' + this.utilService.md5(pwd)
      this.xAPI.valores = ''
      await this.apiService.EjecutarDev(this.xAPI).subscribe(
        (data) => {
          if (data.tipo == 1) {
            this.List_OPP_SUB = []
            this.ListaOPP_SUB(1)
            this.modalService.dismissAll('Close')
            this.utilService.alertConfirmMini('success', 'Felicidades<br>La Contraseña fue actualizada satisfactoriamente!')
          } else {
            this.utilService.alertConfirmMini('error', '<font color="red">Oops Lo sentimos!</font> <br> Algo salio mal!, Verifique e intente de nuevo')
          }
        },
        (error) => {
          console.error(error)
        }
      )
    }
  }


  EliminarCon(row: any) {
    // console.log(row)
    Swal.fire({
      title: 'Esta seguro?',
      text: "Desea Eliminar este Registro!",
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.IUpdateStatusEmpresa.id_opp = this.IDResetStatus
        this.xAPI.funcion = 'IPOSTEL_U_EliminarSubCombinacion'
        this.xAPI.parametros = `${row.os_di}`
        this.xAPI.valores = ''
        this.apiService.EjecutarDev(this.xAPI).subscribe(
          (data) => {
            this.rowsOPP_SUB.push(this.List_OPP_SUB)
            if (data.tipo == 1) {
              this.rowsListaSubC = []
              this.VerSubContratistas(row.os_id_opp)
              // this.modalService.dismissAll('Close')
              this.utilService.alertConfirmMini('success', 'Registro Eliminado Satisfactoriamente')
            } else {
              this.utilService.alertConfirmMini('error', '<font color="red">Oops Lo sentimos!</font> <br> Algo salio mal!, Verifique e intente de nuevo')
            }
          },
          (error) => {
            console.error(error)
          }
        )
      }
    })
  }


}

