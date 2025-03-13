import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { IPOSTEL_C_PagosDeclaracionOPP_SUB, IPOSTEL_DATA_EMPRESA_ID, IPOSTEL_I_Pagos_Mantenimiento, IPOSTEL_U_PagosDeclaracionOPP_SUB, IPOSTEL_U_Status_Opp_Sub } from '@core/services/empresa/form-opp.service';
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
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {

@ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;

  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  @ViewChild('fileUpload1')
  private fileUpload1: AngularFileUploaderComponent

  public UReportarPago: IPOSTEL_I_Pagos_Mantenimiento = {
    status: 4,
    tipo_pago: 10,
    fecha: '',
    id_banco: undefined,
    referencia_bancaria: '',
    monto_pagar: undefined,
    monto_pagado: undefined,
    dolar_dia: undefined,
    archivo_adjunto: undefined,
    observacion: '',
    user_created: undefined,
    user_updated: undefined,
    date_updated: undefined,
    id_opp: 0
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
    this.token = jwt_decode(sessionStorage.getItem('token'));

    this.tipoToken = this.token.Usuario[0].tipo_registro

    if (this.tipoToken == 1) {
      this.ShowTabla = true
    } else {
      this.ShowTabla = false
    }

    this.idOPP = this.token.Usuario[0].id_opp
    this.TipoRegistro = this.token.Usuario[0].tipo_registro

    await this.Precio_Dolar_Petro()
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


  fileSelected(e) {
    this.archivos.push(e.target.files[0])
  }

  subirArchivo(e) {
    this.sectionBlockUI.start('Subiendo Archivo, por favor Espere!!!');
    this.token = jwt_decode(sessionStorage.getItem('token'));
    var frm = new FormData(document.forms.namedItem("forma"))
    try {
      this.apiService.EnviarArchivos(frm).subscribe(
        (data) => {
          this.xAPI.funcion = 'IPOSTEL_I_ArchivoDigital'
          this.xAPI.parametros = ''
          this.apiService.Ejecutar(this.xAPI).subscribe(
            (xdata) => {
              if (xdata.tipo == 1) {
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
    this.xAPI.funcion = "IPOSTEL_R_PagosMantenimientoAPP"
    this.xAPI.parametros = this.idOPP.toString()
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.Cuerpo.length > 0) {
          data.Cuerpo.map(e => {
            let fecha = new Date(e.fecha);
            e.anio = fecha.getFullYear();
            e.fechax = this.utilService.FechaMomentLL(e.fecha)
            e.montopagar = this.utilService.ConvertirMoneda(e.monto_pagar)
            e.montopagado = this.utilService.ConvertirMoneda(e.monto_pagado)
            this.List_Pagos_Recaudacion.push(e)

          });
          this.rowsPagosConciliacion = this.List_Pagos_Recaudacion
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
      this.rowsPagosConciliacion = this.rowsPagosConciliacion.filter(objeto => objeto.status === event.id); // Aplicar el filtro
      this.table.offset = 0;
    }
  }


  getCurrentTime(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(6, '0'); // Asegurar 6 dígitos

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  async ModalPagar(modal, data) {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.numControl = this.token.Usuario[0].rif
    this.hashcontrol = btoa("D" + this.numControl) //Cifrar documentos

    this.title_modal = 'Reportar Pago'
    this.ShowReportarPago = true
    this.ShowModificarPago = false
    this.monto_pagarX = data.montopagar
    this.UReportarPago.status = 0
    this.UReportarPago.observacion = data.observacion
    this.UReportarPago.monto_pagar = data.monto_pagar
    this.UReportarPago.monto_pagado = data.monto_pagar
    this.UReportarPago.fecha = data.fecha
    this.UReportarPago.dolar_dia = data.dolar_dia
    this.UReportarPago.user_created = data.user_created
    this.UReportarPago.user_updated = this.idOPP
    this.UReportarPago.id_opp = this.idOPP
    this.UReportarPago.date_updated = this.getCurrentTime()
    this.UReportarPago.id = data.id
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async ModalPagarModificar(modal, data) {
    console.log(data)
    this.title_modal = 'Modificar de Pago'
    this.ShowReportarPago = false
    this.ShowModificarPago = true
    this.monto_pagarX = data.monto_pagar
    this.UReportarPago.status = 0
    this.UReportarPago.observacion = data.observacion
    this.UReportarPago.monto_pagar = data.monto_pagar
    this.UReportarPago.monto_pagado = data.monto_pagado
    this.UReportarPago.referencia_bancaria = data.referencia_bancaria
    this.UReportarPago.id_banco = data.id_banco
    this.UReportarPago.fecha = data.fecha
    this.UReportarPago.dolar_dia = data.dolar_dia
    this.UReportarPago.user_created = data.user_created
    this.UReportarPago.user_updated = this.idOPP
    this.UReportarPago.id_opp = this.idOPP
    this.UReportarPago.date_updated = this.getCurrentTime()
    this.UReportarPago.id = data.id
    this.UReportarPago.archivo_adjunto = data.archivo_adjunto ? data.archivo_adjunto : this.archivos[0].name
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


  async PagarRecaudacion() {
    this.UReportarPago.archivo_adjunto = this.archivos[0].name ? this.archivos[0].name : undefined
    var frm = new FormData(document.forms.namedItem("forma"))
    if (this.UReportarPago.archivo_adjunto == undefined) {
      this.utilService.alertConfirmMini('warning', 'Lo sentimos, debe subir el archivo de la transacción')
      this.sectionBlockUI.stop()
    } 
    this.sectionBlockUI.start('Reportando Pago, por favor Espere!!!');
    try {
      await this.apiService.EnviarArchivos(frm).subscribe(
        (data) => {
          // console.log(data)
          if (this.UReportarPago.monto_pagar === this.UReportarPago.monto_pagado) {
            this.updateConciliacion.PagarFacturaMantenimiento(this.UReportarPago)
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
    this.sectionBlockUI.start('Generando Planilla de Autoliquidación, por favor Espere!!!');
    this.xAPI.funcion = "IPOSTEL_R_GenerarPlanillaMantenimiento"
        this.xAPI.parametros = `${liquidacion.id_opp}`
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            let datos = data.Cuerpo.map(e => {
              this.sectionBlockUI.stop()
              return e
            });
            this.pdf.GenerarFacturaMantenimiento(datos,liquidacion)
            this.sectionBlockUI.stop()
            this.utilService.alertConfirmMini('success', 'Planilla Generada Exitosamente!')
          },
          (error) => {
            this.sectionBlockUI.stop()
            console.log(error)
          }
        )
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

