import { Injectable, EventEmitter } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { UtilService } from '@core/services/util/util.service';
import * as XLSX from 'xlsx'; // Importa la librería xlsx


@Injectable({
    providedIn: 'root'
})


export class MobilizationPartsService {

    listaActualizada: EventEmitter<void> = new EventEmitter<void>();
    listaActualizadaTarifas: EventEmitter<void> = new EventEmitter<void>();


    public xAPI: IAPICore = {
        funcion: '',
        parametros: '',
        valores: {},
    };

    constructor(
        private apiService: ApiService,
        private utilService: UtilService,
    ) { }


    borrarRegistro(index: number) {
        let registros = JSON.parse(sessionStorage.getItem('movilizacion') || '[]');
        registros.splice(index, 1);
        sessionStorage.setItem('movilizacion', JSON.stringify(registros));
        this.listaActualizada.emit();
    }

    agregarRegistro(nuevoRegistro: any) {
        let registros = JSON.parse(sessionStorage.getItem('movilizacion') || '[]');
        registros.push(nuevoRegistro);
        sessionStorage.setItem('movilizacion', JSON.stringify(registros));
        this.listaActualizada.emit();
    }


    agregarRegistroTarifas(nuevoRegistro: any) {
        let registros = JSON.parse(sessionStorage.getItem('tarifas') || '[]');
        registros.push(nuevoRegistro);
        sessionStorage.setItem('tarifas', JSON.stringify(registros));
        this.listaActualizadaTarifas.emit();
    }

    borrarRegistroTarifas(index: number) {
        let registros = JSON.parse(sessionStorage.getItem('tarifas') || '[]');
        registros.splice(index, 1);
        sessionStorage.setItem('tarifas', JSON.stringify(registros));
        this.listaActualizadaTarifas.emit();
    }

    async SubirArchivoLoteXLS(file: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const range = XLSX.utils.decode_range(worksheet['!ref']);
                const combinedValues = [];
                for (let R = range.s.r + 1; R <= range.e.r; R++) {
                    const rowValues = {
                        id_servicio_franqueo: worksheet[XLSX.utils.encode_cell({ c: 0, r: R })]?.v || null,
                        id_peso_envio: worksheet[XLSX.utils.encode_cell({ c: 1, r: R })]?.v || null,
                        descripcion: worksheet[XLSX.utils.encode_cell({ c: 2, r: R })]?.v || null,
                        montopmvp: worksheet[XLSX.utils.encode_cell({ c: 3, r: R })]?.v || null,
                    };
                    combinedValues.push(rowValues);
                }
                resolve(combinedValues)
                reader.onerror = (error) => {
                    reject(error);
                };
            };
            reader.readAsArrayBuffer(file);
        });
    }

    /*
        Este servicio se encarga de Agregar Agencia
        a la OPP que tenga la sesion iniciada
    */
    async AgregarMovilizacionPiezas(piezas: any): Promise<string> {
        return new Promise((resolve, reject) => {
            this.xAPI.funcion = "IPOSTEL_C_MovilizacionPiezas";
            this.xAPI.parametros = ''
            this.xAPI.valores = JSON.stringify(piezas)
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

    async EliminarMovilizacionPiezas(id: any): Promise<string> {
        return new Promise((resolve, reject) => {
            this.xAPI.funcion = "IPOSTEL_D_DeclaracionPiezas";
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



    async DeclararMovilizacionPiezas(declarar: any): Promise<string> {
        return new Promise((resolve, reject) => {
            this.xAPI.funcion = "IPOSTEL_C_PagosDeclaracionOPP_SUB";
            this.xAPI.parametros = ''
            this.xAPI.valores = JSON.stringify(declarar)
            this.apiService.Ejecutar(this.xAPI).subscribe(
                (data) => {
                    if (data.tipo == 1) {
                        resolve(data.msj)
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

    async UpdateMovilizacionPiezas(declarar: any): Promise<string> {
        return new Promise((resolve, reject) => {
            this.xAPI.funcion = "IPOSTEL_U_MovilizacionPiezasIdFacturaX";
            this.xAPI.parametros = `${declarar.id_factura},${declarar.id_opp},${declarar.mes}`
            this.xAPI.valores = ''
            // this.xAPI.valores = JSON.stringify(declarar)
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


    processCsvData(csvData: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let lines = csvData.split('\n');
            let result = [];

            let headers = lines[0].split(';').map(header => {
                switch (header.trim()) {
                    case 'DESCRIPCIÓN DE TARIFA': return 'descripcion';
                    case 'MONTO PMVP': return 'montopmvp';
                    case 'PESO DE ENVIO': return 'id_peso_envio';
                    case 'SERVICIO DE FRANQUEO': return 'id_servicio_franqueo';
                    default: return header.trim();
                }
            });
            let cantidad = lines.length
            for (let i = 1; i < cantidad; i++) {
                if (lines[i] !== '') {
                    let obj = {};
                    let currentLine = lines[i].split(';');

                    for (let j = 0; j < headers.length; j++) {
                        obj[headers[j]] = currentLine[j]; // Asignar valores a los campos basándose en los encabezados reemplazados
                    }

                    result.push(obj);
                }
            }

            if (result.length > 0) {
                resolve(result); // Resuelve la promesa con el array de objetos con los nombres de campo y encabezados reemplazados
            } else {
                reject('No se encontraron datos válidos en el archivo CSV');
            }
        });
    }


}
