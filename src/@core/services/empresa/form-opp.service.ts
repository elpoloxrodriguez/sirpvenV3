import { Injectable } from '@angular/core';

// Filatelia 
export interface FilateliaCrear {
	TipoEstampilla: any,
	ValorEstampilla: undefined,
	CostoEstampilla: number,
	TipoReceptorEstampilla
	ReceptorEstampilla: undefined,
	ObservacionEstampilla: string,
	TokenTiraje: string,
	status: number,
	Qr: string
}

export interface CambiarClave {
	id_opp: number,
	password: string
}

export interface CargaMasiva {
	llave: string;
	nombre: string;
	funcion: string;
	ruta: string; //cencrypt
	pdf: string; //cencrypt
	file: string; //cencrypt
	csv: string; //cencrypt
	log: string;
	estatus: number;
	usuario: string;
}


export interface GuardarQRs {
	tipo: number,
	valor: number,
	tipoReceptor: number,
	receptor: number
	costo: number,
	correlativo: number,
	observacion: string,
	tiraje: string,
	QR: any,
	userCreated: number,
	dateCreated: string
}

export interface FranqueoPostalPrevio {
	id?: any
	id_opp: any
	tipo: any
	cantidad: any
	status: any
	observacion: string
	created_user?: any
	created_date?: any
	updated_user?: any
	updated_date?: any
}


export interface QrContenido {

}


//  recaptcha
export interface UserRegistrationModel {
	UserName: string;
	UserEmailId: string;
	password: string;
	confirmPassword: string;
}

export interface IPOSTEL_C_OPP {
	nombre_empresa: string
	rif: string
	role?: number
	password: string
	status: number
	tipo_registro: number
	opp?: number
	direccion_empresa: string
	estado_empresa?: string
	ciudad_empresa?: string
	municipio_empresa?: string
	parroquia_empresa?: string
	correo_electronico: string
	empresa_facebook: string
	empresa_instagram: string
	empresa_twitter: string
	tipo_agencia?: number
	sucursales?: number
	subcontrataciones?: number
	tipologia_empresa?: number
	tipo_servicio: string
	especificacion_servicio: string
	licencia_actividades_economicas_municipales: string
	actividades_economicas_seniat: string
	certificado_rupdae: string
	patronal_ivss: string
	matricula_inces: string
	identificacion_laboral_ministerio_trabajo: string
	certificado_eomic: string
	permiso_bomberos: string
	registro_sapi: string
	registro_nacional_contratista: string
	flota_utilizada: string
	cantidad_trabajadores?: number
	cantidad_subcontratados?: number
}

export interface IPOSTEL_C_RepresentanteLegal {
	id_opp: number
	n_registro: string
	fecha_registro: string
	tomo: string
	n_registro_contrato: string
	fecha_registro_contrato: string
	tomo_contrato: string
	nombres_representante_legal: string
	apellidos_representante_legal: string
	cedula_representante_legal: string
	direccion_representante_legal: string
	email_representante_legal: string
	facebook_representante_legal: string
	instagram_representante_legal: string
	twitter_representante_legal: string
	cargo_representante_legal: string
	telefono_movil_representante_legal: string
	telefono_residencial_representante_legal: string
}


export interface IPOSTEL_C_DelegadoOPP {
	id_opp?: number
	nombres_delegado: string
	apellidos_delegado: string
	cedula_delegado: string
	cargo_delegado: string
	telefono_delegado: string
	email_delegado: string
	facebook_delegado: string
	instagram_delegado: string
	twitter_delegado: string
}


export interface IPOSTEL_C_ConexionFlotaUtilizada {
	id_opp_sub: number
	vehiculo_liviano: number
	camionetas: number
	camion_350: number
	camion_750: number
	camion_3_ejes: number
	camion_4_ejes: number
	camion_5_ejes: number
	camion_6_ejes: number
	buques: number
	aviones: number
	avionetas: number
	containers: number
	motos: number
	bicicletas: number
	autobuses: number
}


export interface ICrearCertificados {
	usuario: number
	token: string
	type: number
	created_user: number
}


export interface IPOSTEL_C_Peso_Envio_Franqueo {
	id_opp: number
	descripcion: string
	id_peso_envio?: number
	pmvp: any
	iva: any
	status_pef: number
	tasa_postal: any
	total_pagar: any
	mes: string
	id_servicio_franqueo: number
	user_created: number
}

export interface IPOSTEL_U_ResetPassword { // Resetar la contraseña del usuario
	password: string
	correo_electronico: string
}


