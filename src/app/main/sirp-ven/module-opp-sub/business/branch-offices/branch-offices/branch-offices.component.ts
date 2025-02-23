import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import jwt_decode from "jwt-decode";
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPOSTEL_RegistrarSucursalSUB, TablaMatrixSUBCONTRATO } from '@core/services/empresa/form-opp.service';
import { UtilService } from '@core/services/util/util.service';
import { Router } from '@angular/router';
import { AddAgencyService } from '../add-agency.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-branch-offices',
  templateUrl: './branch-offices.component.html',
  styleUrls: ['./branch-offices.component.scss']
})
export class BranchOfficesComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public tablaMatrixSubcontrato: TablaMatrixSUBCONTRATO = {
    id_sub: 0,
    id_opp: 0
  }

  public SubSucursales = []
  public token
  public TipoRegistro
  public IdOPP
  public CargarSub

  public tipoSucursal = [
    { id: 0, name: 'Principal' },
    { id: 1, name: 'Agencia' }
  ]

  public SelectEstado
  public SelectCiudad
  public SelectMunicipio
  public SelectParroquia

  public ICrearSucursalSUB: IPOSTEL_RegistrarSucursalSUB = {
    id_sub: 0,
    estado_empresa: undefined,
    ciudad_empresa: undefined,
    municipio_empresa: undefined,
    parroquia_empresa: undefined,
    zona_empresa: '',
    tipo_sub: undefined,
  }

  public ListaCompletaOPP = [];

  public loadingIndicatorOPP: boolean = true

  public isLoading: number = 0;

  public idSUB
  public SelectOPP = []
  public idOPPSubcontrato: []
  public idcontrato

  private _unsubscribeAll: Subject<any>;

  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public searchValue = '';
  public rowsSucursales
  public tempDataSucursales = []

  public TitleModal

  public OPPSub = []
  public rowsOPPSub = []
  public tempDataOPPSub = []

  public titleModal
  public showBtn: boolean = true
  public titleBtn

  public item = []
  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private router: Router,
    private agregarAgencia: AddAgencyService
  ) { }

  async ngOnInit() {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    // console.log(this.token)
    this.TipoRegistro = this.token.Usuario[0].tipo_registro
    this.IdOPP = this.token.Usuario[0].id_opp
    this.ICrearSucursalSUB.nombre_empresa = this.token.Usuario[0].nombre_empresa
    this.ICrearSucursalSUB.rif_empresa = this.token.Usuario[0].rif
    await this.Sucursales(this.IdOPP)
    await this.Select_Estados()
    await this.EmpresaOppSub()
  }

  async Select_Estados() {
    this.xAPI.funcion = 'ListarEstados'
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    this.SelectEstado = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.SelectEstado = data.Cuerpo.map(e => {
          return e
        })
      },
      (error) => {
        console.error(error)
      }
    )
  }
  async Select_Ciudad(id: any) {
    this.ICrearSucursalSUB.estado_empresa = id.estado
    this.xAPI.funcion = 'ListarCiudad'
    this.xAPI.parametros = id.id_estado
    this.xAPI.valores = ''
    this.SelectCiudad = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.SelectCiudad = data.Cuerpo.map(e => {
          return e
        })
      },
      (error) => {
        console.error(error)
      }
    )
  }
  async Select_Municipo(id: any) {
    this.ICrearSucursalSUB.ciudad_empresa = id.ciudad
    this.xAPI.funcion = 'ListarMunicipio'
    this.xAPI.parametros = id.id_estado
    this.xAPI.valores = ''
    this.SelectMunicipio = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.SelectMunicipio = data.Cuerpo.map(e => {
          return e
        })
      },
      (error) => {
        console.error(error)
      }
    )
  }
  async Select_Parroquia(id: any) {
    this.ICrearSucursalSUB.municipio_empresa = id.municipio
    this.xAPI.funcion = 'ListarParroquia'
    this.xAPI.parametros = id.id_municipio
    this.xAPI.valores = ''
    this.SelectParroquia = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.SelectParroquia = data.Cuerpo.map(e => {
          return e
        })
      },
      (error) => {
        console.error(error)
      }
    )
  }

  CapParroquia(id: any) {
    this.ICrearSucursalSUB.parroquia_empresa = id.parroquia
  }

  async Sucursales(id: any) {
    console.log(id)
    this.isLoading = 0;
    this.xAPI.funcion = "IPOSTEL_R_Sucursales_SUB"
    this.xAPI.parametros = `${id}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.Cuerpo.length > 0) {
          data.Cuerpo.map(e => {
            this.SubSucursales.push(e)
          });
          this.rowsSucursales = this.SubSucursales;
          this.tempDataSucursales = this.rowsSucursales
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


  async ListaOPPSUB(id: any) {
    this.loadingIndicatorOPP = true
    this.xAPI.funcion = "IPOSTEL_R_SubcontratistaVerOpp"
    this.xAPI.parametros = `${id}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          // console.log(e)
          this.OPPSub.push(e)
        });
        this.rowsOPPSub = this.OPPSub;
        this.tempDataOPPSub = this.rowsOPPSub
        this.loadingIndicatorOPP = false
      },
      (error) => {
        console.log(error)
      }
    )
  }

  VerSubContratistas(modal: any, row: any) {
    // console.log(row)
    this.ListaOPPSUB(row.id_suc)
    this.TitleModal = row.nombre_empresa
    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async ActualizarAgencia() {
    this.xAPI.funcion = "IPOSTEL_U_ActualizarSucursalSUB"
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.ICrearSucursalSUB)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      async (data) => {
        if (data.tipo == 1) {
          this.SubSucursales = []
          this.rowsSucursales = []
          this.tempDataSucursales = []
          this.Limpiar()
          this.modalService.dismissAll('Cerrar Modal')
          // await this.Sucursales(this.IdOPP)
          this.router.navigate(['/subcontractor/branch-offices']).then(() => { window.location.reload() });
          this.utilService.alertConfirmMini('success', 'Agencia Actualizada Exitosamente')
        } else {
          this.rowsSucursales = []
          this.utilService.alertConfirmMini('warning', 'Oops, Lo sentimos algo salio mal!')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async filterUpdateSubcontratistas(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataSucursales.filter(function (d) {
      return d.nombre_empresa.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsSucursales = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }


  filterOPPSUB(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataOPPSub.filter(function (d) {
      return d.opp_nombre_empresa.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsOPPSub = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;

  }

  ModalAgregarSucursal(modal) {
    this.titleModal = 'Agregar Agencia'
    this.showBtn = false
    this.titleBtn = 'Agregar Agencia'
    this.ICrearSucursalSUB.nombre_empresa = this.token.Usuario[0].nombre_empresa
    this.ICrearSucursalSUB.rif_empresa = this.token.Usuario[0].rif
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });

  }

  async GuardarSucursal() {
    this.sectionBlockUI.start('Registrando Sucursal, por favor Espere!!!');
    this.ICrearSucursalSUB.id_sub = this.IdOPP
    await this.agregarAgencia.AgregarAgencia(this.ICrearSucursalSUB)
      .then((resultado) => {
        // Manejar el resolve
        // console.log('Operación exitosa:', resultado);
        this.SubSucursales = []
        this.rowsSucursales = []
        this.tempDataSucursales = []
        this.Sucursales(this.IdOPP)
        this.Limpiar()
        this.modalService.dismissAll('Cerrar Modal')
        this.utilService.alertConfirmMini('success', 'Agencia Registrada Exitosamente')
      })
      .catch((error) => {
        // Manejar el reject
        // console.error('Error en la operación:', error);
        this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal!')
      })
      .finally(() => {
        // Este bloque se ejecutará después de que la promesa se resuelva o se rechace
        // console.log('Procesamiento finalizado');
        this.Sucursales(this.IdOPP)
        this.sectionBlockUI.stop()
      });
  }

  Limpiar() {
    this.ICrearSucursalSUB = {
      id_sub: 0,
      estado_empresa: undefined,
      ciudad_empresa: undefined,
      municipio_empresa: undefined,
      parroquia_empresa: undefined,
      zona_empresa: '',
      tipo_sub: undefined,
      // nombre_empresa: '',
      // rif_empresa: ''
    }
  }

  async GuardarSubcontrato() {
    for (let i = 0; i < this.ListaCompletaOPP.length; i++) {
      const element = this.ListaCompletaOPP[i];
      await this.servicioGuardarSubcontrato(element)
    }
  }

  servicioGuardarSubcontrato(subcontrato: any) {
    this.sectionBlockUI.start('Agregando Subcontrato, por favor Espere!!!');
    this.agregarAgencia.AgregarSubcontrato(subcontrato)
      .then((resultado) => {
        // Manejar el resolve
        // console.log('Operación exitosa:', resultado);
        this.SubSucursales = []
        this.idcontrato = undefined
        this.modalService.dismissAll('Cerrar Modal')
        this.utilService.alertConfirmMini('success', 'Subcontrato Registrado Exitosamente')
      })
      .catch((error) => {
        // Manejar el reject
        // console.error('Error en la operación:', error);
        this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal!')
      })
      .finally(() => {
        // Este bloque se ejecutará después de que la promesa se resuelva o se rechace
        // console.log('Procesamiento finalizado');
        this.Sucursales(this.IdOPP)
        this.sectionBlockUI.stop()
      });
  }

  onSelectChange(selectedItems: any[]) {
    this.ListaCompletaOPP = selectedItems.map(item => {
      return { opp: item.id, sub: this.idSUB };
    });
  }


  EmpresaOppSub() {
    this.xAPI.funcion = "IPOSTEL_R_OPP_SUB";
    this.xAPI.parametros = '1'
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.forEach(e => {
          e.id = e.id_opp,
            e.name = e.nombre_empresa.toUpperCase()
          this.SelectOPP.push(e)
        });
        // console.log(this.SelectOPP)
      },
      (err) => {
        console.log(err)
      }
    )
  }

  async EliminarContrato(row: any) {
    // console.log(row.id_suc)
    await Swal.fire({
      title: "Esta seguro?",
      text: "Desea eliminar esta agencia ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminarla!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.sectionBlockUI.start('Eliminando Agencia, por favor Espere!!!');
        this.agregarAgencia.EliminarAgencia(row.id_suc)
          .then((resultado) => {
            this.SubSucursales = []
            this.rowsSucursales = []
            this.tempDataSucursales = []
            this.Limpiar()
            this.modalService.dismissAll('Cerrar Modal')
            this.utilService.alertConfirmMini('success', 'Agencia Eliminada Exitosamente')
            this.Sucursales(this.IdOPP)
          })
          .catch((error) => {
            this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal!')
          })
          .finally(() => {
            this.Sucursales(this.IdOPP)
            this.sectionBlockUI.stop()
          });
      }
    });
  }


  AgregarContrato(modal: any, row: any) {
    this.idSUB = row.id_suc
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  cerrarModal() {
    this.modalService.dismissAll('Accept click')
    this.Limpiar()
  }

  ModificarAgencia(modal: any, row: any) {
    this.titleModal = 'Actualizar Agencia'
    this.showBtn = true
    this.titleBtn = 'Actualizar Agencia'
    this.ICrearSucursalSUB.id_suc = parseInt(row.id_suc)
    this.ICrearSucursalSUB.id_sub = this.IdOPP
    this.ICrearSucursalSUB.tipo_sub = parseInt(row.tipo_sub)
    this.ICrearSucursalSUB.estado_empresa = row.estado_empresa
    this.ICrearSucursalSUB.ciudad_empresa = row.ciudad_empresa
    this.ICrearSucursalSUB.municipio_empresa = row.municipio_empresa
    this.ICrearSucursalSUB.parroquia_empresa = row.parroquia_empresa
    this.ICrearSucursalSUB.zona_empresa = row.zona_empresa
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}

