import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { UtilService } from '@core/services/util/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jwt_decode from "jwt-decode";
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';


@Component({
  selector: 'app-postage-per-month',
  templateUrl: './postage-per-month.component.html',
  styleUrls: ['./postage-per-month.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PostagePerMonthComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public fecha = new Date();
  public mes = this.fecha.getMonth() + 1;
  public anio = this.fecha.getFullYear();

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public searchValue = '';

  /*
  este es el nuevo metodo
  */
  // Obtener la fecha actual
  public fechaActual = new Date();


  public mesEncode64
  public mesDecode64

  public contentHeader: object;
  public copyCodeStatus: boolean = false;
  public searchText;
  public Xdata = []


  public rowsDeclaracionPiezas = []
  public DeclaracionPiezas = []


  public BtnPago: boolean = false


  public nuevafechaActual = new Date().getFullYear()

  public meses = []

  public anios: number[] = [];

  public idOpp

  public token

  public mesAnterior
  public anioAnterior

  public color = ''

  public MontoCausadoX
  public selected: number = 0
  public TotalPiezas: number = 0
  public MontoPetroTotalSumaServicio: number = 0

  public selectedYear: number;
  public formattedDate
  // Private

  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  async ngOnInit() {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.idOpp = this.token.Usuario[0].id_opp
    this.generarListaAños();

    this.fechaActual.setMonth(this.fechaActual.getMonth() -1 );
    this.mesAnterior = this.fechaActual.getMonth(); 
    this.anioAnterior = this.fechaActual.getFullYear()

    await this.ConsultarDeclaracion(this.idOpp, this.anioAnterior,this.mesAnterior)
  }

  generarListaAños() {
    const añoActual = new Date().getFullYear();
    for (let año = 2023; año <= añoActual; año++) {
      this.anios.push(año);
    }
  }

  async validar(event: any) {
    if (event != null) {
      if (event != this.anioAnterior) {
        await this.ConsultarDeclaracion(this.idOpp, event, 11)
      } else {
        await this.ConsultarDeclaracion(this.idOpp, event,this.mesAnterior)
      }
    }

  }

  async ConsultarDeclaracion(id: any, anio:any, mes:any) {
    this.Xdata = []
    this.meses = []
    this.sectionBlockUI.start('Cargando datos, por favor Espere!!!');
    this.xAPI.funcion = "IPOSTEL_R_MovimientosPiezasMeses"
    this.xAPI.parametros = `${id}`
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.mesEncode64 = btoa(anio+ '-' + mes)
        this.mesDecode64 = anio+ '-' + mes
        this.meses = [
          { name: "ENERO", fecha: anio, btn: this.BtnPago, mesx: 0, value: anio+ '-' + '01', mes: btoa(anio+ '-' + '01') },
          { name: "FEBRERO", fecha: anio, btn: this.BtnPago, mesx: 1, value: anio+ '-' + '02', mes: btoa(anio+ '-' + '02') },
          { name: "MARZO", fecha: anio, btn: this.BtnPago, mesx: 2, value: anio+ '-' + '03', mes: btoa(anio+ '-' + '03') },
          { name: "ABRIL", fecha: anio, btn: this.BtnPago, mesx: 3, value: anio+ '-' + '04', mes: btoa(anio+ '-' + '04') },
          { name: "MAYO", fecha: anio, btn: this.BtnPago, mesx: 4, value: anio+ '-' + '05', mes: btoa(anio+ '-' + '05') },
          { name: "JUNIO", fecha: anio, btn: this.BtnPago, mesx: 5, value: anio+ '-' + '06', mes: btoa(anio+ '-' + '06') },
          { name: "JULIO", fecha: anio, btn: this.BtnPago, mesx: 6, value: anio+ '-' + '07', mes: btoa(anio+ '-' + '07') },
          { name: "AGOSTO", fecha: anio, btn: this.BtnPago, mesx: 7, value: anio+ '-' + '08', mes: btoa(anio+ '-' + '08') },
          { name: "SEPTIEMBRE", fecha: anio, btn: this.BtnPago, mesx: 8, value: anio+ '-' + '09', mes: btoa(anio+ '-' + '09') },
          { name: "OCTUBRE", fecha: anio, btn: this.BtnPago, mesx: 9, value: anio+ '-' + '10', mes: btoa(anio+ '-' + '10') },
          { name: "NOVIEMBRE", fecha: anio, btn: this.BtnPago, mesx: 10, value: anio+ '-' + '11', mes: btoa(anio+ '-' + '11') },
          { name: "DICIEMBRE", fecha: anio, btn: this.BtnPago, mesx: 11, value: anio+ '-' + '12', mes: btoa(anio+ '-' + '12') }
        ]

        for (let i = 0; i <= mes; i++) {
          this.Xdata.push(this.meses[i])
        }
        this.meses.map(e => {
          e.monto = 0
          e.montox = 0
          e.piezas = 0
          if (e.mesx == mes) {
            e.btn = true
          } else {
            e.btn = false
          }
          data.Cuerpo.map(ex => {
            if (ex.mes == e.value) {
              e.monto = this.utilService.ConvertirMoneda(ex.total_monto_causado)
              e.montox = parseFloat(ex.total_monto_causado)
              e.piezas = ex.total_piezas
            }
            return e
          });
        });
        this.sectionBlockUI.stop()
      },
      (error) => {
        console.log(error)
      })
  }

  rutaDeclarar(mes: any) {
    this.router.navigate([`/postage/movement-of-parts/${mes}`]);
  }


  async rutaVisualizar(modal: any, mes: any) {
    await this.consultarMovilizacion(mes)
    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  transform(fecha: string): string {
    const partesFecha = fecha.split('-');
    const year = parseInt(partesFecha[0], 10);
    const month = parseInt(partesFecha[1], 10) - 1; // Restar 1 porque en JavaScript los meses van de 0 a 11
    const date = new Date(year, month, 1);
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[date.getMonth()];
  }

  async consultarMovilizacion(mes: any) {
    this.DeclaracionPiezas = []
    this.rowsDeclaracionPiezas = []
    this.xAPI.funcion = "IPOSTEL_R_MovilizacionPiezas_visualizar"
    this.xAPI.parametros = this.idOpp + ',' + mes
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          e.mes = this.transform(e.mes)
          e.montox = parseFloat(e.monto_causado)
          e.tarifa_servicio = this.utilService.ConvertirMoneda(e.tarifa_servicio);
          e.monto_fpo = this.utilService.ConvertirMoneda(e.monto_fpo);
          e.monto_causado = this.utilService.ConvertirMoneda(e.monto_causado);
          this.DeclaracionPiezas.push(e)
        });
        this.rowsDeclaracionPiezas = this.DeclaracionPiezas;
        let piezas = this.DeclaracionPiezas.map(item => item.cantidad_piezas ? item.cantidad_piezas : 0).reduce((prev, curr) => prev + curr, 0);
        this.TotalPiezas = piezas.toLocaleString()
        this.selected = this.DeclaracionPiezas.length
        let montopiezas = this.DeclaracionPiezas.map(item => item.montox ? item.montox : 0).reduce((prev, curr) => prev + curr, 0);
        this.MontoCausadoX = this.utilService.ConvertirMoneda(montopiezas);
      },
      (error) => {
        console.log(error)
      }
    )

  }


}


