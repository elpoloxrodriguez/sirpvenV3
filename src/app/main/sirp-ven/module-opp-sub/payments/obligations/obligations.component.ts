import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { IPOSTEL_C_PagosDeclaracionOPP_SUB, IPOSTEL_DATA_EMPRESA_ID, IPOSTEL_U_PagosDeclaracionOPP_SUB, IPOSTEL_U_Status_Opp_Sub } from '@core/services/empresa/form-opp.service';
import { UtilService } from '@core/services/util/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jwt_decode from "jwt-decode";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { PdfService } from '@core/services/pdf/pdf.service';
import { AngularFileUploaderComponent } from 'angular-file-uploader';
import { DatePipe } from '@angular/common';
import { GenerarPagoService } from '@core/services/generar-pago.service';


@Component({
  selector: 'app-obligations',
  templateUrl: './obligations.component.html',
  styleUrls: ['./obligations.component.scss']
})
export class ObligationsComponent implements OnInit {

@ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;

  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  @ViewChild('fileUpload1')
  private fileUpload1: AngularFileUploaderComponent

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

  public chkBoxSelected = [];


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public MontoTotalAdeudado: string = '0';
  public archivos = []
  public hashcontrol = ''
  public numControl: string = ''

  public listaTiposPagos = []

  public ActualizarPago: IPOSTEL_U_PagosDeclaracionOPP_SUB = {
    status_pc: 0,
    fecha_pc: '',
    id_banco_pc: undefined,
    referencia_bancaria: '',
    monto_pc: '',
    monto_pagar: '',
    dolar_dia: '',
    petro_dia: '',
    archivo_adjunto: '',
    observacion_pc: '',
    user_created: 0,
    user_updated: 0,
    id_pc: 0
  }

  public fechaActual
  public kitchenSinkRows: any;
  public basicSelectedOption: number = 10;

  public isLoading: number = 0;

  public idOPP
  public RowsLengthConciliacion
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public selected = [];

  public title_modal
  public ShowReportarPago = false
  public ShowModificarPago = false
  public monto_pagarX
  public monto_pagar_muestra

  public ShowMontoCero

  public SelectionType = SelectionType;

  public MantenimientoYSeguridad = []

  public pDolar: number = 0
  public pPetro: number = 0
  public monto: number = 0
  public conversion: number = 0

  public fechaActualPago

  public nombreEmpresaOPP
  public rifEmpresaOPP

  public ListaMantenimientoYSeguridad = []

  public MontoRealPagar
  public token
  public n_opp = 0
  public rowsPagosConciliacion
  public tempDataPagosConciliacion = []
  public List_Pagos_Recaudacion = []
  public TipoRegistro

  public titleModal

  public user

  public SelectBancos = []
  public NombreBancoEmisor

  public MontoMantenimiento = []
  public DolarPetroDia



  public currentDate = new Date();
  public formattedDate = this.datePipe.transform(this.currentDate, 'MM-dd');

  public loadingIndicator = true

  public XtotalPetrosX
  public XmontoPagarX
  public montoPagar
  public totalPetros
  public manNuevo

  public yearsList: { year: number }[] = [];

  public datosOriginales: any[];

  public rowMantenimiento = []

  public SelectCategoriaPagos = [
    { id: 0, name: 'PAGOS EN REVISIÓN' },
    { id: 4, name: 'PAGOS PENDIENTES' },
    { id: 2, name: 'PAGOS APROBADOS' },
    { id: 3, name: 'PAGOS RECHAZADOS' },
    { id: 1, name: 'PAGOS NO CONCILIADOS' }
  ]

  public SelectTipoPagos = [
    // { id: 1, name: 'Franqueo Postal Obligatorio' },
    { id: 2, name: 'Derecho Semestral 1' },
    { id: 3, name: 'Derecho Semestral 2' },
    { id: 4, name: 'Anualidad' },
    { id: 5, name: 'Uso Contrato Subcontratista' },
    { id: 6, name: 'Reparos' },
    { id: 9, name: 'Renovación' }
  ]


  public resultadoFactura

  public anioObligaciones = undefined
  public tipoPago = undefined
  public tipoCategoriaPago = undefined
  public statusPC = undefined

