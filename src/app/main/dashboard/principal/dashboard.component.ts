import { Component, OnInit, ViewEncapsulation, ViewChild, Injectable } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { ICrearCertificados, IPOSTEL_U_PRECIO_PETRO_DOLAR } from '@core/services/empresa/form-opp.service';
import { PdfService } from '@core/services/pdf/pdf.service';
import { UtilService } from '@core/services/util/util.service';
import jwt_decode from "jwt-decode";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import puppeteer from 'puppeteer';

import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public urlPetro: string = 'https://www.petro.gob.ve/es/'
  public urlBcv: string = 'https://www.bcv.org.ve/'

  public I_UpdateMontosPetroDolar: IPOSTEL_U_PRECIO_PETRO_DOLAR = {
    petro: '',
    dolar: '',
    petro_bolivares: '',
    id_pd: 0
  }

  public CrearCert: ICrearCertificados = {
    usuario: 0,
    token: '',
    type: 0,
    created_user: 0
  }
  public title

  public DataEmpresa
  public token
  public empresa = false
  public usuario = false
  public n_curp
  public statusEmpresaOPP = false
  public statusEmpresaSUB = false


  public empresaOPP = false
  public empresaSUB = false

  public fecha = new Date('yyyy-MM-dd HH:mm:ss');
  public fechax = new Date();
  public aniox = this.fechax.getFullYear();
  public anio = this.fecha.getFullYear();
  public mes = this.fechax.getMonth();


  public hora
  public fecha_Actual_convert
  public hora_Actual_convert
  public role

  public MesAnio

  public bolivares
  public dolar
  public petro
  public bolivaresx
  public dolarx
  public petrox

  public DatosSub_OPP = []

  public mes_consultar
  // 
  public EmpresasLiquidadasResult = 0 // Numero de empresas que pagaron
  public EmpresasTotales = 0 // Total de empresas registradas
  public EmpresasReparosResult = 0 // Numero de empresas que no pagaron
  public recaudacionPorcentajeLiquidado // % de Recaudacion
  public recaudacionPorcentajeReparos // % de Reparos
  public TotalPiezas = 0 // Total de numero de piezas
  public IngresosTotales // Monto Total Recaudado 
  public EstimadoDolar // % de Estimado en $
  public EstimadoPetro // % de Estimado en Petro
  public ServicioNacional
  public TotalPiezasNacionales = []
  public ServicioIntLlegada
  public TotalPiezasIntLlegada = []
  public ServicioIntSalida
  public TotalPiezasIntSalida = []
  public TotalServicios
  public TotalServiciosCompletos = []
  public PorcentajeLiquidado
  public PorcentajeReparos
  public CantidadLiquidados = 0
  public CantidadLiquidadosX = []
  public TotalCantidadLiquidados = []
  public CartasNoMovilizacion = 0
  public CartasNoMovilizacionX = []
  public OtrosPagos = 0
  public OtrosPagosX = []
  public TotalFPO = 0
  public TotalFPOX = []
  public TotalPagosFPO
  public TotalPagosFPOX = []
  public totalpagosFPO = 0

  public fpo: any = 0
  public fpoX = []
  public fpo_OtrosMeses: any = 0
  public fpo_OtrosMesesX = []
  public derechosSemestral1: any = 0
  public derechosSemestral1X = []
  public derechosSemestral2: any = 0
  public derechosSemestral2X = []
  public anualidad: any = 0
  public anualidadX = []
  public subcontratistas: any = 0
  public subcontratistasX = []
  public pagosNoLiquidados: any = 0
  public pagosNoLiquidadosX = []
  // 


  constructor(
    private modalService: NgbModal,
    private _router: ActivatedRoute,
    private apiService: ApiService,
    private utilService: UtilService,
    private pdf: PdfService,
    private httpClient: HttpClient
  ) { }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  async ngOnInit() {
    // this.WebScrapring()
    this.token = jwt_decode(sessionStorage.getItem('token'));
    await this.Precio_Dolar_Petro()
    await this.Meses()
    this.fecha_Actual_convert = this.utilService.FechaMomentActual()
    this.role = this.token.Usuario[0].role
    switch (this.token.Usuario[0].tipo_registro) {
      case undefined:
        this.title = 'Administrador IPOSTEL'
        this.usuario = false
        this.empresa = true
        this.EmpresasLiquidadasResult = 0
        this.EmpresasReparosResult = 0
        this.IngresosTotales = 0
        // this.EstimadoDolar =  this.utilService.ConvertirMoneda$(this.dolar)
        this.TotalPagosFPO = 0
        this.recaudacionPorcentajeLiquidado = 0
        this.recaudacionPorcentajeReparos = 0
        this.EstimadoPetro = 0
        this.ServicioNacional = 0
        this.ServicioIntLlegada = 0
        this.ServicioIntSalida = 0
        this.TotalServicios = 0
        this.mes_consultar = this.MesAnio
        //
        // 
        break;
      case 1:
        this.EmpresaOppSub(this.token.Usuario[0].id_opp)
        this.EmpresaRIF(this.token.Usuario[0].id_opp)
        this.title = 'Operador Postal Privado'
        this.empresaSUB = false
        this.empresaOPP = true
        this.usuario = true
        this.empresa = false
        break;
      case 2:
        this.EmpresaOppSub(this.token.Usuario[0].id_opp)
        this.EmpresaRIF(this.token.Usuario[0].id_opp)
        this.title = 'Sub Contratista'
        this.empresaSUB = true
        this.empresaOPP = false
        this.usuario = true
        this.empresa = false
        break;
      default:
        break;
    }


    if (this.token.Usuario[0].status_curp === 1) {
      this.statusEmpresaOPP = true
      this.statusEmpresaSUB = true
    } else {
      this.statusEmpresaSUB = false
      this.statusEmpresaOPP = false
    }

  }

  Meses() {
    // console.log(this.mes)
    switch (this.mes) {
      case 0:
        this.MesAnio = 'Enero ' + this.aniox
        break;
      case 1:
        this.MesAnio = 'Febrero ' + this.aniox
        break;
      case 2:
        this.MesAnio = 'Marzo ' + this.aniox
        break;
      case 3:
        this.MesAnio = 'Abril ' + this.aniox
        break;
      case 4:
        this.MesAnio = 'Mayo ' + this.aniox
        break;
      case 5:
        this.MesAnio = 'Junio ' + this.aniox
        break;
      case 6:
        this.MesAnio = 'Julio ' + this.aniox
        break;
      case 7:
        this.MesAnio = 'Agosto ' + this.aniox
        break;
      case 8:
        this.MesAnio = 'Septiembre ' + this.aniox
        break;
      case 9:
        this.MesAnio = 'Octubre ' + this.aniox
        break;
      case 10:
        this.MesAnio = 'Noviembre ' + this.aniox
        break;
      case 11:
        this.MesAnio = 'Diciembre ' + this.aniox
        break;

      default:
        break;
    }
  }

  ModalCambiarMontos(modal: any) {
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  EmpresaOppSub(id: any) {
    this.xAPI.funcion = "IPOSTEL_R_EmpresaOppSub";
    this.xAPI.parametros = `${id}`
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.length >= 0) {
          this.DatosSub_OPP = data.Cuerpo.map(e => {
            this.DatosSub_OPP.push(e)
          });
        } else {
          this.DatosSub_OPP = []
        }
        // console.log(this.DatosSub_OPP)
      },
      (err) => {
        console.log(err)
      }
    )
  }


  async EmpresasLiquidadas(date1: any, date2: any) {
    this.xAPI.funcion = "IPOSTEL_R_EmpresasLiquidadas";
    this.xAPI.parametros = `${date1}` + ',' + `${date2}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.EmpresasLiquidadasResult = data.Cuerpo.length
        this.PorcentajeLiquidado = (100 * this.EmpresasLiquidadasResult) / this.EmpresasTotales
        this.recaudacionPorcentajeLiquidado = this.PorcentajeLiquidado.toFixed(2)
      },
      (err) => {
        console.log(err)
      }
    )
  }

  WebScrapring() {
    return new Promise((resolve, reject) => {
      this.httpClient.get('https://localhost/devel/api/scraping').subscribe(
        (data) => {
          console.log('Correo: ', data)
          resolve(data);
        },
        (error) => {
          console.log('Error: ', error)
          reject(error);
        }
      );
    });
  }

  async EmpresasReparos(date1: any, date2: any) {
    this.xAPI.funcion = "IPOSTEL_R_EmpresasReparos";
    this.xAPI.parametros = `${date1}` + ',' + `${date2}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.EmpresasReparosResult = data.Cuerpo.length
        this.PorcentajeReparos = (100 * this.EmpresasReparosResult) / this.EmpresasTotales
        this.recaudacionPorcentajeReparos = this.PorcentajeReparos.toFixed(2)

      },
      (err) => {
        console.log(err)
      }
    )
  }

  async TotalEmpresas() {
    this.xAPI.funcion = "IPOSTEL_R_OPP";
    this.xAPI.parametros = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        // console.log(data.Cuerpo.length)
        this.EmpresasTotales = data.Cuerpo.length
      },
      (err) => {
        console.log(err)
      }
    )
  }

  async FPOIngresos(date1: any, date2: any) {
    this.xAPI.funcion = "IPOSTEL_R_FPOIngresos";
    this.xAPI.parametros = `${date1}` + ',' + `${date2}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.forEach(e => {
          // FPO MES
          if (e.tipo_pago_pc === 1 || e.status_pc === 1) {
            // console.log(e)
            this.fpoX.push(e)
            let fpo = this.fpoX.map(item => parseInt(item.monto_pc)).reduce((prev, curr) => prev + curr, 0);
            this.fpo = this.utilService.ConvertirMoneda(fpo)
          }
          // FPO MES
          // FPO OTROS MES
          if (e.tipo_pago_pc === 6) {
            // console.log(e)
            this.fpo_OtrosMesesX.push(e)
            let fpoOtrosMeses = this.fpo_OtrosMesesX.map(item => parseInt(item.monto_pc)).reduce((prev, curr) => prev + curr, 0);
            this.fpo_OtrosMeses = this.utilService.ConvertirMoneda(fpoOtrosMeses)
          }
          // FPO OTROS MES
          // Derecho Semestral 1
          if (e.tipo_pago_pc === 2) {
            // console.log(e)
            this.derechosSemestral1X.push(e)
            let MontoSemestral1 = this.derechosSemestral1X.map(item => parseInt(item.monto_pc)).reduce((prev, curr) => prev + curr, 0);
            this.derechosSemestral1 = this.utilService.ConvertirMoneda(MontoSemestral1)
          }
          // Derecho Semestral  1
          // Derecho Semestral 2
          if (e.tipo_pago_pc === 3) {
            // console.log(e)
            this.derechosSemestral2X.push(e)
            let MontoSemestral2 = this.derechosSemestral2X.map(item => parseInt(item.monto_pc)).reduce((prev, curr) => prev + curr, 0);
            this.derechosSemestral2 = this.utilService.ConvertirMoneda(MontoSemestral2)
          }
          // Derecho Semestral  2
          // Anualidad
          if (e.tipo_pago_pc === 4) {
            // console.log(e)
            this.anualidadX.push(e)
            let anualidad = this.anualidadX.map(item => parseInt(item.monto_pc)).reduce((prev, curr) => prev + curr, 0);
            this.anualidad = this.utilService.ConvertirMoneda(anualidad)
          }
          // Anualidad
          // Subcontratistas
          if (e.tipo_pago_pc === 5) {
            // console.log(e)
            this.subcontratistasX.push(e)
            let subcontratistas = this.subcontratistasX.map(item => parseInt(item.monto_pc)).reduce((prev, curr) => prev + curr, 0);
            this.subcontratistas = this.utilService.ConvertirMoneda(subcontratistas)
          }
          // Subcontratista
          // Pagoa no liquidados
          if (e.status_pc === 1) {
            // console.log(e)
            this.pagosNoLiquidadosX.push(e)
            let pagosNoLiquidados = this.pagosNoLiquidadosX.map(item => parseInt(item.monto_pc)).reduce((prev, curr) => prev + curr, 0);
            this.pagosNoLiquidados = this.utilService.ConvertirMoneda(pagosNoLiquidados)
          }
          // Pagoa no liquidados
        });
        // console.log(data.Cuerpo)
        this.TotalPagosFPOX = data.Cuerpo
        this.totalpagosFPO = this.TotalPagosFPOX.map(item => parseInt(item.monto_pc)).reduce((prev, curr) => prev + curr, 0);
        this.IngresosTotales = this.totalpagosFPO
        let monto = this.totalpagosFPO / this.dolarx
        this.EstimadoDolar = this.utilService.ConvertirMoneda$(monto)
        this.TotalPagosFPO = this.utilService.ConvertirMoneda(this.totalpagosFPO)
        this.IngresosTotales = this.utilService.ConvertirMoneda(this.totalpagosFPO)

      },
      (err) => {
        console.log(err)
      }
    )
  }

  async FPO(date1: any, date2: any) {
    this.xAPI.funcion = "IPOSTEL_R_FPO";
    this.xAPI.parametros = `${date1}` + ',' + `${date2}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.TotalFPO = data.Cuerpo.length
        data.Cuerpo.map(e => {
          if (e.tipo_pago_pc === 1) { // Liquidados	
            this.CantidadLiquidadosX.push(e)
            this.CantidadLiquidados = this.CantidadLiquidadosX.length
          }
          if (e.monto_pc == '0' || e.monto_pagar == '0' || e.tipo_pago_pc <= 1) { // Cartas de no Movilización
            // console.log(e)
            this.CartasNoMovilizacionX.push(e)
            this.CartasNoMovilizacion = this.CartasNoMovilizacionX.length
          }
          if (e.tipo_pago_pc > 1) { // Otros Pagos
            // console.log(e)
            this.OtrosPagosX.push(e)
            this.OtrosPagos = this.OtrosPagosX.length
          }

        });
      },
      (err) => {
        console.log(err)
      }
    )
  }

  async PiezasMovilizadas(mes: any) {
    this.xAPI.funcion = "IPOSTEL_R_PiezasMovilizadas";
    this.xAPI.parametros = `${mes}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.forEach(e => {
          this.TotalServiciosCompletos.push(e)
          this.TotalServicios = this.TotalServiciosCompletos.map(item => item.cantidad_piezas).reduce((prev, curr) => prev + curr, 0);
          this.TotalPiezas = this.TotalServiciosCompletos.map(item => item.cantidad_piezas).reduce((prev, curr) => prev + curr, 0);
          if (e.id_servicio_franqueo === 1 || e.id_servicio_franqueo === 2) {
            this.TotalPiezasNacionales.push(e)
          }
          if (e.id_servicio_franqueo === 3 || e.id_servicio_franqueo === 5) {
            this.TotalPiezasIntLlegada.push(e)
          }
          if (e.id_servicio_franqueo === 4 || e.id_servicio_franqueo === 6) {
            this.TotalPiezasIntSalida.push(e)
          }
          this.ServicioNacional = this.TotalPiezasNacionales.map(item => item.cantidad_piezas).reduce((prev, curr) => prev + curr, 0);
          this.ServicioIntLlegada = this.TotalPiezasIntLlegada.map(item => item.cantidad_piezas).reduce((prev, curr) => prev + curr, 0);
          this.ServicioIntSalida = this.TotalPiezasIntSalida.map(item => item.cantidad_piezas).reduce((prev, curr) => prev + curr, 0);
        });
      },
      (err) => {
        console.log(err)
      }
    )
  }


  async GenerarReporteLiquidacionFPO() {
    this.sectionBlockUI.start('Generando Reporte de Liquidación P.F.O, por favor Espere!!!');
    let mes = this.mes_consultar
    let mes1 = this.mes_consultar + '-' + '01'
    let mes2 = this.mes_consultar + '-' + '31'
    await this.TotalEmpresas()
    await this.EmpresasLiquidadas(mes1, mes2)
    await this.EmpresasReparos(mes1, mes2)
    await this.FPO(mes1, mes2)
    await this.FPOIngresos(mes1, mes2)
    await this.PiezasMovilizadas(mes)
    await this.sectionBlockUI.stop()
    // this.utilService.alertConfirmMini('success', 'Reporte de Liquidacion P.P.O Descagado Exitosamente')
  }

  async EmpresaRIF(id: any) {
    this.xAPI.funcion = "IPOSTEL_R_empresa_id";
    this.xAPI.parametros = `${id}`
    this.DataEmpresa = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.DataEmpresa.push(data.Cuerpo);
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async Precio_Dolar_Petro() {
    this.xAPI.funcion = "IPOSTEL_R_PRECIO_PETRO_DOLAR";
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.EstimadoDolar = e.dolar
          this.EstimadoPetro = e.petro_bolivares
          this.I_UpdateMontosPetroDolar.petro = e.petro
          this.I_UpdateMontosPetroDolar.dolar = e.dolar
          this.I_UpdateMontosPetroDolar.petro_bolivares = e.petro_bolivares
          this.dolarx = e.dolar
          // this.petrox = e.petro
          // this.bolivaresx = e.petro_bolivares
          this.dolar = this.utilService.ConvertirMoneda(e.dolar)
          this.petro = this.utilService.ConvertirMoneda$(e.petro)
          this.bolivares = this.utilService.ConvertirMoneda(e.petro_bolivares)
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async UpdateMontos() {
    this.I_UpdateMontosPetroDolar.id_pd = 1
    // this.I_UpdateMontosPetroDolar.petro = this.petrox
    // this.I_UpdateMontosPetroDolar.dolar = this.dolarx
    // this.I_UpdateMontosPetroDolar.petro_bolivares = this.bolivaresx

    this.xAPI.funcion = "IPOSTEL_U_PRECIO_PETRO_DOLAR";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.I_UpdateMontosPetroDolar)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo === 1) {
          this.utilService.alertConfirmMini('success', 'Montos Actualizados Exitosamente!')
          this.modalService.dismissAll('Close')
          this.Precio_Dolar_Petro()
        } else {
          this.utilService.alertConfirmMini('error', 'Oops lo sentimos, algo salio mal!')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async GenerarCertificadoInscripcion() {
    // console.log(this.anio)
    this.CrearCert.usuario = this.token.Usuario[0].id_opp
    this.CrearCert.token = this.utilService.TokenAleatorio(10),
      this.CrearCert.type = 1,
      // this.CrearCert.created_user = this.utilService.FechaActual()
      // 1 CERTIFICADO UNICO OPP
      // 2 AUTORIZACION UNICA  SUB
      this.CrearCert.created_user = this.token.Usuario[0].id_opp
    this.xAPI.funcion = "IPOSTEL_C_Certificados";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.CrearCert)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.sectionBlockUI.start('Generando Certificado, por favor Espere!!!');
        this.n_curp = data.msj + '-IP' + this.aniox
        if (data.tipo === 1) {
          var id = this.CrearCert.token
          let ruta: string = btoa('https://sirp.ipostel.gob.ve/app/#/certificate');
          this.apiService.GenQR(id, ruta).subscribe(
            (data) => {
              //console.log(data)
              // INSERT API
              this.apiService.LoadQR(id).subscribe(
                (xdata) => {
                  var sdata = this.DataEmpresa[0]
                  //console.log(xdata)
                  this.pdf.CertificadoInscripcion(sdata[0], xdata.contenido, this.CrearCert.token, this.n_curp)
                  this.sectionBlockUI.stop()
                  this.utilService.alertConfirmMini('success', 'Certificado Descagado Exitosamente')
                },
                (error) => {
                  console.log(error)
                }
              )
            },
            (error) => {
              console.log(error)
            }
          )
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! Algo salio mal, intente de nuevo')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async GenerarAutorizacionInscripcion() {
    this.CrearCert.usuario = this.token.Usuario[0].id_opp
    this.CrearCert.created_user = this.token.Usuario[0].id_opp
    this.CrearCert.token = this.utilService.TokenAleatorio(10),
      this.CrearCert.type = 2,
      // 1 CERTIFICADO UNICO OPP
      // 2 AUTORIZACION UNICA  SUB
      this.CrearCert.created_user = this.token.Usuario[0].id_opp
    this.xAPI.funcion = "IPOSTEL_C_Certificados";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.CrearCert)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.sectionBlockUI.start('Generando Autorización, por favor Espere!!!');
        this.n_curp = data.msj + '-IP' + this.aniox
        if (data.tipo === 1) {
          var id = this.CrearCert.token
          let ruta: string = btoa('https://sirp.ipostel.gob.ve/app/#/certificate');
          this.apiService.GenQR(id, ruta).subscribe(
            (data) => {
              // INSERT API
              this.apiService.LoadQR(id).subscribe(
                (xdata) => {
                  var sdata = this.DatosSub_OPP
                  this.pdf.AutorizacionInscripcion(data, xdata.contenido, this.CrearCert.token, this.n_curp)
                  this.sectionBlockUI.stop()
                  this.utilService.alertConfirmMini('success', 'Autorización Descagada Exitosamente')
                },
                (error) => {
                  console.log(error)
                }
              )
            },
            (error) => {
              console.log(error)
            }
          )
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! Algo salio mal, intente de nuevo')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }


}
