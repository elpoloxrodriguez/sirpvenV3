import { Injectable, OnInit } from '@angular/core';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { ApiService, IAPICore } from '../apicore/api.service';
import { UtilService } from '../util/util.service';


@Injectable({
  providedIn: 'root'
})


export class PdfService {


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };


  public TotalPagarFactura
  public rowsFacturas = []
  public Nacional
  public InternacionalLlegada
  public InternacionalSalida
  public TotalFactura
  public Nacionalx = []
  public InternacionalLlegadax = []
  public InternacionalSalidax = []
  public tempDataRowsFacturas = []

  public tempMantenimiento = []
  public tempSeguridad = []

  public MontoTotalFactura

  public MontoTotalP
  public MontoTotalPetro

  public MontoSeguridad
  public MontoMantenimiento

  public DolarPetroDia = []

  public fechas = new Date();
  public mes = this.fechas.getMonth() + 1;
  public anio = this.fechas.getFullYear();

  public valor0
  public valor1
  constructor(
    private utilService: UtilService,
    private apiService: ApiService,
  ) { }






  CertificadoInscripcion(data: any, Qr: any, TokenQr: any, n_curp: any) {
    const fecha = this.utilService.FechaActual()
    const FechaActual = new Date(this.utilService.FechaActual())
    const doc = new jsPDF();
    var fechax = fecha
    var nueva = fechax.split(" ")[0].split("-").reverse().join("/");

    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.setProperties({
      title: "CERTIFICADO DE INSCRIPCIÓN SIRP-IPOSTEL",
      subject: "https://sirp.ipostel.gob.ve",
      author: "SIRP-IPOSTEL",
      keywords: "generated, javascript, web 2.0, ajax",
      creator: "CAP. ANDRÉS RICARDO RODRÍGUEZ DURÁN",
    });

    doc.addImage('assets/images/pdf/cintillo.png', "PNG", 5, 5, 200, 15);
    // doc.addImage('assets/images/pdf/firma.png', "PNG", 80, 240, 65, 45);
    // doc.addImage('assets/images/pdf/sello.png', "PNG", 110, 220, 60, 60);
    // if (data.periodo_contrato_curp <= nueva) {
    //   doc.addImage('assets/images/pdf/vencido.png', "PNG", 30, 140, 140, 140);
    // } 
    doc.addImage('assets/images/pdf/marca-agua.png', "PNG", 25, 115, 160, 60);
    doc.addImage(Qr, "PNG", 170, 255, 30, 30);


    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(`N° O-OPP${n_curp} `, pageWidth - 178, pageHeight - 260, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(`Caracas, ${this.utilService.FechaMomentLL(fecha)}`, pageWidth - 40, pageHeight - 260, { align: 'center' });



    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("CERTIFICADO ÚNICO DE REGISTRO POSTAL", pageWidth / 2, pageHeight - 240, { maxWidth: 150, align: "center" });


    doc.setFont(undefined, "");
    doc.setFontSize(12);
    doc.text(`    El INSTITUTO POSTAL TELEGRÁFICO DE VENEZUELA, ente adscrito al Ministerio del Poder Popular para Ciencia y Tecnología, creado mediante Ley Publicada en la Gaceta Oficial de la República Bolivariana de Venezuela N° 2.146 Extraordinario, de fecha 28 de enero de 1978, reformada parcialmente según Decreto N° 403, de fecha 21 de Octubre de 1999, Publicada en la Gaceta Oficial de la República Bolivariana de Venezuela N° 5.398 Extraordinario, de fecha 26 de Octubre de 1999; el cual en lo sucesivo se denominará IPOSTEL, representado en este acto por su Presidenta, Msc. OLGA YOMIRA PEREIRA JAIMES, Venezolana, mayor de edad, de este domicilio, titular de la Cédula de Identidad N° V-14.551.754, designada por Decreto Presidencial de la República Bolivariana de Venezuela N° 3.877 del 21 de Junio de 2019, Publicada en la Gaceta Oficial de la República Bolivariana de Venezuela N° 41.660, de fecha 21 de Junio de 2019, quien actúa en ejercicio de las atribuciones que le confiere el articulo 17 literal “e” de la Ley antes citada y bajo Autorización del Directorio de IPOSTEL, según Punto de cuenta N° ${data.punto_cuenta_curp} de Fecha ${this.utilService.FechaMomentLL(data.fecha_punto_cuenta_curp)}, en concordancia con el artículo 1° y 6° numeral “2°” del Reglamento sobre Concesión de los Servicios de Correos, OTORGA mediante el presente Acto Unilateral, CONCESIÓN POSTAL N° ${data.concesion_postal_curp} para la Prestación de Servicios Postales y Telegráficos, a la Sociedad Mercantil ${data.nombre_empresa}, RIF ${data.rif} debidamente Inscrita por ante el Registro Mercantil ${data.n_registro}, en fecha ${this.utilService.FechaMomentLL(data.fecha_registro)}, anotado bajo el N° Tomo ${data.tomo} , cumplido como han sido los requisitos formales y sustanciales que para estos casos exigen las Leyes de la República en esta Materia. La Presente Concesión solo se perfeccionará con la suscripción del Contrato de Concesión, que para los efectos legales será el Contrato N° ${data.n_contrato_curp} para el Período ${data.periodo_contrato_curp}, el cual contiene las condiciones y términos dictadas por IPOSTEL como ente regulador exclusivo y excluyente de los servicios postales del Correo de Venezuela. El Lapso para que la Concesionaria suscriba el contrato con IPOSTEL, no podrá exceder de Veinte (20) días hábiles, contados a partir del presente Otorgamiento. Transcurrido dicho plazo sin que se perfeccione el mismo, quedara revocada la concesión de pleno Derecho, en salvaguarda de los derechos que le asistan a IPOSTEL en la prestación de un Servicio de carácter público, continuo, seguro y confiable a favor de los Usuarios y Usuarias de los Servicios postales y telegráficos en el País.`,
      14,
      70,
      { maxWidth: 185, align: "justify" }
    );


    doc.setFont(undefined, "");
    doc.setFontSize(12);
    doc.text(`  Queda la Sociedad Mercantil ${data.nombre_empresa} inserta en los Libros de Registro
del Archivo Postal de Operadoras Privadas llevados por la Dirección de Gestión Postal de
IPOSTEL bajo el N° ${data.n_archivo_curp} Tomo ${data.tomo_archivo_curp} de Fecha ${this.utilService.FechaMomentLL(data.fecha_archivo_curp)} a los efectos de Ley.`,
      14,
      205,
      { maxWidth: 185, align: "justify" }
    );


    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text(`CERTIFICADO VALIDO HASTA: ${data.periodo_contrato_curp}`, 15, 240, { align: "justify" });



    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Msc. OLGA YOMIRA PEREIRA JAIMES", 105, 275, { align: "center" });
    doc.setFontSize(10);
    doc.setFont(undefined, "");
    doc.text("PRESIDENTA (E) del Instituto Postal Telegráfico de Venezuela IPOSTEL", 105, 280, { align: "center" });
    doc.setFontSize(9);
    doc.text("Según Decreto Presidencial N° 3.877 del 21/06/2019,", 105, 285, { align: "center" });
    doc.setFontSize(9);
    doc.text("Publicada en la Gaceta Oficial N° 41.660, de fecha 21 de Junio de 2019.", 105, 290, { align: "center" });


    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text(TokenQr,
      175,
      285,
    );

    doc.save(`Certificado Uníco de Inscripción ${data.nombre_empresa} - ${data.rif}.pdf`);
    doc.autoPrint();
    // doc.output("dataurlnewwindow", { filename: 'Certificado Uníco de Inscripción.pdf' });
  }

  AutorizacionInscripcion(data: any, Qr: any, TokenQr: any, n_curp: any) {
    // console.log(data)
    const fecha = this.utilService.FechaActual()
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.setProperties({
      title: "CERTIFICADO DE INSCRIPCIÓN SIRP-IPOSTEL",
      subject: "https://sirp.ipostel.gob.ve",
      author: "SIRP-IPOSTEL",
      keywords: "generated, javascript, web 2.0, ajax",
      creator: "CAP. ANDRÉS RICARDO RODRÍGUEZ DURÁN",
    });

    doc.addImage('assets/images/pdf/cintillo.png', "PNG", 5, 5, 200, 15);
    // doc.addImage('assets/images/pdf/firma.png', "PNG", 80, 240, 65, 45);
    // doc.addImage('assets/images/pdf/sello.png', "PNG", 110, 220, 60, 60);
    doc.addImage('assets/images/pdf/marca-agua.png', "PNG", 25, 115, 160, 60);
    doc.addImage(Qr, "PNG", 170, 255, 30, 30);


    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(`N° A-SUB${n_curp} `, pageWidth - 178, pageHeight - 260, { align: 'center' });


    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(`Caracas, ${this.utilService.FechaMomentLL(fecha)}`, pageWidth - 40, pageHeight - 260, { align: 'center' });



    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("AUTORIZACION DE SUBCONTRATISTA PARA LA PRESTACION DE LOS SERVICIOS POSTALES DE OPERADORES POSTALES PRIVADOS", pageWidth / 2, pageHeight - 250, { maxWidth: 190, align: "center" });


    doc.setFont(undefined, "");
    doc.setFontSize(12);
    doc.text(`    El INSTITUTO POSTAL TELEGRÁFICO DE VENEZUELA, ente adscrito al Ministerio del Poder Popular para Ciencia y Tecnología, creado mediante Ley Publicada en la Gaceta Oficial de la República Bolivariana de Venezuela N° 2.146 Extraordinario, de fecha 28 de enero de 1978, reformada parcialmente según Decreto N° 403, de fecha 21 de Octubre de 1999, Publicada en la Gaceta Oficial de la República Bolivariana de Venezuela N° 5.398 Extraordinario, de fecha 26 de Octubre de 1999; el cual en lo sucesivo se denominará IPOSTEL, representado en este acto por su Presidenta, Msc. OLGA YOMIRA PEREIRA JAIMES, Venezolana, mayor de edad, de este domicilio, titular de la Cédula de Identidad N° V- 14.551.754, designada por Decreto Presidencial de la República Bolivariana de Venezuela N° 3.877 del 21 de Junio de 2019, Publicada en la Gaceta Oficial de la República Bolivariana de Venezuela N° 41.660, de fecha 21 de Junio de 2019, quien actúa en ejercicio de las atribuciones que le confiere el articulo 17 literal “e” de la Ley antes citada y bajo Autorización del Directorio de IPOSTEL, evidenciando la operatividad de las empresas subcontratadas que realizan a nombre de su representada las actividades inherentes a la prestación de los servicios públicos de correo, se procede a AUTORIZAR para la subcontratación de la empresa ${data.nombresub}, sociedad mercantil inscrita en el Registro Mercantil Segundo de la Circunscripción Judicial del Estado Aragua, en fecha ${data.fecha_punto_cuenta_curpopp}, tomo ${data.tomo_archivo_curpopp}; la cual prestara servicios al Operador Postal ${data.nombreopp} identificado con el RIF ${data.rifopp}, Código Postal N° ${data.concesion_postal_curpopp}, de conformidad a lo establecido en el CONTRATO DE CONCESIÓN PARA LA PRESTACION DE LOS SERVICIOS PÚBLICOS DE CORREOS,  “DE LA SUBCONTRATACION PARA LA PRESTACIÓN DEL SERVICIO”, suscrito con IPOSTEL en fecha ${data.fecha_punto_cuenta_curpopp}, debidamente autenticados ante la Notaría Pública Tercera del Municipio Libertador, en la misma fecha, bajo el N° ${data.n_archivo_curpopp}, Tomo ${data.tomo_archivo_curpopp}, Folio ${data.n_contrato_curpopp} hasta ${data.periodo_contrato_curpopp} previa revisión de los documentos consignados, SE RESULEVE AUTORIZAR POR UN PERIODO ANUAL A LA VIGENCIA DE LA CONCESIÓN DEL OPERADOR POSTAL PRIVADO, la operatividad de la sociedad mercantil supra identificada.`,
      14,
      65,
      { maxWidth: 185, align: "justify" }
    );


    doc.setFont(undefined, "");
    doc.setFontSize(12);
    doc.text(`    Es importante acotar, que la presente AUTORIZACIÓN se encuentra sujeta tanto al pago que por concepto de subcontratación debe realizar su representado ante este Instituto, tal como corresponde a los Operadores Postales Privados, de conformidad a la Providencia Administrativa emitida a tal fin, asi como a la inmediata consignación de los documentos solicitadas a tal fin.`,
      14,
      190,
      { maxWidth: 185, align: "justify" }
    );

    doc.setFont(undefined, "");
    doc.setFontSize(12);
    doc.text(`    Conforme a lo aprobado el monto a cancelar por la empresa ${data.nombreopp}, por concepto de obligaciones postales, es el equivalente al cincuenta por ciento (50%) del costo actual de la Concesión Postal, (Derecho Semestral y Anualidad) para lo cual deberá cancelar en el lapso que corresponda al Operador Postal Privado a que está supeditado, conforme a lo establecido en la Contrato de Concesión suscrito por su representada.`,
      14,
      215,
      { maxWidth: 185, align: "justify" }
    );

    doc.setFont(undefined, "");
    doc.setFontSize(12);
    doc.text(`    Sin otro particular al cual hacer referencia, se suscribe de usted.`,
      14,
      245,
      { maxWidth: 185, align: "justify" }
    );

    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    // doc.text(`    CERTIFICADO VALIDO HASTA: ${data.periodo_contrato_curpsub}`, 14, 255, { align: "justify" });
    doc.text(`    CERTIFICADO VALIDO POR UN (01) AÑ0`, 14, 255, { align: "justify" });


    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Msc. OLGA YOMIRA PEREIRA JAIMES", 105, 275, { align: "center" });
    doc.setFontSize(10);
    doc.setFont(undefined, "");
    doc.text("PRESIDENTA (E) del Instituto Postal Telegráfico de Venezuela IPOSTEL", 105, 280, { align: "center" });
    doc.setFontSize(9);
    doc.text("Según Decreto Presidencial N° 3.877 del 21/06/2019,", 105, 285, { align: "center" });
    doc.setFontSize(9);
    doc.text("Publicada en la Gaceta Oficial N° 41.660, de fecha 21 de Junio de 2019.", 105, 290, { align: "center" });

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text(TokenQr,
      175,
      285,
    );

    doc.save("Autorizacion de Inscripción.pdf");
    doc.autoPrint();
    // doc.output("dataurlnewwindow", { filename: 'Certificado Uníco de Inscripción.pdf' });
  }

  GenerarFactura(data: any, MantenimientoYSeguridad: any) {
    console.log(data);
    const fecha = this.utilService.FechaActual()
    const anio = new Date(fecha)
    let aniox = anio.getFullYear()
    const doc = new jsPDF();


    this.Nacional = data[0].ListaFranqueo ? data[0].ListaFranqueo : 0
    this.InternacionalLlegada = data[0].ListaFranqueo ? data[0].ListaFranqueo : 0
    this.InternacionalSalida = data[0].ListaFranqueo ? data[0].ListaFranqueo : 0
    this.TotalFactura = data[0].ListaFranqueo ? data[0].ListaFranqueo : 0

    let MontoTotalPiezasNacional = 0
    let MontoTotalBsNacional = 0
    let Nacional0_2 = 0
    let MontoNacional0_2 = 0
    let Nacional2_4 = 0
    let MontoNacional2_4 = 0
    let Nacional4_5 = 0
    let MontoNacional4_5 = 0
    let Nacional5_30 = 0
    let MontoNacional5_30 = 0

    let MontoTotalPiezasLlegada = 0
    let MontoTotalBsLlegada = 0

    let MontoTotalPiezasSalida = 0
    let MontoTotalBsSalida = 0


    let MontoTotalPiezas = 0
    let MontoTotalBs = 0
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.setProperties({
      title: "FACTURA SIRP-IPOSTEL",
      subject: "https://sirp.ipostel.gob.ve",
      author: "SIRP-IPOSTEL",
      keywords: "generated, javascript, web 2.0, ajax",
      creator: "CAP. ANDRÉS RICARDO RODRÍGUEZ DURÁN",
    });

    doc.addImage('assets/images/pdf/cintillo.png', "PNG", 10, 5, 187.5, 15);
    doc.addImage('assets/images/pdf/marca-agua.png', "PNG", 25, 210, 160, 60);
    if (data[0].ListaFacturas[0].status_pc == 2) {
      doc.addImage('assets/images/pdf/firma.png', "PNG", 20, 230, 40, 40); // FIRMA PRESIDENTA OLGA
      doc.addImage('assets/images/pdf/factura/firma.png', "PNG", 60, 190, 120, 120);  // FIRMA JONATHAN JAIMES
      doc.addImage('assets/images/pdf/factura/sello.png', "PNG", 70, 225, 90, 90);
      doc.addImage('assets/images/pdf/sello.png', "PNG", 35, 245, 40, 50);
    }


    doc.rect(14, 20, 142, 20);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    if (data[0].ListaFacturas[0].status_pc == 2) {
      doc.text("PLANILLA DE AUTOLIQUIDACIÓN DE OBLIGACIONES POSTALES DE LAS OPERADORAS POSTALES PRIVADAS (OPP)", 85, 28, { maxWidth: 140, align: "center" });
    } else {
      doc.text("PLANILLA DE PRELIQUIDACIÓN DE OBLIGACIONES POSTALES DE LAS OPERADORAS POSTALES PRIVADAS (OPP)", 85, 28, { maxWidth: 140, align: "center" });
    }

    doc.rect(156, 20, 40, 5);
    doc.setFontSize(7);
    doc.setFont(undefined, "bold");
    doc.text("FECHA", 176, 23.5, { align: "center" });
    doc.rect(156, 25, 40, 5);
    doc.setFontSize(7);
    doc.setFont(undefined, "");
    doc.text(this.utilService.FechaMomentL(fecha), 176, 28.5, { align: "center" });


    doc.rect(156, 30, 40, 5);
    doc.setFontSize(7);
    doc.setFont(undefined, "bold");
    doc.text("N° CONTROL", 176, 33.5, { align: "center" });
    doc.rect(156, 35, 40, 5);
    doc.setFontSize(7);
    doc.setFont(undefined, "bold");
    doc.text(`${aniox + '-' + data[0].ListaFacturas[0].id_factura}`, 176, 38.5, { align: "center" });


    doc.rect(14, 40, 25, 5);
    doc.setFontSize(7);
    doc.setFont(undefined, "bold");
    doc.text("OPERADOR POSTAL", 26.5, 43.3, { align: "center" });
    doc.rect(39, 40, 95, 5);
    doc.setFontSize(5);
    doc.setFont(undefined, "");
    doc.text(data[0].nombre_empresa.toUpperCase(), 40, 43, { align: "justify" });


    doc.rect(134, 40, 22, 5);
    doc.setFont(undefined, "bold");
    doc.text("CODIGO POSTAL N°", 145, 43.3, { align: "center" });
    doc.setFont(undefined, "bold");
    doc.text(data[0].concesion_postal_curp, 175, 43.3, { align: "center" });


    doc.rect(14, 45, 20, 5);
    doc.setFontSize(7);
    doc.setFont(undefined, "bold");
    doc.text("RIF", 24.5, 48.3, { align: "center" });
    doc.rect(34, 45, 30, 5);
    doc.setFontSize(5);
    doc.setFont(undefined, "");
    doc.text(data[0].rif.toUpperCase(), 40, 48.3, { align: "center" });



    // doc.rect(74, 45, 30, 5);
    doc.setFontSize(7);
    doc.setFont(undefined, "bold");
    doc.text("TELEFONO", 73, 48.3, { align: "center" });
    doc.rect(85, 45, 49, 5);
    doc.setFontSize(5);
    doc.setFont(undefined, "");
    doc.text(data[0].telefono_movil_representante_legal + ' - ' + data[0].telefono_residencial_representante_legal, 87, 48.3, { align: "justify" });

    // doc.rect(134, 45, 26, 5);
    doc.setFont(undefined, "bold");
    doc.text("CONTRATO N°", 145, 48.3, { align: "center" });
    doc.setFont(undefined, "bold");
    doc.text(data[0].n_contrato_curp, 175, 48.3, { align: "center" });


    doc.rect(156, 40, 40, 5);
    doc.rect(156, 45, 40, 5);
    doc.rect(14, 50, 26, 5);
    doc.setFontSize(7);
    doc.setFont(undefined, "bold");
    doc.text("DIRECCIÓN", 27, 53.3, { align: "center" });
    doc.rect(40, 50, 156, 5);
    doc.setFontSize(5);
    doc.setFont(undefined, "");
    doc.text(data[0].direccion_empresa.toUpperCase(), 60, 53.3, { maxWidth: 160, align: "justify" }
    );


    autoTable(doc, {})
    doc.setFontSize(9);
    doc.setFont(undefined, "");
    autoTable(doc, {
      styles: { fillColor: [128, 24, 24], halign: 'center' },
      columnStyles: { 0: { halign: 'center', fillColor: [153, 153, 153] } }, // Cells in first column centered and green
      margin: { top: 0 },
      head: [['CONCEPTOS DE PAGO']],
      startY: 60,
    })



    // var MontoFacturas = []
    let itemFacturas = data[0].ListaFacturas
    // let itemMontoFacturas =  data[0].ListaFacturas
    itemFacturas.map(e => {
      this.MontoTotalP = e.monto_pagar
      this.tempDataRowsFacturas = [
        e.nombre_tipo_pagos,
        e.fecha_pc,
        e.monto_pagar = this.utilService.ConvertirMoneda(e.monto_pagar),
        e.referencia_bancaria,
        e.fecha_pc,
      ];
    });

    this.rowsFacturas.push(this.tempDataRowsFacturas);


    autoTable(doc, {
      styles: { fillColor: [153, 153, 153], halign: 'center', overflow: "linebreak", fontSize: 9, valign: "middle", },
      columnStyles: { 0: { halign: 'justify', } }, // Cells in first column centered and green
      head: [['CONCEPTO', 'PERÍODO', 'MONTO', 'DEPÓSITO', 'FECHA']],
      body: this.rowsFacturas,
      startY: 67,
    })


    var suma1 = this.MontoTotalP
    var suma2 = 0.50 * data[0].ListaFacturas[0].petro_dia
    var total = this.valor0 + this.valor1
    let TotalPagadoConServicios = parseFloat(this.MontoTotalP)
    let TotalPagadoConServiciosFinal = this.utilService.ConvertirMoneda(TotalPagadoConServicios)
    // console.log(total)
    this.TotalPagarFactura = this.utilService.ConvertirMoneda(total)
    this.MontoTotalFactura = this.utilService.ConvertirMoneda(this.MontoTotalP)
    let montoPetro = this.MontoTotalP / parseFloat(data[0].ListaFacturas[0].petro_dia)
    autoTable(doc, {
      styles: { fillColor: [153, 153, 153], halign: 'center', overflow: "linebreak", fontSize: 8, valign: "middle", },
      columnStyles: { 0: { halign: 'center', fillColor: [147, 196, 125] } }, // Cells in first column centered and green
      body: [['TOTAL A CANCELAR', TotalPagadoConServiciosFinal ? TotalPagadoConServiciosFinal : 0, 'MONTO PETRO', montoPetro.toFixed(8) ? montoPetro.toFixed(8) : 0]],
      theme: "grid",
      startY: 81.5,
    })


    autoTable(doc, {
      styles: { fillColor: [128, 24, 24], halign: 'center', overflow: "linebreak", fontSize: 8, valign: "middle", },
      columnStyles: { 0: { halign: 'center', fillColor: [147, 196, 125] } }, // Cells in first column centered and green
      margin: { top: 0 },
      head: [['DECLARACIÓN DE FRANQUEO POSTAL OBLIGATORIO POR MOVILIZACIÓN DE PIEZAS']],
      body: [['SERVICIO NACIONAL']],
      startY: 108,
    })


    if (this.Nacional.length > 0) {
      this.Nacional.map(element => {
        if (element.id_servicio_franqueo == 1 || element.id_servicio_franqueo == 2) {
          this.Nacionalx.push(element)
        }
      });
    }

    this.Nacionalx.map(element => {
      if (element.id_peso_envio == 1 || element.id_peso_envio == 2 || element.id_peso_envio == 3 || element.id_peso_envio == 4 || element.id_peso_envio == 5) {
        Nacional0_2 = this.Nacionalx.map(item => item.cantidad_piezas).reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
      }
      if (element.id_peso_envio == 6 || element.id_peso_envio == 7 || element.id_peso_envio == 8 || element.id_peso_envio == 9) {
        Nacional2_4 = this.Nacionalx.map(item => item.cantidad_piezas).reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
      }
    });

    MontoTotalPiezasNacional = this.Nacionalx.map(item => item.cantidad_piezas).reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
    MontoTotalBsNacional = this.Nacionalx.map(item => item.monto_caudado).reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);

    autoTable(doc, {
      styles: { fillColor: [128, 24, 24], halign: 'center', overflow: "linebreak", fontSize: 7, valign: "middle", },
      head: [['TOTAL PIEZAS', 'TOTAL BS', '0 - 2 KG', 'BS', '2 - 4 KG', 'BS', '4 - 5 KG', 'BS', '5 - 30 KG', 'BS']],
      body: [
        [MontoTotalPiezasNacional ? MontoTotalPiezasNacional : 0, this.utilService.ConvertirMoneda(MontoTotalBsNacional ? MontoTotalBsNacional : 0), Nacional0_2 ? Nacional0_2 : 0, this.utilService.ConvertirMoneda(MontoNacional0_2 ? MontoNacional0_2 : 0), Nacional2_4 ? Nacional2_4 : 0, this.utilService.ConvertirMoneda(MontoNacional2_4 ? MontoNacional2_4 : 0), Nacional4_5 ? Nacional4_5 : 0, this.utilService.ConvertirMoneda(MontoNacional4_5 ? MontoNacional4_5 : 0), Nacional5_30 ? Nacional5_30 : 0, this.utilService.ConvertirMoneda(MontoNacional5_30 ? MontoNacional5_30 : 0)],




      ],
      startY: 123,
    })
    autoTable(doc, {
      styles: { fillColor: [128, 24, 24], halign: 'center' },
      columnStyles: { 0: { halign: 'center', fillColor: [147, 196, 125] } }, // Cells in first column centered and green
      margin: { top: 0 },
      body: [['SERVICIO INTERNACIONAL DE LLEGADA']],
      startY: 138,
    })

    if (this.InternacionalLlegada.length > 0) {
      this.InternacionalLlegada.map(element => {
        if (element.id_servicio_franqueo == 3 || element.id_servicio_franqueo == 5) {
          this.InternacionalLlegadax.push(element)
        }
      });
    }

    MontoTotalPiezasLlegada = this.InternacionalLlegadax.map(item => item.cantidad_piezas).reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
    MontoTotalBsLlegada = this.InternacionalLlegadax.map(item => item.monto_caudado).reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);

    autoTable(doc, {
      styles: { fillColor: [128, 24, 24], halign: 'center', overflow: "linebreak", fontSize: 7, valign: "middle", },
      head: [['TOTAL PIEZAS', 'TOTAL BS', '0 - 2 KG', 'BS', '2 - 4 KG', 'BS', '4 - 5 KG', 'BS', '5 - 30 KG', 'BS']],
      body: [
        [MontoTotalPiezasLlegada ? MontoTotalPiezasLlegada : 0, this.utilService.ConvertirMoneda(MontoTotalBsLlegada ? MontoTotalBsLlegada : 0), '0', '0.00', '0', '0.00', '0', '0.00', '0', '0.00'],
      ],
      startY: 145,
    })
    autoTable(doc, {
      styles: { fillColor: [128, 24, 24], halign: 'center' },
      columnStyles: { 0: { halign: 'center', fillColor: [147, 196, 125] } }, // Cells in first column centered and green
      margin: { top: 0 },
      body: [['SERVICIO INTERNACIONAL DE SALIDA']],
      startY: 160,
    })

    if (this.InternacionalSalida.length > 0) {
      this.InternacionalSalida.map(element => {
        if (element.id_servicio_franqueo == 4 || element.id_servicio_franqueo == 6) {
          this.InternacionalSalidax.push(element)
        }
      });
    }
    MontoTotalPiezasSalida = this.InternacionalSalidax.map(item => item.cantidad_piezas).reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
    MontoTotalBsSalida = this.InternacionalSalidax.map(item => item.monto_caudado).reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);

    autoTable(doc, {
      styles: { fillColor: [128, 24, 24], halign: 'center', overflow: "linebreak", fontSize: 7, valign: "middle", },
      head: [['TOTAL PIEZAS', 'TOTAL BS', '0 - 2 KG', 'BS', '2 - 4 KG', 'BS', '4 - 5 KG', 'BS', '5 - 30 KG', 'BS']],
      body: [
        [MontoTotalPiezasSalida ? MontoTotalPiezasSalida : 0, this.utilService.ConvertirMoneda(MontoTotalBsSalida ? MontoTotalBsSalida : 0), '0', '0.00', '0', '0.00', '0', '0.00', '0', '0.00'],
      ],
      startY: 167,
    })
    autoTable(doc, {
      styles: { fillColor: [128, 24, 24], halign: 'center' },
      columnStyles: { 0: { halign: 'center', fillColor: [255, 255, 0] } }, // Cells in first column centered and green
      margin: { top: 0 },
      body: [['TOTAL PIEZAS DECLARADAS EN EL MES']],
      startY: 185,
    })

    if (this.TotalFactura.length > 0) {
      // Calculo de Movimiento Total en el Mes
      MontoTotalPiezas = this.TotalFactura.map(item => item.cantidad_piezas).reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
      MontoTotalBs = this.TotalFactura.map(item => item.monto_caudado).reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
    }

    autoTable(doc, {
      styles: { fillColor: [128, 24, 24], halign: 'center' },
      head: [['NETO PIEZAS', 'TOTAL BS', '0 - 2 KG', 'BS', '2 - 4 KG', 'BS', '4 - 5 KG', 'BS', '5 - 30 KG', 'BS']],
      body: [
        [MontoTotalPiezas ? MontoTotalPiezas : 0, this.utilService.ConvertirMoneda(MontoTotalBs ? MontoTotalBs : 0), '0', '0.00', '0', '0.00', '0', '0.00', '0', '0.00'],
      ],
      startY: 192,
    })





    doc.rect(14, 210, 182, 30);
    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("OBSERVACIONES:", 15, 213, { align: "left" });
    doc.text(data[0].ListaFacturas[0].observacion_pc, 15, 217, { maxWidth: 178, align: "justify" });


    doc.rect(14, 240, 60.6, 5);
    doc.setFontSize(6);
    doc.setFont(undefined, "bold");
    doc.text("PRESIDENTA (E) IPOSTEL", 43, 243.4, { align: "center" });

    doc.rect(74.6, 240, 80.6, 5);
    doc.setFontSize(6);
    doc.setFont(undefined, "bold");
    doc.text("DIRECTOR DE GESTIÓN DEL SECTOR POSTAL", 115, 243.4, { align: "center" });


    doc.rect(155.2, 240, 40.6, 5);
    doc.setFontSize(6);
    doc.setFont(undefined, "bold");
    doc.text("CONCESIONARIO", 176, 243.4, { align: "center" });
    // doc.text(data[0].nombre_empresa.toUpperCase(), 176,248.4, { align: "center" })

    doc.rect(14, 245, 60.6, 10);
    doc.rect(74.6, 245, 80.6, 10);
    doc.rect(155.2, 245, 40.6, 10);

    doc.rect(14, 255, 60.6, 5);
    doc.setFontSize(6);
    doc.setFont(undefined, "bold");
    doc.text("SELLO DE LA GERENCIA", 43, 258, { align: "center" });

    doc.rect(74.6, 255, 80.6, 5);
    doc.setFontSize(6);
    doc.setFont(undefined, "bold");
    doc.text("SELLO DE LA DIRECCIÓN", 115, 258, { align: "center" });


    doc.rect(155.2, 255, 40.6, 5);
    doc.setFontSize(6);
    doc.setFont(undefined, "bold");
    doc.text("SELLO DE LA EMPRESA", 176, 258, { align: "center" });

    doc.rect(14, 260, 60.6, 10);
    doc.rect(74.6, 260, 80.6, 10);
    doc.rect(155.2, 260, 40.6, 10);


    // FOOTER INICIO
    doc.setFont(undefined, "");
    doc.setFontSize(6);
    doc.text(
      "NOTA: LOS PAGOS DEBEN SER CALCULADOS A LA TASA SEGÚN EL BCV DEL DIA EN QUE SE REALICE LA LIQUIDACIÓN POSTAL EN LA GERENCIA DE REGULACIÓN POSTAL",
      105,
      272,
      { maxWidth: 210, align: "center" }
    );

    doc.setFontSize(6);
    doc.text(
      "Providencia Administrativa N° CJ/002/2020 de fecha 30 de Junio de 2020, publicado respectivamente en la Gaceta Oficial N° 41.912 de fecha 01 de Julio de 2020",
      105,
      281,
      { maxWidth: 210, align: "center" }
    );

    doc.setLineWidth(0.3);
    doc.line(14, 282, 197, 283);


    doc.setFontSize(6);
    doc.setFont(undefined, "bold");
    doc.text(
      "Dirección de Gestión Postal: Centro Postal Caracas, 2do Piso, A la Oeste. Av. José Angel Lamas, Caracas - Venezuela. Zona Postal 1020",
      105,
      285,
      { maxWidth: 210, align: "center" }
    );

    // FOOTER FINAL

    doc.save(`Factura ${fecha}` + ".pdf");
    // doc.autoPrint();
    // doc.output("dataurlnewwindow", { filename: `Factura ${fecha}`+".pdf" });
  }

  GenerarPlanillaLiquidacion5(data: any, MantenimientoYSeguridad: any) {
    // console.log(data, MantenimientoYSeguridad);
    const fecha = this.utilService.FechaActual()
    const anio = new Date(fecha)
    let aniox = anio.getFullYear()
    const doc = new jsPDF();


    this.Nacional = data[0].ListaFranqueo ? data[0].ListaFranqueo : 0
    this.InternacionalLlegada = data[0].ListaFranqueo ? data[0].ListaFranqueo : 0
    this.InternacionalSalida = data[0].ListaFranqueo ? data[0].ListaFranqueo : 0
    this.TotalFactura = data[0].ListaFranqueo ? data[0].ListaFranqueo : 0

    let MontoTotalPiezasNacional = 0
    let MontoTotalBsNacional = 0
    let Nacional0_2 = 0
    let MontoNacional0_2 = 0
    let Nacional2_4 = 0
    let MontoNacional2_4 = 0
    let Nacional4_5 = 0
    let MontoNacional4_5 = 0
    let Nacional5_30 = 0
    let MontoNacional5_30 = 0

    let MontoTotalPiezasLlegada = 0
    let MontoTotalBsLlegada = 0

    let MontoTotalPiezasSalida = 0
    let MontoTotalBsSalida = 0


    let MontoTotalPiezas = 0
    let MontoTotalBs = 0
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.setProperties({
      title: "PLANILLA DE AUTOLIQUIDACIÓN SIRP-IPOSTEL",
      subject: "https://sirp.ipostel.gob.ve",
      author: "SIRP-IPOSTEL",
      keywords: "generated, javascript, web 2.0, ajax",
      creator: "CAP. ANDRÉS RICARDO RODRÍGUEZ DURÁN",
    });

    doc.addImage('assets/images/pdf/cintillo.png', "PNG", 10, 5, 187.5, 15);
    doc.addImage('assets/images/pdf/marca-agua.png', "PNG", 25, 210, 160, 60);
    doc.addImage('assets/images/pdf/firma.png', "PNG", 20, 230, 40, 40); // FIRMA PRESIDENTA OLGA
    doc.addImage('assets/images/pdf/factura/firma.png', "PNG", 60, 190, 120, 120);  // FIRMA JONATHAN JAIMES
    doc.addImage('assets/images/pdf/factura/sello.png', "PNG", 70, 225, 90, 90);
    doc.addImage('assets/images/pdf/sello.png', "PNG", 35, 245, 40, 50);


    doc.rect(14, 20, 142, 20);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("PLANILLA DE AUTOLIQUIDACIÓN DE OBLIGACIONES POSTALES", 85, 28, { maxWidth: 140, align: "center" });

    doc.rect(156, 20, 40, 5);
    doc.setFontSize(7);
    doc.setFont(undefined, "bold");
    doc.text("FECHA", 176, 23.5, { align: "center" });
    doc.rect(156, 25, 40, 5);
    doc.setFontSize(7);
    doc.setFont(undefined, "");
    doc.text(this.utilService.FechaMomentL(fecha), 176, 28.5, { align: "center" });


    doc.rect(156, 30, 40, 5);
    doc.setFontSize(7);
    doc.setFont(undefined, "bold");
    doc.text("N° CONTROL", 176, 33.5, { align: "center" });
    doc.rect(156, 35, 40, 5);
    doc.setFontSize(7);
    doc.setFont(undefined, "bold");
    doc.text(`${aniox + '-'}`, 176, 38.5, { align: "center" });


    doc.rect(14, 40, 25, 5);
    doc.setFontSize(7);
    doc.setFont(undefined, "");
    doc.text("CONCESIONARIA", 26.5, 43.3, { align: "center" });
    doc.rect(39, 40, 95, 5);
    doc.setFontSize(5);
    doc.setFont(undefined, "");
    doc.text(data[0].nombre_empresa.toUpperCase(), 40, 43, { align: "justify" });


    doc.rect(134, 40, 22, 5);
    doc.setFont(undefined, "bold");
    doc.text("CODIGO POSTAL N°", 145, 43.3, { align: "center" });
    doc.setFont(undefined, "bold");
    // doc.text(data[0].concesion_postal_curp, 175, 43.3, { align: "center" });


    doc.rect(14, 45, 20, 5);
    doc.setFontSize(7);
    doc.setFont(undefined, "bold");
    doc.text("RIF", 24.5, 48.3, { align: "center" });
    doc.rect(34, 45, 30, 5);
    doc.setFontSize(5);
    doc.setFont(undefined, "");
    doc.text(data[0].rif.toUpperCase(), 40, 48.3, { align: "center" });



    // doc.rect(74, 45, 30, 5);
    doc.setFontSize(7);
    doc.setFont(undefined, "bold");
    doc.text("TELEFONO", 73, 48.3, { align: "center" });
    doc.rect(85, 45, 49, 5);
    doc.setFontSize(5);
    doc.setFont(undefined, "");
    doc.text(data[0].telefono_movil_representante_legal + ' - ' + data[0].telefono_residencial_representante_legal, 87, 48.3, { align: "justify" });

    // doc.rect(134, 45, 26, 5);
    doc.setFont(undefined, "bold");
    doc.text("CONTRATO N°", 145, 48.3, { align: "center" });
    doc.setFont(undefined, "bold");
    // doc.text(data[0].n_contrato_curp, 175, 48.3, { align: "center" });


    doc.rect(156, 40, 40, 5);
    doc.rect(156, 45, 40, 5);
    doc.rect(14, 50, 26, 5);
    doc.setFontSize(7);
    doc.setFont(undefined, "bold");
    doc.text("DIRECCIÓN", 27, 53.3, { align: "center" });
    doc.rect(40, 50, 156, 5);
    doc.setFontSize(5);
    doc.setFont(undefined, "");
    doc.text(data[0].direccion_empresa.toUpperCase(), 60, 53.3, { maxWidth: 160, align: "justify" }
    );


    autoTable(doc, {})
    doc.setFontSize(9);
    doc.setFont(undefined, "");
    autoTable(doc, {
      styles: { fillColor: [128, 24, 24], halign: 'center' },
      columnStyles: { 0: { halign: 'center', fillColor: [153, 153, 153] } }, // Cells in first column centered and green
      margin: { top: 0 },
      head: [['CONCEPTOS DE PAGO']],
      startY: 60,
    })



    // var MontoFacturas = []
    let itemFacturas = data[0].ListaFacturas
    let itemMontoFacturas = data[0].ListaFacturas
    itemFacturas.map(e => {
      this.MontoTotalP = e.monto_pagar
      this.tempDataRowsFacturas = [
        e.nombre_tipo_pagos,
        e.fecha_pc,
        e.monto_pagar = this.utilService.ConvertirMoneda(e.monto_pagar),
        e.referencia_bancaria,
        e.fecha_pc,
      ];
    });

    for (let i = 0; i < MantenimientoYSeguridad.length; i++) {
      // console.log(i)
      const element = MantenimientoYSeguridad;
      // console.log(element)
      this.valor0 = element[0].tasa_petro * data[0].ListaFacturas[0].petro_dia

      this.tempMantenimiento = [
        element[0].nombre_tipo_pagos,
        element[0].iniciales_tipo_pagos,
        this.utilService.ConvertirMoneda(this.valor0),
        '---',
        '---',
      ];
    }


    this.rowsFacturas.push(this.tempDataRowsFacturas, this.tempMantenimiento);


    autoTable(doc, {
      styles: { fillColor: [153, 153, 153], halign: 'center', overflow: "linebreak", fontSize: 9, valign: "middle", },
      columnStyles: { 0: { halign: 'justify', } }, // Cells in first column centered and green
      head: [['CONCEPTO', 'PERÍODO', 'MONTO', 'DEPÓSITO', 'FECHA']],
      body: this.rowsFacturas,
      startY: 67,
    })

    var suma1 = this.MontoTotalP
    var suma2 = 0.50 * data[0].ListaFacturas[0].petro_dia
    var total = this.valor0 + this.valor1
    let TotalPagadoConServicios = parseFloat(this.MontoTotalP)
    let TotalPagadoConServiciosFinal = this.utilService.ConvertirMoneda(TotalPagadoConServicios)


    autoTable(doc, {
      styles: { fillColor: [153, 153, 153], halign: 'center', overflow: "linebreak", fontSize: 8, valign: "middle", },
      columnStyles: { 0: { halign: 'center', fillColor: [147, 196, 125] } }, // Cells in first column centered and green
      body: [['TOTAL CANCELADO', TotalPagadoConServiciosFinal ? TotalPagadoConServiciosFinal : 0]],
      theme: "grid",
      startY: 88,
    })



    doc.rect(14, 210, 182, 30);
    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("OBSERVACIONES:", 15, 213, { align: "left" });
    doc.text(data[0].ListaFacturas[0].observacion_pc, 15, 217, { maxWidth: 178, align: "justify" });


    doc.rect(14, 240, 60.6, 5);
    doc.setFontSize(6);
    doc.setFont(undefined, "bold");
    doc.text("PRESIDENTA (E) IPOSTEL", 43, 243.4, { align: "center" });

    doc.rect(74.6, 240, 80.6, 5);
    doc.setFontSize(6);
    doc.setFont(undefined, "bold");
    doc.text("DIRECTOR DE GESTIÓN DEL SECTOR POSTAL", 115, 243.4, { align: "center" });


    doc.rect(155.2, 240, 40.6, 5);
    doc.setFontSize(6);
    doc.setFont(undefined, "bold");
    doc.text("CONCESIONARIO", 176, 243.4, { align: "center" });
    // doc.text(data[0].nombre_empresa.toUpperCase(), 176,248.4, { align: "center" })

    doc.rect(14, 245, 60.6, 10);
    doc.rect(74.6, 245, 80.6, 10);
    doc.rect(155.2, 245, 40.6, 10);

    doc.rect(14, 255, 60.6, 5);
    doc.setFontSize(6);
    doc.setFont(undefined, "bold");
    doc.text("SELLO DE LA GERENCIA", 43, 258, { align: "center" });

    doc.rect(74.6, 255, 80.6, 5);
    doc.setFontSize(6);
    doc.setFont(undefined, "bold");
    doc.text("SELLO DE LA DIRECCIÓN", 115, 258, { align: "center" });


    doc.rect(155.2, 255, 40.6, 5);
    doc.setFontSize(6);
    doc.setFont(undefined, "bold");
    doc.text("SELLO DE LA EMPRESA", 176, 258, { align: "center" });

    doc.rect(14, 260, 60.6, 10);
    doc.rect(74.6, 260, 80.6, 10);
    doc.rect(155.2, 260, 40.6, 10);


    // FOOTER INICIO
    doc.setFont(undefined, "");
    doc.setFontSize(6);
    doc.text(
      "NOTA: LOS PAGOS DEBEN SER CALCULADOS A LA TASA SEGÚN EL BCV DEL DIA EN QUE SE REALICE LA LIQUIDACIÓN POSTAL EN LA GERENCIA DE REGULACIÓN POSTAL",
      105,
      272,
      { maxWidth: 210, align: "center" }
    );

    doc.setFontSize(6);
    doc.text(
      "Providencia Administrativa N° CJ/002/2020 de fecha 30 de Junio de 2020, publicado respectivamente en la Gaceta Oficial N° 41.912 de fecha 01 de Julio de 2020",
      105,
      281,
      { maxWidth: 210, align: "center" }
    );

    doc.setLineWidth(0.3);
    doc.line(14, 282, 197, 283);


    doc.setFontSize(6);
    doc.setFont(undefined, "bold");
    doc.text(
      "Dirección de Gestión Postal: Centro Postal Caracas, 2do Piso, A la Oeste. Av. José Angel Lamas, Caracas - Venezuela. Zona Postal 1020",
      105,
      285,
      { maxWidth: 210, align: "center" }
    );

    // FOOTER FINAL

    // doc.save(`Factura ${fecha}` + ".pdf");
    try {
      doc.save(`Planilla de Autoliquidación ${fecha}.pdf`);
      // this.mostrarAlertaExito();
    } catch (error) {
      this.mostrarAlertaError();
    }
    // doc.autoPrint();
    // doc.output("dataurlnewwindow", { filename: `Factura ${fecha}`+".pdf" });
  }


  private mostrarAlertaExito(): void {
    alert('El PDF se ha descargado exitosamente');
  }

  private mostrarAlertaError(): void {
    alert('Ocurrió un problema al descargar el PDF');
  }


}
