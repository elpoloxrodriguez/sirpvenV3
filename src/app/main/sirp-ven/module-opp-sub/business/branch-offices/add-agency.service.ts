import { Injectable } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { UtilService } from '@core/services/util/util.service';

@Injectable({
    providedIn: 'root'
})

export class AddAgencyService {

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
        Este servicio se encarga de Agregar Agencia
        a la OPP que tenga la sesion iniciada
    */
    async AgregarAgencia(agencia: any): Promise<string> {
        return new Promise((resolve, reject) => {
            this.xAPI.funcion = "IPOSTEL_C_Sucursales_SUB";
            this.xAPI.parametros = ''
            this.xAPI.valores = JSON.stringify(agencia)
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

    async EliminarAgencia(agencia: any): Promise<string> {
        return new Promise((resolve, reject) => {
            this.xAPI.funcion = "IPOSTEL_D_Sucursales_SUB";
            this.xAPI.parametros = `${agencia}`
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


    async AgregarSubcontrato(subcontrato: any): Promise<string> {
        return new Promise((resolve, reject) => {
            this.xAPI.funcion = "IPOSTEL_C_Subcontrato_SUB";
            this.xAPI.parametros = ''
            this.xAPI.valores = JSON.stringify(subcontrato)
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
