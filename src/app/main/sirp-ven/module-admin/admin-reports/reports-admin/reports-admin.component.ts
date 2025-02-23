import { Component, OnInit } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { ExcelService } from '@core/services/excel/excel.service'
import { UtilService } from '@core/services/util/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reports-admin',
  templateUrl: './reports-admin.component.html',
  styleUrls: ['./reports-admin.component.scss']
})
export class ReportsAdminComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public Opp = []

  public ListReportEmpresasAprobadas = []
  public itemReports
  public statusEmpresa
  public ListReport = [
    { id: 1, name: 'Cantidad de Operadores Postales Privados (Registrados).' },
    { id: 2, name: 'Generar por mes la actividad y movimientos de los OPP.' },
    { id: 3, name: 'Mostrar la cantidad de empresas sub-contratadas y su actividad.' },
    { id: 4, name: 'Reporte de operadores por piezas.' },
    { id: 5, name: 'Reporte el día cuatro (04) hábil bancario de los OPP que no hayan realizado el Pago.' },
    { id: 6, name: 'Reporte el día cuatro (04) hábil bancario de los OPP que hayan realizado su Pago' },
    { id: 7, name: 'Historico Administrativo por OPP' },
    { id: 8, name: 'Pagos de Subcontratistas' },
  ]

  public inputShow = false
  public id_opp_select

  constructor(
    private excelservice: ExcelService,
    private apiService: ApiService,
    private utilservice: UtilService,
    private modalService: NgbModal,
  ) { }


  async ngOnInit() {
    this.ListaOPP_SUB()
  }

  async ListaOPP_SUB() {
    this.xAPI.funcion = "IPOSTEL_R_OPP_SUB"
    this.xAPI.parametros = '1'
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.forEach(element => {
          this.Opp.push(element)
        });
      },
      (error) => {
        console.log(error)
      }
    )
    // console.log(this.Opp)
  }


  async ReportEmpresasAprobadas(id: any) {
    switch (this.itemReports) {
      case 1:
        this.sectionBlockUI.start('Generando Reporte, por favor Espere!!!');
        this.statusEmpresa = '1'
        this.xAPI.funcion = "IPOSTEL_R_OPP_Reporte01";
        this.xAPI.parametros = this.statusEmpresa
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            this.itemReports = undefined
            this.exportAsXLSX(data.Cuerpo, 'Cantidad de Operadores Postales Privados (Registrados)')
            this.utilservice.alertConfirmMini('success', 'Archivo Descagado Exitosamente!')
            this.sectionBlockUI.stop();
          },
          (error) => {
            console.log(error)
            this.sectionBlockUI.stop();
          }
        )
        break;
      case 2:
        this.sectionBlockUI.start('Generando Reporte, por favor Espere!!!');
        this.xAPI.funcion = "IPOSTEL_R_OPP_Reporte02";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            this.itemReports = undefined
            this.exportAsXLSX(data.Cuerpo, 'Generar por mes la actividad y movimientos de los OPP')
            this.utilservice.alertConfirmMini('success', 'Archivo Descagado Exitosamente!')
            this.sectionBlockUI.stop();
          },
          (error) => {
            this.sectionBlockUI.stop();
            console.log(error)
          }
        )

        break;
      case 3:
        this.sectionBlockUI.start('Generando Reporte, por favor Espere!!!');
        this.xAPI.funcion = "IPOSTEL_R_OPP_Reporte03";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            this.itemReports = undefined
            this.exportAsXLSX(data.Cuerpo, 'Mostrar la cantidad de empresas sub-contratadas y su actividad')
            this.utilservice.alertConfirmMini('success', 'Archivo Descagado Exitosamente!')
            this.sectionBlockUI.stop();
          },
          (error) => {
            this.sectionBlockUI.stop();
            console.log(error)
          }
        )
        break;
      case 4:
        this.sectionBlockUI.start('Generando Reporte, por favor Espere!!!');
        this.xAPI.funcion = "IPOSTEL_R_OPP_Reporte04";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {

          },
          (error) => {
            console.log(error)
          }
        )
        break;
      case 5:
        this.sectionBlockUI.start('Generando Reporte, por favor Espere!!!');
        this.xAPI.funcion = "IPOSTEL_R_OPP_Reporte05";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {

          },
          (error) => {
            console.log(error)
          }
        )
        break;
      case 6:
        this.sectionBlockUI.start('Generando Reporte, por favor Espere!!!');
        this.xAPI.funcion = "IPOSTEL_R_OPP_Reporte06";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {

          },
          (error) => {
            console.log(error)
          }
        )
        break;
      case 7:
        this.inputShow = true
        this.sectionBlockUI.start('Generando Reporte, por favor Espere!!!');
        this.xAPI.funcion = "IPOSTEL_R_OPP_Reporte07";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {

          },
          (error) => {
            console.log(error)
          }
        )
        break;
      case 8:
        this.inputShow = true
        this.sectionBlockUI.start('Generando Reporte, por favor Espere!!!');
        this.xAPI.funcion = "IPOSTEL_R_OPP_Reporte08";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {

          },
          (error) => {
            console.log(error)
          }
        )
        break;
      default:
        this.statusEmpresa = undefined
        break;
    }
  }


  GenerarReportesHistoricos(data: any) {
    console.log(data)
  }

  exportAsXLSX(data: any, fileName: string) {
    this.excelservice.exportToExcel(data, fileName)
    this.utilservice.alertConfirmMini('success', 'Archivo Descagado Exitosamente!')
  }


}