export interface IPOSTEL_DATA_EMPRESA_ID { // Leer EMpresa OPP segun ID
	id_opp: any,
	nombre_empresa: any,
	rif: any,
	role: any,
	status_empresa: any,
	tipo_registro: any,
	opp: any,
	direccion_empresa: any,
	estado_empresa: any,
	municipio_empresa: any,
	ciudad_empresa: any,
	parroquia_empresa: any,
	correo_electronico: any,
	empresa_facebook: any,
	empresa_instagram: any,
	empresa_twitter: any,
	tipo_agencia: any,
	nombre_tipo_agencia: any,
	sucursales: any,
	subcontrataciones: any,
	tipologia_empresa: any,
	nombre_tipologia: any,
	tipo_servicio: any,
	especificacion_servicio: any,
	licencia_actividades_economicas_municipales: any,
	actividades_economicas_seniat: any,
	certificado_rupdae: any,
	patronal_ivss: any,
	matricula_inces: any,
	identificacion_laboral_ministerio_trabajo: any,
	certificado_eomic: any,
	permiso_bomberos: any,
	registro_sapi: any,
	registro_nacional_contratista: any,
	flota_utilizada: any,
	cantidad_trabajadores: any,
	cantidad_subcontratados: any
}

export interface IPOSTEL_DATA_REPRESENTANTE_LEGAL_ID { // Leer Representante legal 
	apellidos_representante_legal: any
	cargo_representante_legal: any
	cedula_representante_legal: any
	direccion_representante_legal: any
	email_representante_legal: any
	facebook_representante_legal: any
	fecha_registro: any
	id_opp: any
	id_representante_legal: any
	instagram_representante_legal: any
	n_registro: any
	nombres_representante_legal: any
	telefono_movil_representante_legal: any
	telefono_residencial_representante_legal: any
	tomo: any
	twitter_representante_legal: any
	fecha_registro_contrato: any
	tomo_contrato: any
	n_registro_contrato: any
}

export interface IPOSTEL_DATA_DELEGADOP_ID {
	apellidos_delegado: any
	cargo_delegado: any
	cedula_delegado: any
	email_delegado: any
	facebook_delegado: any
	id_delegado: any
	id_opp: any
	instagram_delegado: any
	nombres_delegado: any
	telefono_delegado: any
	twitter_delegado: any
}

export interface IPOSTEL_U_Status_Opp_Sub { // Cambiar Status OPP y/o SUBCONTRATISTA
	id_suc: number
	status_agencia: number
	observacion: string
}


export interface IPOSTEL_C_MovilizacionPiezas { //  insertar movilizacion de piezas
	id_opp: number
	id_servicio_franqueo: number
	id_peso_envio: number
	tarifa_servicio: any
	porcentaje_tarifa: any
	monto_fpo: any
	mes: string
	cantidad_piezas: number
	monto_causado: any
	user_created: number
}


export interface IPOSTEL_U_DatosDelegados { // Actualizar Datos de Delegado OPP - SUB
	nombres_delegado: string
	apellidos_delegado: string
	cedula_delegado: string
	cargo_delegado: string
	telefono_delegado: string
	email_delegado: string
	facebook_delegado: string
	instagram_delegado: string
	twitter_delegado: string
	id_opp: number
}

export interface IPOSTEL_U_DatosRepresentanteLegal {  // Actualizar Datos de Representante Legal OPP - SUB
	n_registro: string
	fecha_registro: string
	tomo: string
	n_registro_contrato: string
	fecha_registro_contrato: string
	tomo_contrato: string
	nombres_representante_legal: string
	apellidos_representante_legal: string
	cedula_representante_legal: string
	direccion_representante_legal: string
	email_representante_legal: string
	facebook_representante_legal: string
	instagram_representante_legal: string
	twitter_representante_legal: string
	cargo_representante_legal: string
	telefono_movil_representante_legal: string
	telefono_residencial_representante_legal: string
	id_opp: number
}


export interface IPOSTEL_U_OPP_ID { // Actualizar datos generales de OPP
	nombre_empresa: string
	rif: string
	direccion_empresa: string
	estado_empresa: string
	ciudad_empresa: string
	municipio_empresa: string
	parroquia_empresa: string
	correo_electronico: string
	empresa_facebook: string
	empresa_instagram: string
	empresa_twitter: string
	tipo_agencia: number
	sucursales: number
	subcontrataciones: number
	tipologia_empresa: number
	tipo_servicio: string
	especificacion_servicio: string
	licencia_actividades_economicas_municipales: string
	actividades_economicas_seniat: string
	certificado_rupdae: string
	patronal_ivss: string
	matricula_inces: string
	identificacion_laboral_ministerio_trabajo: string
	certificado_eomic: string
	permiso_bomberos: string
	registro_sapi: string
	registro_nacional_contratista: string
	flota_utilizada: string
	cantidad_trabajadores: number
	cantidad_subcontratados: number
	id_opp: number
}



export interface IPOSTEL_C_PagosDeclaracionOPP_SUB { // INSERTAR PAGO EN RECAUDACION
	id_opp: number
	status_pc: number
	declaracion?: number
	tipo_pago_pc: number
	monto_pc: string
	observacion_pc?: string
	fecha_pc: string
	monto_pagar: string
	dolar_dia: string
	petro_dia: string
	archivo_adjunto: any
	user_created: number
	mantenimiento: string
}

