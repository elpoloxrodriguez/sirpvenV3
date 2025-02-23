import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';
import { UtilService } from '@core/services/util/util.service';

@Component({
  selector: 'app-private-postal-operator',
  templateUrl: './private-postal-operator.component.html',
  styleUrls: ['./private-postal-operator.component.scss'],
  encapsulation : ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],

})
export class PrivatePostalOperatorComponent  implements OnInit {

  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    valores : {},
  };

  public token : any

  public ModalTitle
  public dataEmpresas = [];
  public dataEmpresaDocumentosAdjuntos = []
  public sidebarToggleRef = false;
  public rowsEmpresas;
  public rows
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = '';
  public previousPlanFilter = '';
  public previousStatusFilter = '';


  public searchValue = '';
  public searchValueX = '';


  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;


  // Private
  private tempDataEmpresas = [];
  private tempData = [];
  private tempDataUtilidadAportes = []
  private _unsubscribeAll: Subject<any>;

  constructor(
    private apiService : ApiService,
    private modalService: NgbModal,
    private utilService: UtilService,

  ) { 
    this._unsubscribeAll = new Subject();
  }

  async ngOnInit() {
    this.token =  jwt_decode(sessionStorage.getItem('token'));
    // console.log(this.token);
    await this.DocumentosAdjuntosEmpresa()
    
  }

  async DocumentosAdjuntosEmpresa() {
    this.xAPI.funcion = "IPOSTEL_R_ListaDocumentosAdjuntos";
    this.xAPI.parametros = '';
    this.dataEmpresas = []
     await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.dataEmpresas.push(e);
        });
        this.rowsEmpresas = this.dataEmpresas;
        this.tempDataEmpresas = this.rowsEmpresas;
        // console.log(this.dataEmpresas)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  dwUrl(ncontrol: string, archivo: string): string {
    return this.apiService.Dws(btoa("D" + ncontrol) + '/' + archivo)
  }

  ModalDetails(modal, data) {
    this.ModalTitle =  data.nombre_empresa
    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }  

  async listaDocumentosAdjuntosEmpresa(data: any) {
    this.xAPI.funcion = "IPOSTEL_R_DocumentosAdjuntos_Empresas";
    this.xAPI.parametros = `${data.idusuario}`;
    this.dataEmpresaDocumentosAdjuntos = []
     await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
         data.Cuerpo.map(e => {
          this.dataEmpresaDocumentosAdjuntos.push(e);
        });
        this.rows = this.dataEmpresaDocumentosAdjuntos;
        this.tempData = this.rows;  
        // console.log(this.dataEmpresaDocumentosAdjuntos)
      },
      (error) => {
        console.log(error)
      }
    )
  }
  

  filterUpdate(event) {
    // console.log(event)
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataEmpresas.filter(function (d) {
      return d.nombre_empresa.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsEmpresas = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  filterUpdateDocumentoAdjuntoEmpresa(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return d.nombre_reto.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rows = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }


  async DeleteArchivoDigitalPostal(id: any) {
    this.xAPI.funcion = "IPOSTEL_D_DocumentosAdjuntos_Empresas"
    this.xAPI.parametros = `${id.id}`
    this.xAPI.valores = ''
    Swal.fire({
      title: 'Esta seguro de eliminar este documento?',
      text: "Tenga en cuenta que este cambio es irreversible !",
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Deseo eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            // this.sectionBlockUI.start('Generando Concesión Postal, por favor Espere!!!');
            this.rows.push(this.dataEmpresaDocumentosAdjuntos)
            this.rowsEmpresas.push(this.dataEmpresas)
            if (data.tipo === 1) {
              this.dataEmpresaDocumentosAdjuntos = []
              this.dataEmpresas = []
              this.listaDocumentosAdjuntosEmpresa(id)
              this.DocumentosAdjuntosEmpresa()
              this.modalService.dismissAll('Close')
              // this.sectionBlockUI.stop()
              this.utilService.alertConfirmMini('success', 'Archivo Digital Postal Eliminado Exitosamente!')
            } else {
              this.modalService.dismissAll('Close')
              this.utilService.alertConfirmMini('error', 'Algo salio mal! <br> Verifique e intente de nuevo')
            }
          },
          (error) => {
            console.log(error)
          }
        )
      }
    })

  }

  /**
   * On destroy
   */
   ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}



