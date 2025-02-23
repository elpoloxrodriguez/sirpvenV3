import { Injectable } from '@angular/core';
import { ApiService, IAPICore } from './apicore/api.service';
import { UtilService } from './util/util.service';

@Injectable({
    providedIn: 'root'
})

export class GenerarPagoService {

    public xAPI: IAPICore = {
        funcion: '',
        parametros: '',
        valores: {},
    };

    constructor(
        private apiService: ApiService,
        private utilService: UtilService,
    ) { }

    /*
        Este servicio se encarga de generarle el recibo de pago
        a/los OPP que seleccione en el formulario.
    */
    async GuardarCreacionRecaudacionIndividual(IpagarRecaudacion: any): Promise<string> {
        return new Promise((resolve, reject) => {
            this.xAPI.funcion = "IPOSTEL_C_PagosDeclaracionOPP_SUB";
            this.xAPI.parametros = ''
            this.xAPI.valores = JSON.stringify(IpagarRecaudacion)
            this.apiService.Ejecutar(this.xAPI).subscribe(
                (data) => {
                    if (data.tipo == 1) {
                        resolve(data)
                    } else {
                        reject(data)
                    }
                },
                (error) => {
                    console.log(error)
                    reject(error)
                }
            )
        });
    }


        /*
        Este servicio se encarga de Actualizar generarle el recibo de pago
        a/los OPP que seleccione en el formulario.
    */
        async UpdateCreacionRecaudacionIndividual(pagarRecaudacion: any): Promise<string> {
            return new Promise((resolve, reject) => {
                this.xAPI.funcion = "IPOSTEL_U_PagosDeclaracionOPP_SUB";
                this.xAPI.parametros = ''
                this.xAPI.valores = JSON.stringify(pagarRecaudacion)
                this.apiService.Ejecutar(this.xAPI).subscribe(
                    (data) => {
                        if (data.tipo == 1) {
                            resolve(data)
                        } else {
                            reject(data)
                        }
                    },
                    (error) => {
                        console.log(error)
                        reject(error)
                    }
                )
            });
        }


        async PagarFacturaMantenimiento(pagarRecaudacion: any): Promise<string> {
            return new Promise((resolve, reject) => {
                this.xAPI.funcion = "IPOSTEL_U_Pagos_Mantenimiento";
                this.xAPI.parametros = ''
                this.xAPI.valores = JSON.stringify(pagarRecaudacion)
                this.apiService.Ejecutar(this.xAPI).subscribe(
                    (data) => {
                        if (data.tipo == 1) {
                            resolve(data)
                        } else {
                            reject(data)
                        }
                    },
                    (error) => {
                        console.log(error)
                        reject(error)
                    }
                )
            });
        }


    /*
        Este servicio se encarga de Eliminar el recibo de pago
        al OPP que seleccione.
    */
    async EliminarCreacionRecaudacion(id: any): Promise<string> {
        return new Promise((resolve, reject) => {
            this.xAPI.funcion = "IPOSTEL_D_PagosDeclaracion";
            this.xAPI.parametros = `${id}`
            this.xAPI.valores = ''
            this.apiService.Ejecutar(this.xAPI).subscribe(
                (data) => {
                    if (data.tipo == 1) {
                        resolve(data)
                    } else {
                        reject(data)
                    }
                },
                (error) => {
                    console.log(error)
                    reject(error)
                }
            )
        });
    }



}