export interface IPOSTEL_RegistrarSucursalSUB {
	id_suc?: number,
	id_sub: number,
	nombre_empresa?: string,
	rif_empresa?: string,
	estado_empresa: string,
	ciudad_empresa: string,
	municipio_empresa: string,
	parroquia_empresa: string,
	zona_empresa: string,
	tipo_sub: number
}

export interface TablaMatrixSUBCONTRATO {
	id_sub: number,
	id_opp: number
}

export interface IPOSTEL_U_PagosDeclaracionOPP_SUB { // ACTUALIZA PAGO EN RECAUDACION
	status_pc: any
	fecha_pc: string
	id_banco_pc: any
	referencia_bancaria: string
	monto_pc: any
	monto_pagar: any
	dolar_dia: string
	petro_dia: string
	archivo_adjunto: any
	observacion_pc: string
	user_created: any
	user_updated: any
	id_pc: number
}

export interface IPOSTEL_U_Pagos_Mantenimiento { // ACTUALIZA PAGO EN MANTENIMIENTO
	status: any
	tipo_pago: any
	fecha: string
	id_banco: any
	referencia_bancaria: string
	cedula_rif_banco: string
	telefono_banco: string
	monto_pagar: any
	monto_pagado: any
	dolar_dia: string
	archivo_adjunto: any
	observacion: string
	user_created: any
	user_updated: any
	date_updated: any
	id: number
}


export interface IPOSTEL_I_OtorgamientoConcesion { // INSERTAR REGISTRO PARA OTORGAMIENTO POSTAL
	id_opp: any
	status_curp: any
	punto_cuenta_curp: any
	fecha_punto_cuenta_curp: any
	concesion_postal_curp: any
	tiempo_concesion: any
	n_contrato_curp: any
	periodo_contrato_curp: any
	n_archivo_curp: any
	tomo_archivo_curp: any
	fecha_archivo_curp: any
	user_created: any
}

export interface IPOSTEL_U_CambiarStatusOPPSUB { //Cambiar estatus de empresa de los opp y sub
	status_empresa: number
	observacion: string
	periodo_contrato_curp ?: string
	id_opp: number
}


export interface IPOSTEL_U_ListaTarifasOppAutorizacion { // actualizar lista de tarifas de franqueo opp
	status_pef: number
	id_peso_envio: any
	descripcion: string
	pmvp: string
	iva: string
	tasa_postal: string
	total_pagar: string
	mes: string
	id_servicio_franqueo: number
	user_updated: number
	id_pef: number
}


export interface IPOSTEL_U_ActualizarMovilizacionPiezas { // modificar datos de movilizacion de piezas
	id_opp: number
	id_factura: number
	id_servicio_franqueo: number
	id_peso_envio: number
	tarifa_servicio: string
	porcentaje_tarifa: number
	monto_fpo: string
	mes: string
	cantidad_piezas: number
	monto_causado: string
	user_updatede: number
	id_movilizacion_piezas: number
}


export interface IPOSTEL_U_TarifasFranqueo { // Actualizar tarifa de franqueo
	status_pef: number
	id_peso_envio: number
	pmvp: string
	iva: string
	tasa_postal: string
	descripcion: string
	total_pagar: string
	mes: string
	id_servicio_franqueo: number
	user_updated: number
	id_pef: number
}

export interface IPOSTEL_U_MovilizacionPiezasIdFactura { // Asignar ID Factura a Movilizacion de Piezas
	id_factura: number
	id_movilizacion_piezas: number
}

export interface IPOSTEL_U_PRECIO_PETRO_DOLAR { // Actualizar montos de petro dolar y bolivares
	petro: string
	dolar: string
	petro_bolivares: string
	id_pd: number
}

// Registrar Enseñar al CHATBOOT
export interface CHATBOOT_C_AsistenteVirtual {
	id: number
	idio: string
	tipo: string
	clas: string
	preg: string
	resp: string
	obse: string
}
export interface CHATBOOT_U_AsistenteVirtual {
	idio: string
	tipo: string
	clas: string
	preg: string
	resp: string
	obse: string
	id: number
}

export interface IPOSTEL_C_UsuarioAdmin {
	email: string
	role: number
	id_user: number
	status: number
	password: string
	nombres_user: string
	apellidos_user: string
	cedula_user: string
	created_user: number
	created_date: string
}

export interface IPOSTEL_U_UsuarioAdmim {
	email: string
	role: number
	status: number
	nombres_user: string
	apellidos_user: string
	cedula_user: string
	updated_user: number
	updated_date: string
	id_user: number
}


@Injectable({
	providedIn: 'root'
})
export class EmpresaService {

	constructor() { }
}
