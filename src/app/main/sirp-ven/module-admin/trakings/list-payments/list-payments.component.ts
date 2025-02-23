import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { UtilService } from '@core/services/util/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jwt_decode from "jwt-decode";
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormBuilder } from '@angular/forms';
import { IPOSTEL_U_PagosDeclaracionOPP_SUB } from '@core/services/empresa/form-opp.service';
import { PdfService } from '@core/services/pdf/pdf.service';
import { GenerarPagoService } from '@core/services/generar-pago.service';

@Component({
  selector: 'app-list-payments',
  templateUrl: './list-payments.component.html',
  styleUrls: ['./list-payments.component.scss']
})
export class ListPaymentsComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public ActualizarPago: IPOSTEL_U_PagosDeclaracionOPP_SUB = {
    status_pc: undefined,
    fecha_pc: '',
    id_banco_pc: undefined,
    referencia_bancaria: '',
    monto_pc: '',
    monto_pagar: '',
    dolar_dia: '',
    petro_dia: '',
    archivo_adjunto: undefined,
    observacion_pc: '',
    user_created: undefined,
    user_updated: undefined,
    id_pc: 0
  }

  public idOPP
  public SelectBancos = []
  public SelectStatusConciliacion = [
    { id: '0', name: 'En Revisión' },
    { id: "1", name: 'No Liquidado' },
    { id: '2', name: 'Pago Aprobado' },
    { id: '3', name: 'Pago Rechazado' }
  ]

  public MontoTotalAdeudado: string = '0'
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public searchValue = '';

  public loadingIndicator: boolean = true;


  public token
  public n_opp = 0
  public rowsPagosConciliacion
  public tempDataPagosConciliacion = []
  public List_Pagos_Recaudacion = []
  public TipoRegistro

  public title_modal
  public Mpagar
  public Mpc
  public NombreBancoEmisor = ''
  public FechaPago

  public nombreOPP // nombre de la empresa en genero el recibo de pago
  public rifOPP // rif de la empresa en genero el recibo de pago

  public MantenimientoYSeguridad

  public yearsList: { year: number }[] = [];
  public anioObligaciones = new Date().getFullYear()
  public datosOriginales: any[];

  public tipoPago = undefined
  public tipoCategoriaPago = undefined


  public SelectCategoriaPagos = [
    { id: 0, name: 'PAGOS EN REVISIÓN' },
    { id: 4, name: 'PAGOS PENDIENTES' },
    { id: 2, name: 'PAGOS APROBADOS' },
    { id: 3, name: 'PAGOS RECHAZADOS' },
    { id: 1, name: 'PAGOS NO CONCILIADOS' }
  ]

  public SelectTipoPagos = [
    { id: 1, name: 'Franqueo Postal Obligatorio' },
    { id: 2, name: 'Derecho Semestral 1' },
    { id: 3, name: 'Derecho Semestral 2' },
    { id: 4, name: 'Anualidad' },
    { id: 5, name: 'Uso Contrato Subcontratista' },
    { id: 6, name: 'Reparos' },
    { id: 9, name: 'Renovación' }
  ]

  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private modalService: NgbModal,
    private router: Router,
    private _formBuilder: FormBuilder,
    private pdf: PdfService,
    private updateConciliacion: GenerarPagoService,
  ) { }

  async ngOnInit() {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.idOPP = this.token.Usuario[0].id_opp
    this.generateYearsList()
    await this.ListaBancosVzla()
    await this.ListaPagosRecaudacion(0)
  }

  async CapturarNav(event) {
    switch (event.target.id) {
      case 'ngb-nav-0':
        this.List_Pagos_Recaudacion = []
        this.rowsPagosConciliacion = []
        // this.n_opp = 0
        await this.ListaPagosRecaudacion(0)
        break;
      case 'ngb-nav-1':
        this.List_Pagos_Recaudacion = []
        this.rowsPagosConciliacion = []
        // this.n_opp = 1
        await this.ListaPagosRecaudacion(1)
        break;
      case 'ngb-nav-2':
        this.List_Pagos_Recaudacion = []
        this.rowsPagosConciliacion = []
        // this.n_opp = 3
        await this.ListaPagosRecaudacion(3)
        break;
      case 'ngb-nav-3':
        this.List_Pagos_Recaudacion = []
        this.rowsPagosConciliacion = []
        // this.n_opp = 2
        await this.ListaPagosRecaudacion(2)
        break;
      default:
        break;
    }
  }

  async ListaPagosRecaudacion(n_opp: any) {
    this.List_Pagos_Recaudacion = []
    this.rowsPagosConciliacion = []
    this.MontoTotalAdeudado = '0'
    this.loadingIndicator = true;
    this.xAPI.funcion = "IPOSTEL_R_Pagos_Conciliacion"
    this.xAPI.parametros = n_opp.toString()
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          e.anioC = new Date(e.fecha_pc)
          e.anio = e.anioC.getFullYear()
          e.MontoPAGAR = e.monto_pagar
          e.MontoPC = e.monto_pc
          e.monto_pagar = this.utilService.ConvertirMoneda(e.monto_pagar)
          e.monto_pc = this.utilService.ConvertirMoneda(e.monto_pc)
          e.fecha = e.fecha_pc ? this.utilService.FechaMomentLL(e.fecha_pc) : ''
          this.List_Pagos_Recaudacion.push(e)
          this.loadingIndicator = false;
        });
        // console.log(this.List_Pagos_Recaudacion)
        this.rowsPagosConciliacion = this.List_Pagos_Recaudacion;
        this.tempDataPagosConciliacion = this.rowsPagosConciliacion
        let MontoTotalA = this.List_Pagos_Recaudacion.map(item => item.MontoPC).reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
        this.MontoTotalAdeudado = this.utilService.ConvertirMoneda(MontoTotalA)

        this.datosOriginales = [...this.rowsPagosConciliacion]; // Hacer una copia de respaldo al inicializar el componente
        this.rowsPagosConciliacion = [...this.datosOriginales]; // Restaurar los datos originales
        this.rowsPagosConciliacion = this.rowsPagosConciliacion.filter(objeto => objeto.anio === this.anioObligaciones); // Aplicar el filtro
        this.table.offset = 0;
      },
      (error) => {
        this.loadingIndicator = false;
        console.log(error)
      }
    )
  }

  FiltarObligacionAnio(event: any) {
    this.rowsPagosConciliacion = [...this.datosOriginales]; // Restaurar los datos originales
    this.rowsPagosConciliacion = this.rowsPagosConciliacion.filter(objeto => objeto.anio === event.year); // Aplicar el filtro
    this.table.offset = 0;
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


  filterUpdatePagos(event) {
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

  generateYearsList() {
    const currentYear = new Date().getFullYear();
    for (let year = 2023; year <= currentYear; year++) {
      this.yearsList.push({ year: year });
    }
  }


  dwUrl(ncontrol: string, archivo: string): string {
    // console.log(ncontrol,archivo);
    return this.apiService.Dws(btoa("D" + ncontrol) + '/' + archivo)
  }

  async DescargarFactura(data: any) {
    // console.log(data)
    this.sectionBlockUI.start('Generando Factura, por favor Espere!!!');
    this.xAPI.funcion = "IPOSTEL_R_GenerarPlanillaAutoliquidacion"
    this.xAPI.parametros = data.id_opp + ',' + data.id_pc
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        let datos = data.Cuerpo.map(e => {
          e.ListaFranqueo = JSON.parse(e.listafranqueo)
          e.ListaFacturas = JSON.parse(e.listafacturas)
          this.MantenimientoYSeguridad = JSON.parse(e.ListaFacturas[0].mantenimiento)
          this.sectionBlockUI.stop()
          this.utilService.alertConfirmMini('success', 'Factura Generada Exitosamente!')
          return e
        });
        // console.log(this.MantenimientoYSeguridad)
        this.pdf.GenerarFactura(datos, this.MantenimientoYSeguridad)
      },
      (error) => {
        console.log(error)
      }
    )

  }


  ConciliarPago(modal, data) {
    // console.log(data)
    this.nombreOPP = data.nombre_empresa_opp
    this.rifOPP = data.rif_empresa_opp
    this.title_modal = data.nombre_empresa
    var banco = '(' + data.bzCodigo + ') ' + data.bzNombre
    this.NombreBancoEmisor = banco ? banco : 'Reporto en Cero (0.00)'
    this.FechaPago = this.utilService.FechaMomentLL(data.fecha_pc)
    this.ActualizarPago.status_pc = data.status_pc.toString()
    this.ActualizarPago.fecha_pc = data.fecha_pc
    this.ActualizarPago.archivo_adjunto =
      this.ActualizarPago.id_banco_pc = data.id_banco_pc
    this.ActualizarPago.referencia_bancaria = data.referencia_bancaria ? data.referencia_bancaria : 'Reporto en Cero (0.00)'
    this.ActualizarPago.monto_pc = data.MontoPC
    this.ActualizarPago.monto_pagar = data.MontoPAGAR
    this.ActualizarPago.dolar_dia = data.dolar_dia
    this.ActualizarPago.petro_dia = data.petro_dia
    this.ActualizarPago.archivo_adjunto = data.archivo_adjunto
    this.ActualizarPago.observacion_pc = data.observacion_pc
    this.ActualizarPago.user_created = data.id_opp
    this.ActualizarPago.user_updated = data.id_opp
    this.ActualizarPago.id_pc = data.id_pc
    this.Mpagar = this.utilService.ConvertirMoneda(data.MontoPAGAR)
    this.Mpc = this.utilService.ConvertirMoneda(data.MontoPC)

    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }



  async ConciliarPagoRecaudacion() {
    this.sectionBlockUI.start('Comprobando Pago, por favor Espere!!!');
    await this.updateConciliacion.UpdateCreacionRecaudacionIndividual(this.ActualizarPago)
      .then((resultado) => {
        // Manejar el resolve
        // console.log('Operación exitosa:', resultado);
        this.List_Pagos_Recaudacion = []
        this.modalService.dismissAll('Cerrar Modal')
        // this.LimpiarModal()
        this.utilService.alertConfirmMini('success', 'Pago Comprobado Exitosamente')
      })
      .catch((error) => {
        // Manejar el reject
        // console.error('Error en la operación:', error);
        this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal!')
      })
      .finally(() => {
        // Este bloque se ejecutará después de que la promesa se resuelva o se rechace
        // console.log('Procesamiento finalizado');
        this.List_Pagos_Recaudacion = []
        this.rowsPagosConciliacion = []
        this.MontoTotalAdeudado = '0'
        this.ListaPagosRecaudacion(0)
        this.sectionBlockUI.stop()
      })
  }

}

