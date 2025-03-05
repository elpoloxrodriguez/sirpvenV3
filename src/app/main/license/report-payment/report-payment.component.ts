import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { IPOSTEL_C_PagosDeclaracionOPP_SUB, IPOSTEL_I_Pagos_Mantenimiento, IPOSTEL_I_Pagos_Mantenimiento_Conciliar, IPOSTEL_U_Pagos_Mantenimiento, IPOSTEL_U_PagosDeclaracionOPP_SUB } from '@core/services/empresa/form-opp.service';
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
  selector: 'app-report-payment',
  templateUrl: './report-payment.component.html',
  styleUrls: ['./report-payment.component.scss']
})
export class ReportPaymentComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;

  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  @ViewChild('fileUpload1')
  private fileUpload1: AngularFileUploaderComponent


    public UReportarPago: IPOSTEL_I_Pagos_Mantenimiento = {
      status: undefined,
      tipo_pago: undefined,
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

    public UConciliar: IPOSTEL_I_Pagos_Mantenimiento_Conciliar = {
      status: undefined,
      observacion: '',
      id_opp: 0
    }

  public chkBoxSelected = [];

  public totalDolitar
  public totalBolivares

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

  public diaDolar

  public title_modal
  public ShowReportarPago = false
  public ShowModificarPago = false
  public monto_pagarX
  public monto_pagar_muestra

  public ShowMontoCero

  public SelectionType = SelectionType;

  public MantenimientoYSeguridad = []

  public SelectStatusConciliacion = [
    { id: 0, name: 'En Revisión' },
    { id: 1, name: 'No Liquidado' },
    { id: 2, name: 'Pago Aprobado' },
    { id: 3, name: 'Pago Rechazado' },
    { id: 4, name: 'Pago Pendiente' }
  ]

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

  public dolarPago

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
    { id: 1, name: 'PAGOS NO CONCILIADOS' },
    { id: 2, name: 'PAGOS APROBADOS' },
    { id: 3, name: 'PAGOS RECHAZADOS' },
    { id: 4, name: 'PAGOS PENDIENTES' },
  ]

  public nombreOPP // nombre de la empresa en genero el recibo de pago
  public rifOPP // rif de la empresa en genero el recibo de pago
  public Mpagar
  public Mpc
  public FechaPago



  public currentYear = new Date().getFullYear()
  public resultadoFactura

  public anioObligaciones = undefined
  public tipoPago = undefined
  public tipoCategoriaPago = undefined
  public statusPC = undefined

  public tipoToken

  public ListaTipoObligacion = []


  public cuanto

  public ShowTabla: boolean = true

  public dataObligacionOPP = []

  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private modalService: NgbModal,
    private router: Router,
    private cdr: ChangeDetectorRef,
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

    this.generateYearsList()
    await this.ListaPagosRecaudacion()
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
    this.xAPI.funcion = "IPOSTEL_R_Pagos_Mantenimiento"
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.Cuerpo.length > 0) {
          // console.log(data.Cuerpo)
          data.Cuerpo.map(e => {
            e.status = parseInt(e.status)
            let fecha = new Date(e.fecha);
            e.anio = fecha.getFullYear();
            e.fechax = this.utilService.FechaMomentLL(e.fecha ? e.fecha : e.date_created)
            e.montoReal = e.monto_pagar
            this.MontoRealPagar = e.monto_pagar
            e.monto_pagado = this.utilService.ConvertirMoneda(e.monto_pagado ? e.monto_pagado : 0)
            e.monto_pagar = this.utilService.ConvertirMoneda(e.monto_pagar?e.monto_pagar: 0)
            this.List_Pagos_Recaudacion.push(e)
          });
          console.log(this.List_Pagos_Recaudacion)
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

  dwUrl(ncontrol: string, archivo: string): string {
    // console.log(ncontrol,archivo);
    return this.apiService.Dws(btoa("D" + ncontrol) + '/' + archivo)
  }

  ConciliarPagoOPP(modal, data) {
    // console.log(data)
    this.nombreOPP = data.nombre_empresa
    this.rifOPP = data.rif
    this.title_modal = data.nombre_empresa
    this.FechaPago = this.utilService.FechaMomentLL(data.fecha)
    this.UReportarPago.status = data.status
    this.UReportarPago.fecha = data.fecha
    this.UReportarPago.archivo_adjunto =
    this.UReportarPago.id_banco = data.banco_nombre
    this.UReportarPago.referencia_bancaria = data.referencia_bancaria ? data.referencia_bancaria : 'Reporto en Cero (0.00)'
    this.UReportarPago.monto_pagado = data.monto_pagado
    this.UReportarPago.monto_pagar = data.monto_pagar
    this.UReportarPago.dolar_dia = data.dolar_dia
    this.UReportarPago.archivo_adjunto = data.archivo_adjunto
    this.UReportarPago.observacion = data.observacion
    this.UReportarPago.user_created = data.id_opp
    this.UReportarPago.user_updated = data.id_opp
    this.UReportarPago.id = data.id
    this.UReportarPago.id_opp = data.id_opp

    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }


  FiltarObligacionAnio(event: any) {
    if (event != undefined) {
      this.rowsPagosConciliacion = [...this.datosOriginales]; // Restaurar los datos originales
      this.rowsPagosConciliacion = this.rowsPagosConciliacion.filter(objeto => objeto.anio === event.year); // Aplicar el filtro
      this.table.offset = 0;
    }
  }

  FiltarObligacionCategoriaPago(event: any) {
    // console.log(event)
    if (event != undefined) {
      this.rowsPagosConciliacion = [...this.datosOriginales]; // Restaurar los datos originales
      this.rowsPagosConciliacion = this.rowsPagosConciliacion.filter(objeto => objeto.status === event.id); // Aplicar el filtro
      this.table.offset = 0;
    }
  }


  cerrarModal() {
    this.List_Pagos_Recaudacion = []
    this.rowsPagosConciliacion = []

    this.rowsPagosConciliacion = this.datosOriginales

    // this.ListaPagosRecaudacion()

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
              e.MantenimientoSIRPVEN = JSON.parse(e.ListaFacturas[0].mantenimiento)
              this.MantenimientoYSeguridad = e.MantenimientoSIRPVEN
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


  async PagarRecaudacion() {
    this.UConciliar.id_opp = this.UReportarPago.id_opp
    this.UConciliar.status = this.UReportarPago.status
    this.UConciliar.observacion = this.UReportarPago.observacion
    this.UConciliar.id = this.UReportarPago.id
    this.UConciliar.date_updated = this.getCurrentTime()

    console.log(this.UConciliar)
    this.sectionBlockUI.start('Conciliando pago, por favor Espere!!!');
    try {
          // console.log(data)
            await this.updateConciliacion.ConciliarFacturaMantenimiento(this.UConciliar)
              .then((resultado) => {
                // Manejar el resolve
                // console.log('Operación exitosa:', resultado);
                this.List_Pagos_Recaudacion = []
                this.modalService.dismissAll('Cerrar Modal')
                // this.LimpiarModal()
                this.utilService.alertConfirmMini('success', 'Conciliación Exitosamente')
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
    } catch (error) {
      this.sectionBlockUI.stop();
      this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal, al cargar el PDF')
    }
  }


}


