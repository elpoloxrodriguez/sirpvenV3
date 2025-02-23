import { Injectable } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { UtilService } from '@core/services/util/util.service';

@Injectable({
    providedIn: 'root'
})

export class BusinessService {

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
    async CambiarEstatusSubcontratista(status: any): Promise<string> {
        return new Promise((resolve, reject) => {
            this.xAPI.funcion = "IPOSTEL_U_Status_Opp_Sub";
            this.xAPI.parametros = ''
            this.xAPI.valores = JSON.stringify(status)
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
