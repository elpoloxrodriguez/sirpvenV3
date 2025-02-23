import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { colors } from 'app/colors.const';
import { UtilService } from '@core/services/util/util.service';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-reports-ranking',
  templateUrl: './reports-ranking.component.html',
  styleUrls: ['./reports-ranking.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportsRankingComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };



  public CantidadAnterior = []
  public CantidadActual = []


  public DatosCompletos = {
    data1: [],
    data2: [],
    minV: 0,
    maxV: 0
  }


  public valoresData1 = []
  public valoresData2 = []

  // public
  public radioModel = 1;

  // Color Variables
  private tooltipShadow = 'rgba(0, 0, 0, 0.25)';
  private lineChartPrimary = '#666ee8';
  private lineChartDanger = '#ff4961';
  private labelColor = '#6e6b7b';
  private grid_line_color = 'rgba(200, 200, 200, 0.2)'; // RGBA color helps in dark layout

  public añoActual = new Date()
  public año = this.añoActual.getFullYear()
  public añoAc = this.año
  public añoAn = this.año - 1

  public FechaDesde = ''
  public FechaHasta = ''

  public token
  public IdOPP
  public EmpresaOPP

  // line chart
  public lineChart

  //** To add spacing between legends and chart
  public plugins = [
    {
      beforeInit(chart) {
        chart.legend.afterFit = function () {
          this.height += 20;
        };
      }
    }
  ];

  // public DatosCompletos = {
  //   data1: [588,456,906,456,878,6756,7867,4564,6785,67567,6756,8787],
  //   data2: [345,564,6567,5],
  //   minV: 5,
  //   maxM: 9000 
  // }

  /**
   *
   */
  constructor(
    private apiService: ApiService,
  ) {
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  async ngOnInit() {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.IdOPP = this.token.Usuario[0].id_opp
    this.EmpresaOPP = this.token.Usuario[0].nombre_empresa
    this.GenerarGrafico(this.DatosCompletos)
    // content header
    this.sectionBlockUI.start('Generando Ranking Empresarial, por favor Espere!!!');
    await this.DataRecaudacionAnioActual(this.IdOPP, this.añoAn, this.añoAc)
  }

  GenerarGrafico(valores: any) {
    this.lineChart = {
      chartType: 'line',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        backgroundColor: false,
        hover: {
          mode: 'label'
        },
        tooltips: {
          // Updated default tooltip UI
          shadowOffsetX: 1,
          shadowOffsetY: 1,
          shadowBlur: 8,
          shadowColor: this.tooltipShadow,
          backgroundColor: colors.solid.white,
          titleFontColor: colors.solid.black,
          bodyFontColor: colors.solid.black
        },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true
              },
              gridLines: {
                display: true,
                color: this.grid_line_color,
                zeroLineColor: this.grid_line_color
              },
              ticks: {
                fontColor: this.labelColor
              }
            }
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true
              },
              ticks: {
                stepSize: 1000,
                min: valores.minV,
                // max: valores.maxV,
                fontColor: this.labelColor
              },
              gridLines: {
                display: true,
                color: this.grid_line_color,
                zeroLineColor: this.grid_line_color
              }
            }
          ]
        },
        layout: {
          padding: {
            top: -15,
            bottom: -25,
            left: -15
          }
        },
        legend: {
          position: 'top',
          align: 'start',
          labels: {
            usePointStyle: true,
            padding: 25,
            boxWidth: 9
          }
        }
      },

      // labels: this.recaudacion,
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      datasets: [
        {
          data: valores.data1 ? valores.data1 : 0,
          // data: [30332,24776],
          label: `Movimiento de Piezas Año ${this.añoAn}`,
          borderColor: this.lineChartDanger,
          lineTension: 0.1,
          pointStyle: 'circle',
          backgroundColor: this.lineChartDanger,
          fill: false,
          pointRadius: 5,
          pointHoverRadius: 5,
          pointHoverBorderWidth: 5,
          pointBorderColor: 'transparent',
          pointHoverBorderColor: colors.solid.white,
          pointHoverBackgroundColor: this.lineChartDanger,
          pointShadowOffsetX: 1,
          pointShadowOffsetY: 1,
          pointShadowBlur: 5,
          pointShadowColor: this.tooltipShadow
        },
        {
          // data: [32332,3334,8346,13253,36575,33455,23365,66745,5565,56464,9787,6585],
          // data: this.dataFiltrada ? this.dataFiltrada : [0],
          data: valores.data2 ? valores.data2 : 0,
          label: `Movimiento de Piezas Año ${this.añoAc}`,
          borderColor: this.lineChartPrimary,
          lineTension: 0.1,
          pointStyle: 'circle',
          backgroundColor: this.lineChartPrimary,
          fill: false,
          pointRadius: 5,
          pointHoverRadius: 5,
          pointHoverBorderWidth: 5,
          pointBorderColor: 'transparent',
          pointHoverBorderColor: colors.solid.white,
          pointHoverBackgroundColor: this.lineChartPrimary,
          pointShadowOffsetX: 1,
          pointShadowOffsetY: 1,
          pointShadowBlur: 5,
          pointShadowColor: this.tooltipShadow
        },
      ]
    };
    // this.sectionBlockUI.stop()

  }

  async DataRecaudacionAnioActual(id, fan, fac) {
    this.xAPI.funcion = "IPOSTEL_R_GestionMetasRecaudacion";
    this.xAPI.parametros = `${id},${fan},${fac}`
    // this.xAPI.parametros = '40,2023,2024'
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          // console.log(e)
          this.CantidadAnterior.push(e)
          this.CantidadActual.push(e)
        })

        const objetosFiltradosAnterior = this.CantidadAnterior.filter(objeto => {
          const yearFromMesField = objeto.ano.substring(0, 4); // Extraer el año del campo "mes"
          return yearFromMesField === this.añoAn.toString(); // Filtrar por el año específico
        });

        objetosFiltradosAnterior.map(element => {
          this.DatosCompletos.data1.push(element.piezas_totales)
        });

        const maxData1 = this.DatosCompletos.data1.length > 0 ? this.DatosCompletos.data1.reduce((a, b) => Math.max(a, b)) : 0;
        const minData1 = this.DatosCompletos.data1.length > 0 ? this.DatosCompletos.data1.reduce((a, b) => Math.min(a, b)) : 0;
        this.valoresData1.push(maxData1, minData1)

        const objetosFiltradosActual = this.CantidadActual.filter(objeto => {
          const yearFromMesField = objeto.ano.substring(0, 4); // Extraer el año del campo "mes"
          return yearFromMesField === this.añoAc.toString(); // Filtrar por el año específico
        });

        objetosFiltradosActual.map(element => {
          this.DatosCompletos.data2.push(element.piezas_totales)
        });
        const maxData2 = this.DatosCompletos.data2.length > 0 ? this.DatosCompletos.data2.reduce((a, b) => Math.max(a, b)) : 0;
        const minData2 = this.DatosCompletos.data2.length > 0 ? this.DatosCompletos.data2.reduce((a, b) => Math.min(a, b)) : 0;
        this.valoresData2.push(maxData2, minData2)


        let arrayCombinado = this.valoresData1.concat(this.valoresData2);

        // console.log(arrayCombinado)
        this.DatosCompletos.maxV = arrayCombinado.length > 0 ? arrayCombinado.reduce((a, b) => Math.max(a, b)) : 0;
        this.DatosCompletos.minV = arrayCombinado.length > 0 ? arrayCombinado.reduce((a, b) => Math.min(a, b)) : 0;

        // console.log(this.DatosCompletos)
        this.GenerarGrafico(this.DatosCompletos)

        setTimeout(() => {
          this.sectionBlockUI.stop()
        }, 1000);

      },
      (error) => {
        console.log(error)
      }
    )
  }



}

