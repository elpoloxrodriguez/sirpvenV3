import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { Router } from '@angular/router';
import { UtilService } from '@core/services/util/util.service';
import { NgbModal, NgbActiveModal, NgbModalConfig, NgbDateStruct, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { animate, style, transition, trigger } from '@angular/animations';
import { IPOSTEL_C_Peso_Envio_Franqueo, IPOSTEL_U_ListaTarifasOppAutorizacion } from '@core/services/empresa/form-opp.service';
import jwt_decode from "jwt-decode";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { stringify } from 'querystring';


@Component({
  selector: 'app-price-table-opp',
  templateUrl: './price-table-opp.component.html',
  styleUrls: ['./price-table-opp.component.scss']
})
export class PriceTableOppComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;

  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public chkBoxSelected = [];

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public IUpdateListaTablaTarifasFranqueo : IPOSTEL_U_ListaTarifasOppAutorizacion = {
    status_pef: 0,
    id_peso_envio: 0,
    descripcion: '',
    pmvp: '',
    iva: '',
    tasa_postal: '',
    total_pagar: '',
    mes: '',
    id_servicio_franqueo: 0,
    user_updated: 0,
    id_pef: 0
  }

  public itemsSelectStatus = [
    { id: '0', name: 'No Autorizado'},
    { id: '1', name: 'Autorizado'}
  ]

  public token
  public idOPP
  public fechax
  public fecha = new Date();
  public mes = this.fecha.getMonth() + 1;
  public anio = this.fecha.getFullYear();

  public kitchenSinkRows: any;
  public basicSelectedOption: number = 10;
  public RowsLengthConciliacion

  public SelectionType = SelectionType;

  public loginForm: FormGroup;

  public selectServicioFranqueo = []
  public itemsSelectPesoEnvio = []
  public itemsSelectListaOPP = []
  public rowsTarifaNacionalAereo
  public tempDataTarifasFranqueo = []
  public TarifasFranqueo = []

  public TarifasFranqueoAll = []
  public rowsTarifaFranqueoAll
  public tempDataTarifasFranqueoAll = []

  public BashElem = []

  public montoIVA = 16
  public montoTASA
  public montoTASAnombre

  public ServicioFranqueoID = 1
  public selected = [];

public SelectidOPP

  public selectedMes
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public tempFecha = '';
  public tempServicio = '';
  public tempPeso = '';
  public tempStatus = '';
  public selectedRole = [];
  public selectedPlan = [];
  public selectedStatus = [];
  public selectedStatusAutorizado;
  public searchValue = '';
  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  public ListaSeleccionada = []

  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private modalService: NgbModal,
    private router: Router,
    private _formBuilder: FormBuilder,
  ) { }

  async ngOnInit() {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.idOPP = this.token.Usuario[0].id_user
    // console.log(this.idOPP)
    await this.ListaOPP()
    await this.ListaPesoEnvio()
    await this.ListaServicioFranqueo()
    // await this.ListaTarifasFranqueoAll()
  }

  customChkboxOnSelect({ selected }) {
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...selected);
  }

  onSelect({ selected }) {
    this.ListaSeleccionada = []
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    for (let i = 0; i < selected.length; i++) {
      const element = selected[i];
      this.ListaSeleccionada.push(element)
    }
    console.log(selected)
  }
  onActivate(event) {
    // console.log('Activate Event', event.row);
  }

  async ItemSeleccionadosRechazados(){
    this.sectionBlockUI.start('Rechazando Tarifas, por favor Espere!!!');
    let parametros = '0'
    this.ListaSeleccionada.map(e => {
      parametros += ','+e.id_pef
      this.BashElem.push(e.id_pef)
   });
   this.xAPI.funcion = "IPOSTEL_U_TarifasRechazo"
   this.xAPI.parametros = 'id_pef##'+ parametros
   this.xAPI.valores = ''
   await this.apiService.Ejecutar(this.xAPI).subscribe(
    (data) => {
      this.selected = ['']
      this.TarifasFranqueoAll = []
      this.RowsLengthConciliacion = []
      this.ListaTarifasFranqueoAll(this.SelectidOPP)
      this.sectionBlockUI.stop()
      this.utilService.alertConfirmMini('success', 'Tarifa Rechazada Exitosamente')
    },
    (error) => {
      console.log(error)
    }
   )
  }

  async ItemSeleccionadosAprobados(){
    this.sectionBlockUI.start('Aprobando Tarifas, por favor Espere!!!');
    let parametros = '1'
    this.ListaSeleccionada.map(e => {
      parametros += ','+e.id_pef
      this.BashElem.push(e.id_pef)
   });
   this.xAPI.funcion = "IPOSTEL_U_TarifasAprobar"
   this.xAPI.parametros = 'id_pef##'+ parametros
   this.xAPI.valores = ''
   await this.apiService.Ejecutar(this.xAPI).subscribe(
    (data) => {
      this.selected = ['']
      this.TarifasFranqueoAll = []
      this.RowsLengthConciliacion = []
      this.ListaTarifasFranqueoAll(this.SelectidOPP)
      this.sectionBlockUI.stop()
      this.utilService.alertConfirmMini('success', 'Tarifa Aprobadas Exitosamente')
    },
    (error) => {
      console.log(error)
    }
   )
  }

  async AprobarSelectTableTarifas(){
    this.RowsLengthConciliacion = []
    for (let i = 0; i < this.ListaSeleccionada.length; i++) {
      const element = this.ListaSeleccionada[i];
      this.IUpdateListaTablaTarifasFranqueo.status_pef = 1
      this.IUpdateListaTablaTarifasFranqueo.id_peso_envio = element.id_peso_envio
      this.IUpdateListaTablaTarifasFranqueo.pmvp = element.pmvp
      this.IUpdateListaTablaTarifasFranqueo.iva = element.iva
      this.IUpdateListaTablaTarifasFranqueo.tasa_postal = element.tasa_postal
      this.IUpdateListaTablaTarifasFranqueo.total_pagar = element.total_pagar
      this.IUpdateListaTablaTarifasFranqueo.mes = element.mes
      this.IUpdateListaTablaTarifasFranqueo.descripcion = element.descripcion
      this.IUpdateListaTablaTarifasFranqueo.id_servicio_franqueo = element.id_servicio_franqueo 
      this.IUpdateListaTablaTarifasFranqueo.user_updated = this.idOPP
      this.IUpdateListaTablaTarifasFranqueo.id_pef = element.id_pef
       // 
      this.xAPI.funcion = 'IPOSTEL_U_ListaTarifasOppAutorizacion'
      this.xAPI.parametros = ''
      this.xAPI.valores = JSON.stringify(this.IUpdateListaTablaTarifasFranqueo)
      await this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          this.sectionBlockUI.start('Autorizando Tarifas, por favor Espere!!!');
          this.rows.push(this.TarifasFranqueoAll)
          if (data.tipo === 1) {
            this.selected = []
            this.TarifasFranqueoAll = []
            this.RowsLengthConciliacion = []
            this.ListaTarifasFranqueoAll(this.SelectidOPP)
            this.sectionBlockUI.stop()
            this.utilService.alertConfirmMini('success', 'Tarifa Autorizada Exitosamente')
          } else {
            this.sectionBlockUI.stop()
            this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal, intente de nuevo')
          }
        },
        (error) => {
          console.log(error)
        }
      )
    }
    }
  
    async RechazarSelectTableTarifas(){
      this.selected = []
      this.RowsLengthConciliacion = []
      for (let i = 0; i < this.ListaSeleccionada.length; i++) {
        const element = this.ListaSeleccionada[i];
        this.IUpdateListaTablaTarifasFranqueo.status_pef = 0
        this.IUpdateListaTablaTarifasFranqueo.id_peso_envio = element.id_peso_envio
        this.IUpdateListaTablaTarifasFranqueo.pmvp = element.pmvp
        this.IUpdateListaTablaTarifasFranqueo.iva = element.iva
        this.IUpdateListaTablaTarifasFranqueo.tasa_postal = element.tasa_postal
        this.IUpdateListaTablaTarifasFranqueo.total_pagar = element.total_pagar
        this.IUpdateListaTablaTarifasFranqueo.mes = element.mes
        this.IUpdateListaTablaTarifasFranqueo.descripcion = element.descripcion
        this.IUpdateListaTablaTarifasFranqueo.id_servicio_franqueo = element.id_servicio_franqueo 
        this.IUpdateListaTablaTarifasFranqueo.user_updated = this.idOPP
        this.IUpdateListaTablaTarifasFranqueo.id_pef = element.id_pef
         // 
        this.xAPI.funcion = 'IPOSTEL_U_ListaTarifasOppAutorizacion'
        this.xAPI.parametros = ''
        this.xAPI.valores = JSON.stringify(this.IUpdateListaTablaTarifasFranqueo)
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            this.sectionBlockUI.start('Rechazando Tarifas, por favor Espere!!!');
            this.rows.push(this.TarifasFranqueoAll)
            if (data.tipo === 1) {
              this.TarifasFranqueoAll = []
              this.RowsLengthConciliacion = []
              this.ListaTarifasFranqueoAll(this.SelectidOPP)
              this.sectionBlockUI.stop()
              this.utilService.alertConfirmMini('success', 'Tarifa Rechazada Exitosamente')
            } else {
              this.sectionBlockUI.stop()
              this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal, intente de nuevo')
            }
          },
          (error) => {
            console.log(error)
          }
        )
      }
      }

  async ListaTarifasFranqueoAll(IDOPP) {
    this.sectionBlockUI.start('Cargando Tarifas, por favor Espere!!!');
    this.TarifasFranqueoAll = []
    if (this.SelectidOPP != null) {
    this.xAPI.funcion = "IPOSTEL_R_TarifasFranqueo"
    this.xAPI.parametros = `${IDOPP}`
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          if (e.status_pef == 1) {
            e.status = 'Autorizado' 
          } else {
            e.status = 'No Autorizado' 
          }
          e.pmvpx = this.utilService.ConvertirMoneda(e.pmvp);
          e.ivax = this.utilService.ConvertirMoneda(e.iva);
          e.tasa_postalx = this.utilService.ConvertirMoneda(e.tasa_postal);
          e.total_pagarx = this.utilService.ConvertirMoneda(e.total_pagar);
          console.log(e)
          this.TarifasFranqueoAll.push(e)
          this.sectionBlockUI.stop()
        });
        // console.log(this.TarifasFranqueoAll)
        this.rows = this.TarifasFranqueoAll
        this.RowsLengthConciliacion = this.rows.length
        this.tempData = this.rows
      },
      (error) => {
        console.log(error)
      }
    )
    } else {
      this.TarifasFranqueoAll = []
    }
  }

  async ListaPesoEnvio() {
    this.xAPI.funcion = "IPOSTEL_R_PesoEnvio";
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.itemsSelectPesoEnvio = data.Cuerpo.map(e => {
          e.name = e.nombre_peso_envio
          e.id = e.id_peso_envio
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaOPP() {
    this.xAPI.funcion = "IPOSTEL_R_OPP_SUB";
    this.xAPI.parametros = '1'
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.itemsSelectListaOPP = data.Cuerpo.map(e => {
          e.id = e.id_opp
          e.name = `${e.nombre_empresa.toUpperCase()} | ${e.rif}`
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaServicioFranqueo() {
    this.xAPI.funcion = "IPOSTEL_R_ServicioFranqueo";
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.selectServicioFranqueo = data.Cuerpo.map(e => {
          e.name = e.nombre_servicios_franqueo
          e.id = e.id_servicios_franqueo
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async DeleteTarifaOpp(data: any) {
    let OPP = data.id_opp
    await Swal.fire({
      title: 'Esta Seguro?',
      text: "De Eliminar Este Registro!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.xAPI.funcion = "IPOSTEL_D_TarifasFranqueo";
        this.xAPI.parametros = `${data.id_pef}`
        this.xAPI.valores = ''
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            this.rows.push(this.TarifasFranqueoAll)
            if (data.tipo === 1) {
              this.utilService.alertConfirmMini('success', 'Registro Eliminado Exitosamente')
              this.TarifasFranqueoAll = []
              this.ListaTarifasFranqueoAll(OPP)  
            } else {
              this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal, intente de nuevo')
            }
          },
          (error) => {
            console.log(error)
          }
        )
      }
    })
  }


  filterUpdate(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return d.status.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rows = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }
  

  filterByFecha(event) {
    // console.log(event)
    const filter = event ? event : '';
    this.tempFecha = filter;
    this.temp = this.filterRows(filter, this.tempServicio, this.tempPeso, this.tempStatus);
    this.rows = this.temp;
  }

  filterByServicio(event) {
    // console.log(event)
    const filter = event ? event.name : '';
    this.tempServicio = filter;
    this.temp = this.filterRows(this.tempFecha, filter, this.tempPeso, this.tempStatus);
    this.rows = this.temp;
  }

  filterByPeso(event) {
    // console.log(event)
    const filter = event ? event.name : '';
    this.tempPeso = filter;
    this.temp = this.filterRows(this.tempFecha, this.tempServicio, filter, this.tempStatus);
    this.rows = this.temp;
  }

  filterByStatus(event) {
    // console.log(event.name)
    const filter = event ? event.name : '';
    this.tempStatus = filter;
    this.temp = this.filterRows(this.tempFecha, this.tempServicio, this.tempPeso,  filter);
    this.rows = this.temp;
  }

  filterRows(fecha: string, servicio: string, peso: string, status: string): any[] {
    // this.searchValue = '';
    servicio = servicio.toLowerCase();
    // console.log(servicio)
    peso = peso.toLowerCase();
    status = status.toLowerCase();
    return this.tempData.filter(row => {                            
      let tempFecha = fecha == '' ? true : row.mes.indexOf(fecha) !== -1;
      let tempServicio = servicio == '' ? true : row.nombre_servicios_franqueo.toLowerCase().toString().indexOf(servicio) !== -1;
      let tempPeso = peso == '' ? true : row.nombre_peso_envio.toLowerCase().toString().indexOf(peso) !== -1 ;
      let tempStatus = status == '' ? true : row.status.toLowerCase().toString().indexOf(status) !== -1 ;
      return tempFecha && tempServicio && tempPeso && tempStatus;
    });
  }

}