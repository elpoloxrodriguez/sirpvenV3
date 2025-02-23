import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { UtilService } from '@core/services/util/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jwt_decode from "jwt-decode";
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { PdfService } from '@core/services/pdf/pdf.service';


@Component({
  selector: 'app-fines-penalties',
  templateUrl: './fines-penalties.component.html',
  styleUrls: ['./fines-penalties.component.scss']
})
export class FinesPenaltiesComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;


  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public searchValue = '';

  public rowsOPP_SUB = []
  public tempDataOPP_SUB = []
  public List_OPP_SUB = []

  public btnGenerate = false;
  public BtnGenerarMultas = false;

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };
  public valor1
  public valor2

  public totalRows = 0;

  public List_incumplimiento = []

  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private modalService: NgbModal,
    private router: Router,
    private _formBuilder: FormBuilder,
    private pdf: PdfService,
  ) { }

  ngOnInit(): void {
    this.ListaIncumplimiento()
  }
  
  GenerarMultas(){
    if (this.valor1 != null && this.valor2 != null){
      this.ListaOPPNoPagaron(this.valor1, this.valor2)
    } else {
      this.utilService.alertConfirmMini('error', 'Lo sentimos los campos de fecha son requeridos, intente de nuevo')
    }
  }

  GenerarMultasNoPagaron(){
    if (this.valor1 != null && this.valor2 != null){
      this.ListaOPPNoPagaron(this.valor1, this.valor2)
    } else {
      this.utilService.alertConfirmMini('error', 'Lo sentimos los campos de fecha son requeridos, intente de nuevo')
    }
  }

  GenerarMultasSiPagaron(){
    if (this.valor1 != null && this.valor2 != null){
      this.ListaOPPSiPagaron(this.valor1, this.valor2)
    } else {
      this.utilService.alertConfirmMini('error', 'Lo sentimos los campos de fecha son requeridos, intente de nuevo')
    }
  }


  async ListaOPPNoPagaron(valor1: any, valor2: any) {
    this.List_OPP_SUB = []
      this.xAPI.funcion = "IPOSTEL_R_ListaOPPNoPagaron";
      this.xAPI.valores = ''
      this.xAPI.parametros = `${valor1},${valor2}`
      this.sectionBlockUI.start('Generando Lista, por favor Espere!!!');
      await this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          data.Cuerpo.map(e => {
            this.BtnGenerarMultas = true
            e.nombre_empresa = e.nombre_empresa.toUpperCase();
           this.List_OPP_SUB.push(e)
           this.sectionBlockUI.stop()
          });
          // console.log(this.List_OPP_SUB)
          this.totalRows = this.List_OPP_SUB.length
          this.rowsOPP_SUB = this.List_OPP_SUB
          this.tempDataOPP_SUB = this.rowsOPP_SUB
        },
        (error) => {
          this.sectionBlockUI.stop()
          console.log(error)
        }
      )
  }

  async ListaOPPSiPagaron(valor1: any, valor2: any) {
    this.List_OPP_SUB = []
      this.xAPI.funcion = "IPOSTEL_R_ListaOPPSiPagaron";
      this.xAPI.valores = ''
      this.xAPI.parametros = `${valor1},${valor2}`
      this.sectionBlockUI.start('Generando Lista, por favor Espere!!!');
      await this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          data.Cuerpo.map(e => {
            this.BtnGenerarMultas = false
            e.nombre_empresa = e.nombre_empresa.toUpperCase();
           this.List_OPP_SUB.push(e)
           this.sectionBlockUI.stop()
          });
          // console.log(this.List_OPP_SUB)
          this.totalRows = this.List_OPP_SUB.length
          this.rowsOPP_SUB = this.List_OPP_SUB
          this.tempDataOPP_SUB = this.rowsOPP_SUB
        },
        (error) => {
          this.sectionBlockUI.stop()
          console.log(error)
        }
      )
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

  async ModalProcesarMultas(modal: any){
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
          e.name = e.descripcion_tasa_incumplimiento
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

}
