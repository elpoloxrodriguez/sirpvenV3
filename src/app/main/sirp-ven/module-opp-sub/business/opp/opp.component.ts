import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, IAPICore, IPOSTEL_I_ArchivoDigital } from '@core/services/apicore/api.service';
import { IPOSTEL_C_ConexionFlotaUtilizada, IPOSTEL_C_OPP, IPOSTEL_DATA_DELEGADOP_ID, IPOSTEL_DATA_EMPRESA_ID, IPOSTEL_DATA_REPRESENTANTE_LEGAL_ID, IPOSTEL_U_DatosDelegados, IPOSTEL_U_DatosRepresentanteLegal, IPOSTEL_U_OPP_ID } from '@core/services/empresa/form-opp.service';
import { UtilService } from '@core/services/util/util.service';
import jwt_decode from "jwt-decode";
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { I18n, CustomDatepickerI18n } from '@core/services/util/datapicker.service';
import { map } from 'rxjs/operators';
import { Console } from 'console';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AngularFileUploaderComponent } from 'angular-file-uploader';



@Component({
  selector: 'app-opp',
  templateUrl: './opp.component.html',
  styleUrls: ['./opp.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }, NgbModalConfig, NgbModal] // define custom NgbDatepickerI18n provider

})
export class OppComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  @ViewChild('fileUpload1')
  private fileUpload1: AngularFileUploaderComponent


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public IFormOPP: IPOSTEL_C_OPP = {
    nombre_empresa: '',
    rif: '',
    direccion_empresa: '',
    correo_electronico: '',
    empresa_facebook: '',
    empresa_instagram: '',
    empresa_twitter: '',
    tipo_servicio: '',
    licencia_actividades_economicas_municipales: '',
    actividades_economicas_seniat: '',
    certificado_rupdae: '',
    patronal_ivss: '',
    matricula_inces: '',
    identificacion_laboral_ministerio_trabajo: '',
    certificado_eomic: '',
    permiso_bomberos: '',
    registro_sapi: '',
    registro_nacional_contratista: '',
    flota_utilizada: '',
    status: 0,
    tipo_registro: 0,
    password: '',
    especificacion_servicio: ''
  }

  public IConexionFlotaUtilizada: IPOSTEL_C_ConexionFlotaUtilizada = {
    id_opp_sub: null,
    vehiculo_liviano: null,
    camionetas: null,
    camion_350: null,
    camion_750: null,
    camion_3_ejes: null,
    camion_4_ejes: null,
    camion_5_ejes: null,
    camion_6_ejes: null,
    buques: null,
    aviones: null,
    avionetas: null,
    containers: null,
    motos: null,
    bicicletas: null,
    autobuses: null
  }

  public UpdateDelegate: IPOSTEL_U_DatosDelegados = {
    nombres_delegado: '',
    apellidos_delegado: '',
    cedula_delegado: '',
    cargo_delegado: '',
    telefono_delegado: '',
    email_delegado: '',
    facebook_delegado: '',
    instagram_delegado: '',
    twitter_delegado: '',
    id_opp: 0
  }

  public IUpdateRepresentanteLegal: IPOSTEL_U_DatosRepresentanteLegal = {
    n_registro: '',
    fecha_registro: '',
    tomo: '',
    n_registro_contrato: '',
    fecha_registro_contrato: '',
    tomo_contrato: '',
    nombres_representante_legal: '',
    apellidos_representante_legal: '',
    cedula_representante_legal: '',
    direccion_representante_legal: '',
    email_representante_legal: '',
    facebook_representante_legal: '',
    instagram_representante_legal: '',
    twitter_representante_legal: '',
    cargo_representante_legal: '',
    telefono_movil_representante_legal: '',
    telefono_residencial_representante_legal: '',
    id_opp: 0
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
    municipio_empresa: undefined,
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
    cantidad_subcontratados: undefined
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
    n_registro_contrato: undefined,
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

  public UDatosGeneralesOPPSUB : IPOSTEL_U_OPP_ID = {
    nombre_empresa: '',
    rif: '',
    direccion_empresa: '',
    estado_empresa: '',
    ciudad_empresa: '',
    municipio_empresa: '',
    parroquia_empresa: '',
    correo_electronico: '',
    empresa_facebook: '',
    empresa_instagram: '',
    empresa_twitter: '',
    tipo_agencia: 0,
    sucursales: 0,
    subcontrataciones: 0,
    tipologia_empresa: 0,
    tipo_servicio: '',
    especificacion_servicio: '',
    licencia_actividades_economicas_municipales: '',
    actividades_economicas_seniat: '',
    certificado_rupdae: '',
    patronal_ivss: '',
    matricula_inces: '',
    identificacion_laboral_ministerio_trabajo: '',
    certificado_eomic: '',
    permiso_bomberos: '',
    registro_sapi: '',
    registro_nacional_contratista: '',
    flota_utilizada: '',
    cantidad_trabajadores: 0,
    cantidad_subcontratados: 0,
    id_opp: 0
  }

  public DocAdjunto: IPOSTEL_I_ArchivoDigital = {
    usuario: '',
    nombre: '',
    empresa: '',
    numc: '',
    tipo: 0,
    vencimiento: ''
  }

  public archivos = []
  public hashcontrol = ''
  public numControl: string = ''
  public TipoDocument
  public lstTipoDoc = [
    { id: 1, name: 'Prueba'}
  ]

  public datetime1: NgbDateStruct;
  public datetime2: NgbDateStruct;


  public Subcontratista = []
  public token
  public TipoRegistro
  public IdOPP
  public idDelegado
  public ShowBtnWarningDelegado = false
  public ShowBtnPrimaryDelegado = false
  public ShowBtnWarningRepresentanteLegal = false
  public ShowBtnPrimaryRepresentanteLegal = false

  public idRepresentanteLegal

  public arrayFlotaUtilizada
  public xFlotaUtilizada

  public EmpresaDocumentosAdjuntos = []
  public rowsDocumentosAdjuntosEmpresa
  public tempDataDocumentosAdjuntosEmpresa = []

  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public searchValue = '';
  public rowsSubcontratistas
  public tempDataSubcontratas = []

  public vehiculo_liviano = false
  public camionetas = false
  public camion_350 = false
  public camion_750 = false
  public camion_3_ejes = false
  public camion_4_ejes = false
  public camion_5_ejes = false
  public camion_6_ejes = false
  public buques = false
  public aviones = false
  public avionetas = false
  public containers = false
  public motos = false
  public bicicletas = false
  public autobuses = false

  public ErrorRegistro

  public SelectEstado
  public SelectCiudad
  public SelectMunicipio
  public SelectParroquia
  public labelTipologiaEmpresa
  public SelectTipoAgencia
  public SelectTipologiaEmpresa
  public SelectTipoServicio
  public SelectFlotaUtilizada
  public SelectArchivoDigitalPostal = []

  public lengthRepresentanteLegal
  public lengthDelegado

  public btnShowDelegado : boolean = true
  public btnShowRepresentante : boolean = true

  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private modalService: NgbModal,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.TipoRegistro = this.token.Usuario[0].tipo_registro
    this.IdOPP = this.token.Usuario[0].id_opp
    this.idDelegado = this.token.Usuario[0].id_delegado
    this.idRepresentanteLegal = this.token.Usuario[0].id_representante_legal


    await this.EmpresaOPP(this.IdOPP)
    await this.Subcontratistas(this.IdOPP)
    await this.RepresentanteLegal(this.IdOPP)
    await this.Delegado(this.IdOPP)
    await this.Select_Estados()
    await this.Select_TipoAgencia()
    await this.Select_Tipo_servicio()
    await this.Select_Tipo_Flota()
    await this.ListaFlotaUtilizada()
    await this.Select_Tipo_ArchivoDigital()

    // if 
    if (this.lengthDelegado <= 0) {
      this.ShowBtnWarningDelegado = false
      this.ShowBtnPrimaryDelegado = true
    } else {
      this.ShowBtnWarningDelegado = true
      this.ShowBtnPrimaryDelegado = false
    }
    if (this.lengthRepresentanteLegal <= 0) {
      this.ShowBtnWarningRepresentanteLegal = false
      this.ShowBtnPrimaryRepresentanteLegal = true
    } else {
      this.ShowBtnWarningRepresentanteLegal = true
      this.ShowBtnPrimaryRepresentanteLegal = false
    }
  }

  async Select_Estados() {
    this.xAPI.funcion = 'ListarEstados'
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    this.SelectEstado = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.SelectEstado = data.Cuerpo.map(e => {
          return e
        })
      },
      (error) => {
        console.error(error)
      }
    )
  }
  async Select_Ciudad(id: any) {
    this.xAPI.funcion = 'ListarCiudad'
    this.xAPI.parametros = id
    this.xAPI.valores = ''
    this.SelectCiudad = []
    await this.apiService.EjecutarDev(this.xAPI).subscribe(
      (data) => {
        this.SelectCiudad = data.Cuerpo.map(e => {
          return e
        })
      },
      (error) => {
        console.error(error)
      }
    )
  }
  async Select_Municipo(id: any) {
    this.xAPI.funcion = 'ListarMunicipio'
    this.xAPI.parametros = id
    this.xAPI.valores = ''
    this.SelectMunicipio = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.SelectMunicipio = data.Cuerpo.map(e => {
          return e
        })
      },
      (error) => {
        console.error(error)
      }
    )
  }
  async Select_Parroquia(id: any) {
    this.xAPI.funcion = 'ListarParroquia'
    this.xAPI.parametros = id
    this.xAPI.valores = ''
    this.SelectParroquia = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.SelectParroquia = data.Cuerpo.map(e => {
          return e
        })
      },
      (error) => {
        console.error(error)
      }
    )
  }
  async Select_TipoAgencia() {
    this.xAPI.funcion = 'IPOSTEL_tipo_agencia'
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    this.SelectTipoAgencia = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.SelectTipoAgencia = data.Cuerpo.map(e => {
          return e
        })
      },
      (error) => {
        console.error(error)
      }
    )
  }
  async Select_Tipo_servicio() {
    this.xAPI.funcion = 'IPOSTEL_tipo_servicio'
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    this.SelectTipoServicio = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.SelectTipoServicio = data.Cuerpo.map(e => {
          return e
        })
        // console.log(this.SelectTipoServicio)
      },
      (error) => {
        console.error(error)
      }
    )
  }
  async Select_Tipo_Flota() {
    this.xAPI.funcion = 'IPOSTEL_tipo_flota'
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    this.SelectFlotaUtilizada = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.SelectFlotaUtilizada = data.Cuerpo.map(e => {
          return e
        })
        // console.log( this.SelectFlotaUtilizada)
      },
      (error) => {
        console.error(error)
      }
    )
  }

  async Select_Tipo_ArchivoDigital() {
    this.xAPI.funcion = 'IPOSTEL_R_Lista_RETO'
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.SelectArchivoDigitalPostal = data.Cuerpo.map(e => {
          e.id = e.id_reto
          e.name = e.nombre_reto
          return e
        })
      },
      (error) => {
        console.error(error)
      }
    )
  }


  async CantidadFlota(event: any) {
    event.forEach(e => {
      switch (e.id_flota_utilizada) {
        case 0:
          this.vehiculo_liviano = false
          this.camionetas = false
          this.camion_350 = false
          this.camion_750 = false
          this.camion_3_ejes = false
          this.camion_4_ejes = false
          this.camion_5_ejes = false
          this.camion_6_ejes = false
          this.buques = false
          this.aviones = false
          this.avionetas = false
          this.containers = false
          this.motos = false
          this.bicicletas = false
          this.autobuses = false
          break;
        case '1':
          this.vehiculo_liviano = true
          break;
        case '2':
          this.camionetas = true
          break;
        case '3':
          this.camion_350 = true
          break;
        case '4':
          this.camion_750 = true
          break;
        case '5':
          this.camion_3_ejes = true
          break;
        case '6':
          this.camion_4_ejes = true
          break;
        case '7':
          this.camion_5_ejes = true
          break;
        case '8':
          this.camion_6_ejes = true
          break;
        case '9':
          this.buques = true
          break;
        case '10':
          this.aviones = true
          break;
        case '11':
          this.avionetas = true
          break;
        case '12':
          this.containers = true
          break;
        case '13':
          this.motos = true
          break;
        case '14':
          this.bicicletas = true
          break;
          case '15':
            this.autobuses = true
            break;
        default:
          break;
      }
    });
  }
  async Select_TipologiaEmpresa(event: any) {
    switch (event.length) {
      case 1:
       this.DataEmpresa.tipologia_empresa = 3
        this.labelTipologiaEmpresa = 'Operador Pequeña Escala'
        break;
      case 2:
       this.DataEmpresa.tipologia_empresa = 2
        this.labelTipologiaEmpresa = 'Operador Mediana Escala'
        break;
      case 3:
       this.DataEmpresa.tipologia_empresa = 1
        this.labelTipologiaEmpresa = 'Operador Gran Escala'
        break;
      // case 0:
      //   this.IFormOPP.tipologia_empresa = 0
      //   this.labelTipologiaEmpresa = ''
      //   break;
      default:
        break;
    }
  }

  async ActualizarDatosGenerales(){
     this.UDatosGeneralesOPPSUB.nombre_empresa = this.DataEmpresa.nombre_empresa
     this.UDatosGeneralesOPPSUB.rif = this.DataEmpresa.rif
     this.UDatosGeneralesOPPSUB.direccion_empresa = this.DataEmpresa.direccion_empresa
     this.UDatosGeneralesOPPSUB.estado_empresa = this.DataEmpresa.estado_empresa
     this.UDatosGeneralesOPPSUB.ciudad_empresa = this.DataEmpresa.ciudad_empresa
     this.UDatosGeneralesOPPSUB.municipio_empresa = this.DataEmpresa.municipio_empresa
     this.UDatosGeneralesOPPSUB.parroquia_empresa = this.DataEmpresa.parroquia_empresa
     this.UDatosGeneralesOPPSUB.correo_electronico = this.DataEmpresa.correo_electronico
     this.UDatosGeneralesOPPSUB.empresa_facebook = this.DataEmpresa.empresa_facebook
     this.UDatosGeneralesOPPSUB.empresa_instagram = this.DataEmpresa.empresa_instagram
     this.UDatosGeneralesOPPSUB.empresa_twitter = this.DataEmpresa.empresa_twitter
     this.UDatosGeneralesOPPSUB.tipo_agencia = this.DataEmpresa.tipo_agencia
     this.UDatosGeneralesOPPSUB.sucursales = this.DataEmpresa.sucursales
     this.UDatosGeneralesOPPSUB.subcontrataciones = this.DataEmpresa.subcontrataciones
     this.UDatosGeneralesOPPSUB.tipologia_empresa =  parseInt(this.DataEmpresa.tipologia_empresa)
     this.UDatosGeneralesOPPSUB.especificacion_servicio = this.DataEmpresa.especificacion_servicio
     this.UDatosGeneralesOPPSUB.licencia_actividades_economicas_municipales = this.DataEmpresa.licencia_actividades_economicas_municipales
     this.UDatosGeneralesOPPSUB.actividades_economicas_seniat = this.DataEmpresa.actividades_economicas_seniat
     this.UDatosGeneralesOPPSUB.certificado_rupdae = this.DataEmpresa.certificado_rupdae
     this.UDatosGeneralesOPPSUB.patronal_ivss = this.DataEmpresa.patronal_ivss
     this.UDatosGeneralesOPPSUB.matricula_inces = this.DataEmpresa.matricula_inces
     this.UDatosGeneralesOPPSUB.identificacion_laboral_ministerio_trabajo = this.DataEmpresa.identificacion_laboral_ministerio_trabajo
     this.UDatosGeneralesOPPSUB.certificado_eomic = this.DataEmpresa.certificado_eomic
     this.UDatosGeneralesOPPSUB.permiso_bomberos = this.DataEmpresa.permiso_bomberos
     this.UDatosGeneralesOPPSUB.registro_sapi = this.DataEmpresa.registro_sapi
     this.UDatosGeneralesOPPSUB.registro_nacional_contratista = this.DataEmpresa.registro_nacional_contratista
     this.UDatosGeneralesOPPSUB.cantidad_trabajadores = this.DataEmpresa.cantidad_trabajadores
     this.UDatosGeneralesOPPSUB.cantidad_subcontratados  = this.DataEmpresa.cantidad_subcontratados
     this.UDatosGeneralesOPPSUB.id_opp = this.IdOPP
     this.UDatosGeneralesOPPSUB.flota_utilizada =  JSON.stringify(this.DataEmpresa.flota_utilizada)
     this.UDatosGeneralesOPPSUB.tipo_servicio =  JSON.stringify(this.DataEmpresa.tipo_servicio)
    // console.log( this.UDatosGeneralesOPPSUB)
    this.xAPI.funcion = 'IPOSTEL_U_OPP_ID'
    this.xAPI.parametros = `${this.IdOPP}`
    this.xAPI.valores = JSON.stringify(this.UDatosGeneralesOPPSUB)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo === 1) {
          this.modalService.dismissAll('Close')
          this.utilService.alertConfirmMini('success', 'Datos Actualizados Exitosamente!')
        } else {
          this.utilService.alertConfirmMini('error', 'Algo salio mal! <br> Verifique e intente de nuevo')
        }
      },
      (error) => {
        console.error(error)
      }
    )

  }

  async EmpresaOPP(id: any) {
      this.xAPI.funcion = "IPOSTEL_R_OPP_ID"
    this.xAPI.valores = ''
    this.xAPI.parametros = `${id}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.DataEmpresa.tipologia_empresa = e.tipologia_empresa
          this.DataEmpresa.id_opp = e.id_opp
          this.DataEmpresa.nombre_empresa = e.nombre_empresa
          this.DataEmpresa.rif = e.rif
          this.DataEmpresa.role = e.role
          this.DataEmpresa.status_empresa = e.status_empresa
          if (e.tipo_registro == 1) {
            this.DataEmpresa.tipo_registro = 'Oficina Postal Privada'
          } else {
            this.DataEmpresa.tipo_registro = 'Subcontratista'
          }
          this.DataEmpresa.opp = e.opp
          this.DataEmpresa.direccion_empresa = e.direccion_empresa
          this.DataEmpresa.estado_empresa = e.estado_empresa
          this.DataEmpresa.ciudad_empresa = e.ciudad_empresa
          this.DataEmpresa.municipio_empresa = e.municipio_empresa
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
          this.DataEmpresa.cantidad_trabajadores = e.cantidad_trabajadores
          this.DataEmpresa.cantidad_subcontratados = e.cantidad_subcontratados
          this.DataEmpresa.tipo_servicio = JSON.parse(e.tipo_servicio)
          this.DataEmpresa.flota_utilizada = JSON.parse(e.flota_utilizada)
          this.xFlotaUtilizada = JSON.parse(e.flota_utilizada)
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaFlotaUtilizada() {
    this.xAPI.funcion = 'IPOSTEL_R_ConexionFlotaUtilizada'
    this.xAPI.parametros = `${this.IdOPP}`
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
      // return array
      data.Cuerpo.map( e=> {
        this.IConexionFlotaUtilizada.vehiculo_liviano = e.vehiculo_liviano
        this.IConexionFlotaUtilizada.camionetas = e.camionetas
        this.IConexionFlotaUtilizada.camion_350 = e.camion_350
        this.IConexionFlotaUtilizada.camion_750 = e.camion_750
        this.IConexionFlotaUtilizada.camion_3_ejes = e.camion_3_ejes
        this.IConexionFlotaUtilizada.camion_4_ejes = e.camion_4_ejes
        this.IConexionFlotaUtilizada.camion_5_ejes = e.camion_5_ejes
        this.IConexionFlotaUtilizada.camion_6_ejes = e.camion_6_ejes
        this.IConexionFlotaUtilizada.buques = e.buques
        this.IConexionFlotaUtilizada.aviones = e.avion
        this.IConexionFlotaUtilizada.avionetas = e.avionetas
        this.IConexionFlotaUtilizada.containers = e.containers
        this.IConexionFlotaUtilizada.bicicletas = e.bicicletas
        this.IConexionFlotaUtilizada.autobuses = e.autobuses
        this.IConexionFlotaUtilizada.motos = e.motos

        this.arrayFlotaUtilizada = [
        { name: 'Vehiculos Livianos' , valor:  e.vehiculo_liviano},
        { name: 'Camionetas' , valor:  e.camionetas},
        { name: 'Camion 350' , valor:  e.camion_350},
        { name: 'Camion 750' , valor:  e.camion_750},
        { name: 'Camion 3 Ejes' , valor:  e.camion_3_ejes},
        { name: 'Camion 4 Ejes' , valor:  e.camion_4_ejes},
        { name: 'Camion 5 Ejes' , valor:  e.camion_5_ejes},
        { name: 'Camion 6 Ejes' , valor:  e.camion_6_ejes},
        { name: 'Buques' , valor:  e.buques},
        { name: 'Aviones' , valor:  e.aviones},
        { name: 'Avionetas' , valor:  e.avionetas},
        { name: 'Containers' , valor:  e.containers},
        { name: 'Motos' , valor:  e.motos},
        { name: 'Bicicletas' , valor:  e.bicicletas},
        { name: 'Autobuses' , valor:  e.autobuses},
      ]

       return e
       }) 
      },
      (error) => {
        console.error(error)
      }
    )
  }

  async Subcontratistas(id: any) {
    this.Subcontratista = []
    this.rowsSubcontratistas = []
    this.xAPI.funcion = "IPOSTEL_R_Subcontratista_ID"
    this.xAPI.parametros = `${id}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          if (e.tipo_registro == 1) {
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

  async ModalSubirArchivo(modal) {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.numControl = this.token.Usuario[0].rif
    this.hashcontrol = btoa("D" + this.numControl) //Cifrar documentos
    // console.log(atob(this.hashcontrol))
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  fileSelected(e) {
    this.archivos.push(e.target.files[0])
  }
   subirArchivo(e) {
    this.sectionBlockUI.start('Subiendo Archivo, por favor Espere!!!');
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.DocAdjunto.nombre = this.archivos[0].name
    this.DocAdjunto.usuario = this.token.Usuario[0].id_opp
    this.DocAdjunto.empresa = this.token.Usuario[0].id_opp
    this.DocAdjunto.numc = this.numControl
    this.DocAdjunto.tipo = parseInt(this.TipoDocument)
    this.DocAdjunto.vencimiento = this.datetime1.year+'-'+this.datetime1.month+'-'+this.datetime1.day 
    var frm = new FormData(document.forms.namedItem("forma"))
    console.log(frm)
    try {
       this.apiService.EnviarArchivos(frm).subscribe(
        (data) => {
          this.rowsDocumentosAdjuntosEmpresa.push(this.EmpresaDocumentosAdjuntos)
          this.xAPI.funcion = 'IPOSTEL_I_ArchivoDigital'
          this.xAPI.parametros = ''
          this.xAPI.valores = JSON.stringify(this.DocAdjunto)
          this.apiService.Ejecutar(this.xAPI).subscribe(
            (xdata) => {
              if (xdata.tipo == 1) {
                this.EmpresaDocumentosAdjuntos = []
                this.DocumentosAdjuntosOPPSUB()    
                this.utilService.alertConfirmMini('success', 'Tu archivo ha sido cargado con exito')
                this.modalService.dismissAll('Cerrar Modal')
                 this.sectionBlockUI.stop();
              } else {
                this.utilService.alertConfirmMini('info', xdata.msj)
                this.sectionBlockUI.stop();
              }
            },
            (error) => {
              this.utilService.alertConfirmMini('error', error)
              this.sectionBlockUI.stop();
            }
          )
        }
      )
    } catch (error) {
      this.utilService.alertConfirmMini('error', error)
      this.sectionBlockUI.stop();
    }

  }

   DescargarADP(ncontrol: string, archivo: string) {
    return  this.apiService.Dws(btoa("D" + ncontrol) + '/' + archivo)
  }


   DocumentosAdjuntosOPPSUB() {
    this.xAPI.funcion = "IPOSTEL_R_ArchivoDigital";
    this.xAPI.parametros = `${this.IdOPP}`
     this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          e.vencimiento = this.utilService.FechaMomentLL(e.vencimiento);
          this.EmpresaDocumentosAdjuntos.push(e);
        });
        this.rowsDocumentosAdjuntosEmpresa = this.EmpresaDocumentosAdjuntos;
        this.tempDataDocumentosAdjuntosEmpresa = this.rowsDocumentosAdjuntosEmpresa
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
        this.lengthRepresentanteLegal = data.Cuerpo.length
        if (data.Cuerpo.length > 0) {
          this.btnShowRepresentante = false
        } else {
          this.btnShowRepresentante = true
        }
        data.Cuerpo.map(e => {
          this.DataRepresentanteLegal.apellidos_representante_legal = e.apellidos_representante_legal
          this.DataRepresentanteLegal.cargo_representante_legal = e.cargo_representante_legal
          this.DataRepresentanteLegal.cedula_representante_legal = e.cedula_representante_legal
          this.DataRepresentanteLegal.direccion_representante_legal = e.direccion_representante_legal
          this.DataRepresentanteLegal.email_representante_legal = e.email_representante_legal
          this.DataRepresentanteLegal.facebook_representante_legal = e.facebook_representante_legal
          this.DataRepresentanteLegal.fecha_registro = e.fecha_registro
          this.DataRepresentanteLegal.id_opp = e.id_opp
          this.DataRepresentanteLegal.id_representante_legal = e.id_representante_legal
          this.DataRepresentanteLegal.instagram_representante_legal = e.instagram_representante_legal
          this.DataRepresentanteLegal.n_registro = e.n_registro
          this.DataRepresentanteLegal.nombres_representante_legal = e.nombres_representante_legal
          this.DataRepresentanteLegal.telefono_movil_representante_legal = e.telefono_movil_representante_legal
          this.DataRepresentanteLegal.telefono_residencial_representante_legal = e.telefono_residencial_representante_legal
          this.DataRepresentanteLegal.tomo = e.tomo
          this.DataRepresentanteLegal.tomo_contrato = e.tomo_contrato
          this.DataRepresentanteLegal.fecha_registro_contrato = e.fecha_registro_contrato
          this.DataRepresentanteLegal.n_registro_contrato = e.n_registro_contrato
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
        this.lengthDelegado = data.Cuerpo.length
        if (data.Cuerpo.length > 0) {
          this.btnShowDelegado = false
        } else {
          this.btnShowDelegado = true
        }
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

  filterUpdateDocumentoAdjuntoEmpresa(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataDocumentosAdjuntosEmpresa.filter(function (d) {
      return d.nombre_reto.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsDocumentosAdjuntosEmpresa = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  async UpdateDelegado() {
    this.UpdateDelegate.id_opp = this.IdOPP
    this.UpdateDelegate.nombres_delegado = this.DataDelegado.nombres_delegado
    this.UpdateDelegate.apellidos_delegado = this.DataDelegado.apellidos_delegado
    this.UpdateDelegate.cedula_delegado = this.DataDelegado.cedula_delegado
    this.UpdateDelegate.cargo_delegado = this.DataDelegado.cargo_delegado
    this.UpdateDelegate.telefono_delegado = this.DataDelegado.telefono_delegado
    this.UpdateDelegate.email_delegado = this.DataDelegado.email_delegado
    this.UpdateDelegate.facebook_delegado = this.DataDelegado.facebook_delegado
    this.UpdateDelegate.instagram_delegado = this.DataDelegado.instagram_delegado
    this.UpdateDelegate.twitter_delegado = this.DataDelegado.twitter_delegado
    this.xAPI.funcion = 'IPOSTEL_U_DatosDelegados'
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.UpdateDelegate)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo == 1) {
          this.modalService.dismissAll('Close')
          // this.sectionBlockUI.stop()
          this.utilService.alertConfirmMini('success', 'Datos Actualizados Exitosamente!')
        } else {
          // this.sectionBlockUI.stop();
          this.utilService.alertConfirmMini('error', 'Algo salio mal! <br> Verifique e intente de nuevo')
        }
      },
      (error) => {
        console.error(error)
      }
    )
  }

  async AddDelegadoOPP() {
    this.UpdateDelegate.id_opp = this.IdOPP
    this.UpdateDelegate.nombres_delegado = this.DataDelegado.nombres_delegado
    this.UpdateDelegate.apellidos_delegado = this.DataDelegado.apellidos_delegado
    this.UpdateDelegate.cedula_delegado = this.DataDelegado.cedula_delegado
    this.UpdateDelegate.cargo_delegado = this.DataDelegado.cargo_delegado
    this.UpdateDelegate.telefono_delegado = this.DataDelegado.telefono_delegado
    this.UpdateDelegate.email_delegado = this.DataDelegado.email_delegado
    this.UpdateDelegate.facebook_delegado = this.DataDelegado.facebook_delegado
    this.UpdateDelegate.instagram_delegado = this.DataDelegado.instagram_delegado
    this.UpdateDelegate.twitter_delegado = this.DataDelegado.twitter_delegado
    this.xAPI.funcion = 'IPOSTEL_C_DatosDelegados'
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.UpdateDelegate)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo == 1) {
          this.modalService.dismissAll('Close')
          // this.sectionBlockUI.stop()
          this.utilService.alertConfirmMini('success', 'Datos Agregados Exitosamente!')
        } else {
          // this.sectionBlockUI.stop();
          this.utilService.alertConfirmMini('error', 'Algo salio mal! <br> Verifique e intente de nuevo')
        }
      },
      (error) => {
        console.error(error)
      }
    )
  }

  async UpdateRepresentanteLegal() {
    this.IUpdateRepresentanteLegal.id_opp = this.IdOPP
    this.IUpdateRepresentanteLegal.nombres_representante_legal = this.DataRepresentanteLegal.nombres_representante_legal
    this.IUpdateRepresentanteLegal.apellidos_representante_legal = this.DataRepresentanteLegal.apellidos_representante_legal
    this.IUpdateRepresentanteLegal.cedula_representante_legal = this.DataRepresentanteLegal.cedula_representante_legal
    this.IUpdateRepresentanteLegal.cargo_representante_legal = this.DataRepresentanteLegal.cargo_representante_legal
    this.IUpdateRepresentanteLegal.n_registro = this.DataRepresentanteLegal.n_registro
    this.IUpdateRepresentanteLegal.fecha_registro = this.DataRepresentanteLegal.fecha_registro
    this.IUpdateRepresentanteLegal.tomo = this.DataRepresentanteLegal.tomo
    this.IUpdateRepresentanteLegal.n_registro_contrato = this.DataRepresentanteLegal.n_registro_contrato
    this.IUpdateRepresentanteLegal.fecha_registro_contrato = this.DataRepresentanteLegal.fecha_registro_contrato
    this.IUpdateRepresentanteLegal.tomo_contrato = this.DataRepresentanteLegal.tomo_contrato
    this.IUpdateRepresentanteLegal.direccion_representante_legal = this.DataRepresentanteLegal.direccion_representante_legal
    this.IUpdateRepresentanteLegal.email_representante_legal = this.DataRepresentanteLegal.email_representante_legal
    this.IUpdateRepresentanteLegal.facebook_representante_legal = this.DataRepresentanteLegal.facebook_representante_legal
    this.IUpdateRepresentanteLegal.instagram_representante_legal = this.DataRepresentanteLegal.instagram_representante_legal
    this.IUpdateRepresentanteLegal.twitter_representante_legal = this.DataRepresentanteLegal.twitter_representante_legal
    this.IUpdateRepresentanteLegal.telefono_movil_representante_legal = this.DataRepresentanteLegal.telefono_movil_representante_legal
    this.IUpdateRepresentanteLegal.telefono_residencial_representante_legal = this.DataRepresentanteLegal.telefono_residencial_representante_legal
    this.xAPI.funcion = 'IPOSTEL_U_DatosRepresentanteLegal'
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.IUpdateRepresentanteLegal)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo == 1) {
          this.modalService.dismissAll('Close')
          // this.sectionBlockUI.stop()
          this.utilService.alertConfirmMini('success', 'Datos Actualizados Exitosamente!')
        } else {
          // this.sectionBlockUI.stop();
          this.utilService.alertConfirmMini('error', 'Algo salio mal! <br> Verifique e intente de nuevo')
        }
      },
      (error) => {
        console.error(error)
      }
    )
  }

  async AddRepresentanteLegalOPP() {
    this.IUpdateRepresentanteLegal.id_opp = this.IdOPP
    this.IUpdateRepresentanteLegal.nombres_representante_legal = this.DataRepresentanteLegal.nombres_representante_legal
    this.IUpdateRepresentanteLegal.apellidos_representante_legal = this.DataRepresentanteLegal.apellidos_representante_legal
    this.IUpdateRepresentanteLegal.cedula_representante_legal = this.DataRepresentanteLegal.cedula_representante_legal
    this.IUpdateRepresentanteLegal.cargo_representante_legal = this.DataRepresentanteLegal.cargo_representante_legal
    this.IUpdateRepresentanteLegal.n_registro = this.DataRepresentanteLegal.n_registro
    this.IUpdateRepresentanteLegal.fecha_registro = this.DataRepresentanteLegal.fecha_registro
    this.IUpdateRepresentanteLegal.tomo = this.DataRepresentanteLegal.tomo
    this.IUpdateRepresentanteLegal.n_registro_contrato = this.DataRepresentanteLegal.n_registro_contrato
    this.IUpdateRepresentanteLegal.fecha_registro_contrato = this.DataRepresentanteLegal.fecha_registro_contrato
    this.IUpdateRepresentanteLegal.tomo_contrato = this.DataRepresentanteLegal.tomo_contrato
    this.IUpdateRepresentanteLegal.direccion_representante_legal = this.DataRepresentanteLegal.direccion_representante_legal
    this.IUpdateRepresentanteLegal.email_representante_legal = this.DataRepresentanteLegal.email_representante_legal
    this.IUpdateRepresentanteLegal.facebook_representante_legal = this.DataRepresentanteLegal.facebook_representante_legal
    this.IUpdateRepresentanteLegal.instagram_representante_legal = this.DataRepresentanteLegal.instagram_representante_legal
    this.IUpdateRepresentanteLegal.twitter_representante_legal = this.DataRepresentanteLegal.twitter_representante_legal
    this.IUpdateRepresentanteLegal.telefono_movil_representante_legal = this.DataRepresentanteLegal.telefono_movil_representante_legal
    this.IUpdateRepresentanteLegal.telefono_residencial_representante_legal = this.DataRepresentanteLegal.telefono_residencial_representante_legal
    this.xAPI.funcion = 'IPOSTEL_C_DatosRepresentanteLegal'
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.IUpdateRepresentanteLegal)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo == 1) {
          this.modalService.dismissAll('Close')
          // this.sectionBlockUI.stop()
          this.utilService.alertConfirmMini('success', 'Datos Agregados Exitosamente!')
        } else {
          // this.sectionBlockUI.stop();
          this.utilService.alertConfirmMini('error', 'Algo salio mal! <br> Verifique e intente de nuevo')
        }
      },
      (error) => {
        console.error(error)
      }
    )
  }

  async ModalEditarDelegado(modal) {
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async ModalEditarRepresentanteLegal(modal) {
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async ModalAddDelegado(modal) {
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async ModalEditarEmpresa(modal) {
    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });

  }

  async ModalAddRepresentanteLegal(modal) {
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

}
