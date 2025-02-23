import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { UtilService } from '@core/services/util/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jwt_decode from "jwt-decode";
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { IPOSTEL_C_PagosDeclaracionOPP_SUB, IPOSTEL_U_PagosDeclaracionOPP_SUB } from '@core/services/empresa/form-opp.service';
import Swal from 'sweetalert2';
import e from 'cors';
import { GenerarPagoService } from '@core/services/generar-pago.service';


@Component({
  selector: 'app-payments-obligations',
  templateUrl: './payments-obligations.component.html',
  styleUrls: ['./payments-obligations.component.scss']
})
export class PaymentsObligationsComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

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

  public showIncumplimiento = false

  public idOPP


  public MontoTotalAdeudado: string = '0'
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public searchValue = '';

  public TipoRegistro

  public monto: number = 0
  public pPetro: number = 0
  public conversion: number = 0
  public pDolar: number = 0

  public oppsub
  public tipooppsub
  public obligacion
  public incumplimiento
  public observacion

  public yearsList: { year: number }[] = [];
  public anioObligaciones: number

  public DolarPetroDia = []
  public token
  public rowsPagosConciliacion
  public tempDataPagosConciliacion = []
  public List_Pagos_Recaudacion = []

  public ListaOPPSUB = [
    { id: 1, name: 'Operador Postal Privado' },
    { id: 2, name: 'Subcontratista' }
  ]
  public ListaTipoObligacion = []

  public selecOPPSUB = []

  public montoPetroIncumplimiento: number = 0

  public List_incumplimiento

  public resultadoOperacion: string;

  public loadingIndicator = true

  public tasa_petro = ''

  private tempData = [];
  public temp = [];
  public rows

  public datosOriginales: any[];

  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private modalService: NgbModal,
    private generarConciliacion: GenerarPagoService,
  ) { }

  async ngOnInit() {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.idOPP = this.token.Usuario[0].id_user
    this.generateYearsList()
    await this.Precio_Dolar_Petro()
    await this.ListaPagosObligaciones()
    await this.ListaIncumplimiento()
    await this.LstObligaciones()
    this.anioObligaciones = new Date().getFullYear()
  }


  async ListaPagosObligaciones() {
    this.List_Pagos_Recaudacion = []
    this.rowsPagosConciliacion = []
    this.loadingIndicator = true
    this.xAPI.funcion = "IPOSTEL_R_Pagos_Conciliacion_Status"
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.List_Pagos_Recaudacion = []
        data.Cuerpo.map(e => {
          e.MontoPAGAR = e.monto_pagar
          e.MontoPC = e.monto_pc
          e.monto_pagar = this.utilService.ConvertirMoneda(e.monto_pagar)
          e.monto_pc = this.utilService.ConvertirMoneda(e.monto_pc)
          e.fecha = this.utilService.FechaMomentLL(e.fecha_pc)
          e.anioC = new Date(e.fecha_pc)
          e.anio = e.anioC.getFullYear()
          this.List_Pagos_Recaudacion.push(e)
          this.loadingIndicator = false
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
        console.log(error)
      }
    )
  }

  CapturarDolarPetro(valores: any) {
    // console.log(valores)
    this.pPetro = valores.petro
    this.pDolar = valores.dolar
  }

  generateYearsList() {
    const currentYear = new Date().getFullYear();
    for (let year = 2023; year <= currentYear; year++) {
      this.yearsList.push({ year: year });
    }
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


  // FiltarObligacionAnio(event: any) {
  //   let objetosFiltrados = this.rowsPagosConciliacion.filter(objeto => objeto.anio === event.year);
  //   const val = event.year;
  //   this.rowsPagosConciliacion = objetosFiltrados;
  //   this.table.offset = 0;
  // }

  FiltarObligacionAnio(event: any) {
    this.rowsPagosConciliacion = [...this.datosOriginales]; // Restaurar los datos originales
    this.rowsPagosConciliacion = this.rowsPagosConciliacion.filter(objeto => objeto.anio === event.year); // Aplicar el filtro
    this.table.offset = 0;
  }


  ModalMultasObligaciones(modal) {
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }


  ModalMultasColectivas(modal) {
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }



  async ListaIncumplimiento() {
    this.xAPI.funcion = "IPOSTEL_R_Tasa_Incumplimiento";
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.List_incumplimiento = data.Cuerpo.map(e => {
          e.name = `(${e.monto} Petros) ${e.descripcion_tasa_incumplimiento}`
          e.id = e.id_tasa_incumplimiento
          return e
        });
        // console.log(this.List_incumplimiento)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaOppSub(id: any) {
    if (id != null) {
      this.xAPI.funcion = "IPOSTEL_R_OPP_SUB";
      this.xAPI.parametros = `${id}`
      this.xAPI.valores = ''
      await this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          this.selecOPPSUB = data.Cuerpo.map(e => {
            e.id = e.id_opp
            this.TipoRegistro = e.tipo_registro
            e.name = e.rif + ' - ' + e.nombre_empresa.toUpperCase()
            // console.log(e)
            return e
          });
        },
        (err) => {
          console.log(err)
        }
      )
    } else {
      this.selecOPPSUB = []
    }
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

  CapturarIncumplimiento(event: any) {
    // console.log(event)
    this.observacion = event.descripcion_tasa_incumplimiento
    this.montoPetroIncumplimiento = event.monto
    this.monto = this.pPetro * this.montoPetroIncumplimiento
    this.conversion = this.monto * this.pDolar
    // this.IpagarRecaudacion.monto_pagar = this.conversion.toString()
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
          this.LimpiarModal()
          this.modalService.dismissAll('Cerrar Modal')
        }
        break;
      case 6: // Reparos
        // this.monto = this.pPetro * this.montoPetroIncumplimiento
        // this.conversion = this.monto * this.pDolar
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
      default:
        break;
    }

    // console.log(this.monto, this.conversion, this.pPetro, this.pDolar)

    if (obligacion.id == 6) {
      this.showIncumplimiento = true
    } else {
      this.showIncumplimiento = false
    }
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

  async ProcesarOblicacion() {
    this.IpagarRecaudacion.id_opp = this.oppsub
    this.IpagarRecaudacion.status_pc = 4
    this.IpagarRecaudacion.tipo_pago_pc = this.obligacion.id
    this.IpagarRecaudacion.monto_pc = '0'
    this.IpagarRecaudacion.dolar_dia = this.pDolar.toString()
    this.IpagarRecaudacion.petro_dia = this.pPetro.toString()
    this.IpagarRecaudacion.observacion_pc = this.observacion
    this.IpagarRecaudacion.fecha_pc = this.utilService.FechaActual()
    this.IpagarRecaudacion.user_created = this.idOPP
    this.sectionBlockUI.start('Generando Recibo, Por favor Espere!!!');
    await this.generarConciliacion.GuardarCreacionRecaudacionIndividual(this.IpagarRecaudacion)
      .then((resultado) => {
        this.List_Pagos_Recaudacion = []
        this.modalService.dismissAll('Cerrar Modal')
        this.LimpiarModal()
        this.utilService.alertConfirmMini('success', 'Recibo Guardado Exitosamente')
      })
      .catch((error) => {
        this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal!')
      })
      .finally(() => {
        this.ListaPagosObligaciones()
        this.sectionBlockUI.stop()
      });
  }

  async ProcesarOblicacionColectivas() {
    let array = this.selecOPPSUB
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      this.IpagarRecaudacion.id_opp = element.id_opp
      this.IpagarRecaudacion.status_pc = 4
      this.IpagarRecaudacion.tipo_pago_pc = this.obligacion.id
      this.IpagarRecaudacion.monto_pc = '0'
      this.IpagarRecaudacion.dolar_dia = this.pDolar.toString()
      this.IpagarRecaudacion.petro_dia = this.pPetro.toString()
      this.IpagarRecaudacion.observacion_pc = this.observacion
      this.IpagarRecaudacion.fecha_pc = this.utilService.FechaActual()
      this.IpagarRecaudacion.user_created = this.idOPP
      await this.ProcesarObligacionesColectiva(this.IpagarRecaudacion)
    }
  }

  ProcesarObligacionesColectiva(obligacionColectiva: any) {
    this.sectionBlockUI.start('Generando Recibo, Por favor Espere!!!');
    this.generarConciliacion.GuardarCreacionRecaudacionIndividual(obligacionColectiva)
      .then((resultado) => {
        // Manejar el resolve
        // console.log('Operación exitosa:', resultado);
        this.List_Pagos_Recaudacion = []
        this.modalService.dismissAll('Cerrar Modal')
        this.LimpiarModal()
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
        this.ListaPagosObligaciones()
        this.sectionBlockUI.stop()
      });
  }



  LimpiarModal() {
    this.oppsub = undefined
    this.tipooppsub = undefined
    this.obligacion = undefined
    this.observacion = ''
    this.incumplimiento = undefined
  }


  async EliminarPagoConciliacion(data: any) {
    await Swal.fire({
      title: "Esta Seguro?",
      text: "Desea eliminar este registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.sectionBlockUI.start('Eliminando Registro, Por favor Espere!!!');
        this.generarConciliacion.EliminarCreacionRecaudacion(data.id_pc)
          .then((resultado) => {
            // Manejar el resolve
            // console.log('Operación exitosa:', resultado);
            this.List_Pagos_Recaudacion = []
            this.modalService.dismissAll('Cerrar Modal')
            this.utilService.alertConfirmMini('success', 'Registro Eliminado Exitosamente')
          })
          .catch((error) => {
            // Manejar el reject
            // console.error('Error en la operación:', error);
            this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal!')
          })
          .finally(() => {
            // Este bloque se ejecutará después de que la promesa se resuelva o se rechace
            // console.log('Procesamiento finalizado');
            this.ListaPagosObligaciones()
            this.sectionBlockUI.stop()
          });
      }
    });

  }

}