  public tipoToken

  public cuanto

  public ShowTabla: boolean = true

  public dataObligacionOPP = []

  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private modalService: NgbModal,
    private router: Router,
    private pdf: PdfService,
    private datePipe: DatePipe,
    private updateConciliacion: GenerarPagoService,
  ) { }

  async ngOnInit() {
    // this.sectionBlockUI.start('Registrando Pago, por favor Espere!!!');
    // setTimeout(() => this.sectionBlockUI.stop(), 3000)
    this.token = jwt_decode(sessionStorage.getItem('token'));

    this.tipoToken = this.token.Usuario[0].tipo_registro

    if (this.tipoToken == 1) {
      this.ShowTabla = true
    } else {
      this.ShowTabla = false
    }

    this.idOPP = this.token.Usuario[0].id_opp
    this.TipoRegistro = this.token.Usuario[0].tipo_registro

    this.Precio_Dolar_Petro()
    this.generateYearsList()
    await this.ListaPagosRecaudacion()
    await this.ListaBancosVzla()
    await this.ListaTiposPagos()
  }


  async Precio_Dolar_Petro() {
    this.xAPI.funcion = "IPOSTEL_R_PRECIO_PETRO_DOLAR";
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.DolarPetroDia = data.Cuerpo.map(e => {
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaBancosVzla() {
    this.xAPI.funcion = "IPOSTEL_R_BancosVzla"
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.SelectBancos = data.Cuerpo.map(e => {
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async LimpiarFiltro() {
    this.List_Pagos_Recaudacion = []
    this.rowsPagosConciliacion = []
    this.anioObligaciones = undefined
    this.tipoPago = undefined
    this.tipoCategoriaPago = undefined
    this.statusPC = undefined

    await this.ListaPagosRecaudacion()
  }

  customChkboxOnSelect({ selected }) {
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...selected);
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    for (let i = 0; i < selected.length; i++) {
      const element = selected[i];
      console.log("Total: ", element.montoReal)
    }
  }
  onActivate(event) {
    // console.log('Activate Event', event);
  }

  fileSelected(e) {
    this.archivos.push(e.target.files[0])
  }

  subirArchivo(e) {
    this.sectionBlockUI.start('Subiendo Archivo, por favor Espere!!!');
    this.token = jwt_decode(sessionStorage.getItem('token'));
    // this.DocAdjunto.nombre = this.archivos[0].name
    // this.DocAdjunto.usuario = this.token.Usuario[0].id_opp
    // this.DocAdjunto.empresa = this.token.Usuario[0].id_opp
    // this.DocAdjunto.numc = this.numControl
    // this.DocAdjunto.tipo = parseInt(this.TipoDocument)
    // this.DocAdjunto.vencimiento = this.datetime1.year+'-'+this.datetime1.month+'-'+this.datetime1.day 
    var frm = new FormData(document.forms.namedItem("forma"))
    // console.log(frm)
    try {
      this.apiService.EnviarArchivos(frm).subscribe(
        (data) => {
          // this.rowsDocumentosAdjuntosEmpresa.push(this.EmpresaDocumentosAdjuntos)
          this.xAPI.funcion = 'IPOSTEL_I_ArchivoDigital'
          this.xAPI.parametros = ''
          // this.xAPI.valores = JSON.stringify(this.DocAdjunto)
          this.apiService.Ejecutar(this.xAPI).subscribe(
            (xdata) => {
              if (xdata.tipo == 1) {
                // this.EmpresaDocumentosAdjuntos = []
                // this.DocumentosAdjuntosOPPSUB()    
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


  generateYearsList() {
    const currentYear = new Date().getFullYear();
    for (let year = 2023; year <= currentYear; year++) {
      this.yearsList.push({ year: year });
    }
  }

  async ListaPagosRecaudacion() {
    this.isLoading = 0;
    this.List_Pagos_Recaudacion = []
    this.rowsPagosConciliacion = []
    this.RowsLengthConciliacion = 0
    this.xAPI.funcion = "IPOSTEL_R_Pagos_ConciliacionOPPSUB"
    this.xAPI.parametros = this.idOPP.toString()
    this.xAPI.valores = ''
    
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.Cuerpo.length > 0) {
          data.Cuerpo.map(e => {
            let fecha = new Date(e.fecha_pc);
            e.anio = fecha.getFullYear();
            e.mantenimiento = e.mantenimiento ? e.mantenimiento : null
            e.mantenimiento = JSON.parse(e.mantenimiento)
            e.fecha = this.utilService.FechaMomentLL(e.fecha_pc)
            e.montoReal = e.monto_pagar
            e.monto_pcx = e.monto_pc
            this.MontoRealPagar = e.monto_pagar
            e.monto_pc = this.utilService.ConvertirMoneda(e.monto_pc)
            e.monto_pagar = this.utilService.ConvertirMoneda(e.monto_pagar)
            this.List_Pagos_Recaudacion.push(e)
          });
          
          // Filtrar por tipo_pago_pc
          this.rowsPagosConciliacion = this.List_Pagos_Recaudacion.filter(objeto => objeto.tipo_pago_pc != 1);
  
          let MontoTotalA = this.rowsPagosConciliacion.map(item => item.montoReal).reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
          this.MontoTotalAdeudado = this.utilService.ConvertirMoneda(MontoTotalA ? MontoTotalA : 0)
          this.RowsLengthConciliacion = this.rowsPagosConciliacion.length
          this.tempDataPagosConciliacion = this.rowsPagosConciliacion
  
          this.datosOriginales = [...this.rowsPagosConciliacion]; // Hacer una copia de respaldo al inicializar el componente
          this.rowsPagosConciliacion = [...this.datosOriginales]; // Restaurar los datos originales
          this.isLoading = 1;
        } else {
          this.isLoading = 2;
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }
  


  FiltarObligacionAnio(event: any) {
    if (event != undefined) {
      this.rowsPagosConciliacion = [...this.datosOriginales]; // Restaurar los datos originales
      this.rowsPagosConciliacion = this.rowsPagosConciliacion.filter(objeto => objeto.anio === event.year); // Aplicar el filtro
      this.table.offset = 0;
    }
  }

  FiltarObligacionCategoriaPago(event: any) {
    if (event != undefined) {
      this.rowsPagosConciliacion = [...this.datosOriginales]; // Restaurar los datos originales
      this.rowsPagosConciliacion = this.rowsPagosConciliacion.filter(objeto => objeto.status_pc === event.id); // Aplicar el filtro
      this.table.offset = 0;
    }
  }

  FiltarObligacionStatusTipoPago(event: any) {
    if (event != undefined) {
      this.rowsPagosConciliacion = [...this.datosOriginales]; // Restaurar los datos originales
      this.rowsPagosConciliacion = this.rowsPagosConciliacion.filter(objeto => objeto.tipo_pago_pc === event.id); // Aplicar el filtro
      this.table.offset = 0;
    }
  }


  async ModalPagar(modal, data) {
    // console.log(data)
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.numControl = this.token.Usuario[0].rif
    this.hashcontrol = btoa("D" + this.numControl) //Cifrar documentos

    this.title_modal = 'Reportar Declaración de Pago'
    this.ShowReportarPago = true
    this.ShowModificarPago = false
    // console.log(data)
    this.ActualizarPago.status_pc = 0
    this.ActualizarPago.observacion_pc = data.observacion_pc
    this.ActualizarPago.monto_pagar = data.montoReal
    this.monto_pagarX = data.monto_pagar
    this.monto_pagar_muestra = data.monto_pagar
    this.ActualizarPago.monto_pc = data.montoReal
    this.ActualizarPago.dolar_dia = data.dolar_dia
    this.ActualizarPago.petro_dia = data.petro_dia
    this.ActualizarPago.user_created = data.user_created
    this.ActualizarPago.user_updated = this.idOPP
    this.ActualizarPago.id_pc = data.id_pc
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async ModalPagarModificar(modal, data) {
    // console.log(data)
    this.title_modal = 'Modificar Declaración de Pago'
    this.ShowReportarPago = false
    this.ShowModificarPago = true
    this.ActualizarPago.status_pc = 0
    this.ActualizarPago.monto_pagar = data.montoReal
    this.monto_pagarX = data.monto_pagar
    this.ActualizarPago.monto_pc = data.montoReal
    this.ActualizarPago.fecha_pc = data.fecha_pc
    this.ActualizarPago.id_banco_pc = data.id_banco_pc
    this.ActualizarPago.referencia_bancaria = data.referencia_bancaria
    this.ActualizarPago.observacion_pc = data.observacion_pc
    this.ActualizarPago.dolar_dia = data.dolar_dia
    this.ActualizarPago.petro_dia = data.petro_dia
    this.ActualizarPago.archivo_adjunto = data.archivo_adjunto ? data.archivo_adjunto : this.archivos[0].name
    this.ActualizarPago.user_created = data.user_created
    this.ActualizarPago.user_updated = this.idOPP
    this.ActualizarPago.id_pc = data.id_pc
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  cerrarModal() {
    this.List_Pagos_Recaudacion = []
    this.rowsPagosConciliacion = []

    this.ListaPagosRecaudacion()

    this.ListaMantenimientoYSeguridad = []
    this.montoPagar = 0
    this.totalPetros = 0
    this.XmontoPagarX = 0
    this.XtotalPetrosX = 0
    this.rowMantenimiento = []
    this.dataObligacionOPP = []
    this.fechaActualPago = ''
    this.manNuevo = []
    this.modalService.dismissAll('Accept click')
  }

  mostarDatosDetallesSUB(row: any, nuevo: any) {

    this.rowMantenimiento = row.mantenimiento
    this.fechaActualPago = row.fecha
    const dolar = row.dolar_dia

    this.rowMantenimiento.push(nuevo)


    this.rowMantenimiento.map(e => {
      e.dolitar = this.utilService.ConvertirMoneda$(parseFloat(e.tasa_petro).toFixed(2))
      e.bolivares = (parseFloat(e.tasa_petro) * parseFloat(dolar)).toFixed(2)
      e.bolivaresx = this.utilService.ConvertirMoneda(e.bolivares)
      this.ListaMantenimientoYSeguridad.push(e)
    });
    let MontoTotalA = this.ListaMantenimientoYSeguridad.map(item => item.bolivares).reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
    this.montoPagar = this.utilService.ConvertirMoneda(MontoTotalA) // Bolivares

    let MontoTotalB = this.ListaMantenimientoYSeguridad.map(item => item.tasa_petro).reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
    this.totalPetros = this.utilService.ConvertirMoneda$(MontoTotalB) // Dolares

    this.resultadoFactura = this.montoPagar
  }

  mostarDatosDetallesOPP(row: any, nuevo: any) {

    // console.log(nuevo)
    this.rowMantenimiento = row.mantenimiento
    this.fechaActualPago = row.fecha
    const dolar = row.dolar_dia

    // this.rowMantenimiento.push(nuevo)
    this.dataObligacionOPP.push(nuevo)

    let MontoTotalAx = this.dataObligacionOPP.map(item => item.monto_real).reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
    this.XmontoPagarX = this.utilService.ConvertirMoneda(MontoTotalAx) // Bolivares

    let MontoTotalBx = this.dataObligacionOPP.map(item => item.tasa_petro).reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
    this.XtotalPetrosX = this.utilService.ConvertirMoneda$(MontoTotalBx) // Dolares

    this.rowMantenimiento.map(e => {
      e.dolitar = this.utilService.ConvertirMoneda$(parseFloat(e.tasa_petro).toFixed(2))
      e.bolivares = (parseFloat(e.tasa_petro) * parseFloat(dolar)).toFixed(2)
      e.bolivaresx = this.utilService.ConvertirMoneda(e.bolivares)
      this.ListaMantenimientoYSeguridad.push(e)
    });
    let MontoTotalA = this.ListaMantenimientoYSeguridad.map(item => item.bolivares).reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
    this.montoPagar = this.utilService.ConvertirMoneda(MontoTotalA) // Bolivares

    let MontoTotalB = this.ListaMantenimientoYSeguridad.map(item => item.tasa_petro).reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
    this.totalPetros = this.utilService.ConvertirMoneda$(MontoTotalB) // Dolares

    // Eliminar el texto "VEF" y espacios, y reemplazar la coma por un punto
    this.XmontoPagarX = this.XmontoPagarX.replace(/(VEF)|(\s)/g, "").replace(",", ".");
    this.montoPagar = this.montoPagar.replace(/(VEF)|(\s)/g, "").replace(",", ".");
    // Convertir los montos a números
    let numeroMonto1 = parseFloat(this.XmontoPagarX);
    let numeroMonto2 = parseFloat(this.montoPagar);
    // Sumar los montos
    let result = numeroMonto1 + numeroMonto2;
    this.resultadoFactura = this.utilService.ConvertirMoneda(result)
  }

  async ConsultarOPP(id_opp: any) {
    this.xAPI.funcion = "IPOSTEL_R_OPP_ID"
    this.xAPI.parametros = `${id_opp}`
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          // console.log(e)
          this.nombreEmpresaOPP = e.nombre_empresa
          this.rifEmpresaOPP = e.rif
        });
      },
      (error) => {
        console.log(error)
      }
    )

  }

  async VerDetalleSUB(modal: any, row: any) {
    this.titleModal = row.nombre_empresa

    let nuevo = {
      bolivares: 0,
      bolivaresx: "VEF 0,00",
      id_tipo_pagos: 0,
      iniciales_tipo_pagos: row.iniciales_tipo_pagos,
      nombre_tipo_pagos: row.nombre_tipo_pagos,
      tasa_petro: (parseFloat(row.montoReal) / parseFloat(row.dolar_dia)).toFixed(2),
      tipo_pago: row.tipo_pago_pc
    }

    await this.ConsultarOPP(row.user_created)
    this.mostarDatosDetallesSUB(row, nuevo)


    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async VerDetalleOPP(modal: any, row: any) {

    // console.log(row)
    this.titleModal = row.nombre_empresa

    this.cuanto = row.petro_dia / row.dolar_dia

    await this.ConsultarOPP(row.user_created)

    if (row.declaracion == 0) {
      let nuevo = {
        monto_real: 0,
        bolivares: 0,
        bolivaresx: "VEF 0,00",
        id_tipo_pagos: 0,
        iniciales_tipo_pagos: row.iniciales_tipo_pagos,
        nombre_tipo_pagos: row.nombre_tipo_pagos,
        tasa_petro: 0,
        tipo_pago: row.tipo_pago_pc
      }
      this.mostarDatosDetallesOPP(row, nuevo)
    } else {
      let nuevo = {
        monto_real: row.petro_dia,
        bolivares: this.utilService.ConvertirMoneda$(this.cuanto),
        bolivaresx: row.petro_dia,
        bolivaresxx: this.utilService.ConvertirMoneda(row.petro_dia),
        id_tipo_pagos: 0,
        iniciales_tipo_pagos: row.iniciales_tipo_pagos,
        nombre_tipo_pagos: row.nombre_tipo_pagos,
        tasa_petro: (parseFloat(row.petro_dia) / parseFloat(row.dolar_dia)).toFixed(2),
        tasa_petr: this.utilService.ConvertirMoneda$((parseFloat(row.petro_dia) / parseFloat(row.dolar_dia)).toFixed(2)),
        tipo_pago: row.tipo_pago_pc
      }
      this.mostarDatosDetallesOPP(row, nuevo)
    }



    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async ModificarConciliarPagoRecaudacion() {
    this.xAPI.funcion = "IPOSTEL_U_PagosDeclaracionOPP_SUB"
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.ActualizarPago)
    this.sectionBlockUI.start('Comprobando Pago, por favor Espere!!!');
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.rowsPagosConciliacion.push(this.List_Pagos_Recaudacion)
        if (data.tipo === 1) {
          this.List_Pagos_Recaudacion = []
          this.ListaPagosRecaudacion()
          this.modalService.dismissAll('Close')
          this.sectionBlockUI.stop()
          this.utilService.alertConfirmMini('success', 'Pago Modificado Exitosamente!')
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

  async PagarRecaudacion() {
    // console.log(this.archivos[0].name)
    this.sectionBlockUI.start('Reportando Pago, por favor Espere!!!');
    this.ActualizarPago.archivo_adjunto = this.archivos[0].name ? this.archivos[0].name : null
    var frm = new FormData(document.forms.namedItem("forma"))
    try {
      await this.apiService.EnviarArchivos(frm).subscribe(
        (data) => {
          // console.log(data)
          if (this.ActualizarPago.monto_pagar === this.ActualizarPago.monto_pc) {
            this.updateConciliacion.UpdateCreacionRecaudacionIndividual(this.ActualizarPago)
              .then((resultado) => {
                // Manejar el resolve
                // console.log('Operación exitosa:', resultado);
                this.List_Pagos_Recaudacion = []
                this.modalService.dismissAll('Cerrar Modal')
                // this.LimpiarModal()
                this.utilService.alertConfirmMini('success', 'Pago Reportado Exitosamente')
              })
              .catch((error) => {
                // Manejar el reject
                // console.error('Error en la operación:', error);
                this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal!')
              })
              .finally(() => {
                // Este bloque se ejecutará después de que la promesa se resuelva o se rechace
                // console.log('Procesamiento finalizado');
                this.ListaPagosRecaudacion()
                this.sectionBlockUI.stop()
              })
          } else {
            this.sectionBlockUI.stop();
            this.utilService.alertConfirmMini('warning', 'El Monto Pagado es Diferente al de la Factura Adeudada, por favor verifique e intente nuevamente')
          }
        }
      )
    } catch (error) {
      this.sectionBlockUI.stop();
      this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal, al cargar el PDF')
    }
  }


  async ListaTiposPagos() {
    this.xAPI.funcion = "IPOSTEL_R_MantenimientoSeguridad"
    this.xAPI.parametros = '0'
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.listaTiposPagos.push(e)
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async DescargarFactura(liquidacion: any) {
    // console.log(liquidacion)
    this.sectionBlockUI.start('Generando Planilla de Autoliquidación, por favor Espere!!!');
    switch (liquidacion.tipo_pago_pc) {
      case 1:
        this.xAPI.funcion = "IPOSTEL_R_GenerarPlanillaAutoliquidacion"
        this.xAPI.parametros = `${liquidacion.id_opp}` + ',' + `${liquidacion.id_pc}`
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            let datos = data.Cuerpo.map(e => {
              e.ListaFranqueo = JSON.parse(e.listafranqueo)
              e.ListaFacturas = JSON.parse(e.listafacturas)
              this.sectionBlockUI.stop()
              return e
            });
            this.pdf.GenerarFactura(datos, this.MantenimientoYSeguridad)
            this.sectionBlockUI.stop()
            this.utilService.alertConfirmMini('success', 'Planilla Generada Exitosamente!')
          },
          (error) => {
            this.sectionBlockUI.stop()
            console.log(error)
          }
        )
        break;
      case 5:
        this.xAPI.funcion = "IPOSTEL_R_GenerarPlanillaAutoliquidacion_UsuContratoSubcontratar"
        this.xAPI.parametros = `${liquidacion.id_opp},${liquidacion.id_pc}`
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            let datos = data.Cuerpo.map(e => {
              e.ListaFacturas = JSON.parse(e.listafacturas)
              e.MantenimientoSIRPVEN = JSON.parse(e.ListaFacturas[0].mantenimiento)
              this.MantenimientoYSeguridad = e.MantenimientoSIRPVEN
              this.sectionBlockUI.stop()
              // console.log(e)
              return e
            });
            this.pdf.GenerarPlanillaLiquidacion5(datos, this.MantenimientoYSeguridad)
            this.sectionBlockUI.stop()
            this.utilService.alertConfirmMini('success', 'Planilla Generada Exitosamente!')
          },
          (error) => {
            this.sectionBlockUI.stop()
            console.log(error)
          }
        )
        break;
      default:
        break;
    }
  }

  filterUpdatePagos(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataPagosConciliacion.filter(function (d) {
      return d.observacion_pc.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsPagosConciliacion = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  filterUpdatePagosNoLiquidados(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataPagosConciliacion.filter(function (d) {
      return d.nombre_empresa.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsPagosConciliacion = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }


}

