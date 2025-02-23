import { Injectable, OnInit } from '@angular/core';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { ApiService, IAPICore } from '../apicore/api.service';
import { UtilService } from '../util/util.service';
import html2canvas from 'html2canvas';


@Injectable({
  providedIn: 'root'
})




export class FilateliaService {

  public rectWidth
  public rectHeight
  public spacingX
  public spacingY
  public cantidad
  public diametroX
  public diametroY
  public imageX
  public imageY

  public maxCols
  public maxRows
  public maxRectangles
  public totalWidth
  public totalHeight
  public startX
  public startY

  public i = 0

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public doc = new jsPDF({
    orientation: 'landscape',
    unit: 'cm',
    // Primer dato Ancho 
    // Segundo dato Alto
    format: [33, 48]
  });


  GenerarCabecera(Qr: any, Tipo: number, TokenTiraje: string) {
    const pageHeight = this.doc.internal.pageSize.height || this.doc.internal.pageSize.getHeight();
    const pageWidth = this.doc.internal.pageSize.width || this.doc.internal.pageSize.getWidth();
    this.doc.setProperties({
      title: "CERTIFICADO DE FILATELIA SIRP-IPOSTEL",
      subject: "https://github.com/elpoloxrodriguez",
      author: "SIRP-IPOSTEL",
      keywords: "generated, javascript, web 2.0, ajax",
      creator: "CAP. ANDRÉS RICARDO RODRÍGUEZ DURÁN",
    });

    this.doc.setLineWidth(0.1);
    // Establecer color del borde del rectángulo
    this.doc.setDrawColor(255, 0, 0); // Rojo
    // this.doc.rect(0.75, 0.75, 46.5, 31.5);
    this.doc.setDrawColor(0, 0, 0); // Rojo



    if (Tipo === 1) {
      // Definir medidas de rectángulo
      this.rectWidth = 3;
      this.rectHeight = 3;
      this.spacingX = 0.2;
      this.spacingY = 0.2;
      this.cantidad = 126
      this.diametroX = 1
      this.diametroY = 1
      this.imageX = 1.2
      this.imageY = 1.2
    } else {
      // Definir medidas de rectángulo
      this.rectWidth = 5;
      this.rectHeight = 4.3;
      this.spacingX = 0.2;
      this.spacingY = 0.2;
      this.cantidad = 63
      this.diametroX = 1.5
      this.diametroY = 1.5
      this.imageX = 1.8
      this.imageY = 1.8
    }

    // Generar letra aleatoria
    var letter = String.fromCharCode(65 + Qr * 26); // Letra mayúscula aleatoria

    // Calcular número máximo de rectángulos que caben en la página
    this.maxCols = Math.floor((this.doc.internal.pageSize.width - this.spacingX) / (this.rectWidth + this.spacingX));
    this.maxRows = Math.floor((this.doc.internal.pageSize.height - this.spacingY) / (this.rectHeight + this.spacingY));
    this.maxRectangles = this.maxCols * this.maxRows;

    // Calcular posición para centrar los rectángulos
    this.totalWidth = this.maxCols * this.rectWidth + (this.maxCols - 1) * this.spacingX;
    this.totalHeight = this.maxRows * this.rectHeight + (this.maxRows - 1) * this.spacingY;
    this.startX = (this.doc.internal.pageSize.width - this.totalWidth) / 2;
    this.startY = (this.doc.internal.pageSize.height - this.totalHeight) / 2;

  }

  GenerarFilatelia(Qr: any, Tipo: number, TokenTiraje: string, posicion: number, listaTokenQR: string) {

    // Inicializar el contador de rectángulos
    var contadorRectangulos = 0;

    // Calcular posición del rectángulo
    var colIndex = posicion % this.maxCols;
    var rowIndex = Math.floor(posicion / this.maxCols);
    var x = this.startX + colIndex * (this.rectWidth + this.spacingX);
    var y = this.startY + rowIndex * (this.rectHeight + this.spacingY);

    // Generar número alfanumérico aleatorio
    var alphanumeric = Math.random().toString(36).substring(2, 10);

    var imageX = x + this.rectWidth - this.imageX;
    var imageY = y + this.rectHeight - this.imageY;

    // Dibujar rectángulo si cabe dentro de la página
    if (x + this.rectWidth <= this.doc.internal.pageSize.width && y + this.rectHeight <= this.doc.internal.pageSize.height) {
      this.doc.rect(x, y, this.rectWidth, this.rectHeight);
      // Agregar imagen al rectángulo si cabe dentro de la página
      this.doc.addImage(Qr, 'PNG', imageX, imageY, this.diametroX, this.diametroY);
      // Agregar número alfanumérico al rectángulo
      this.doc.setFontSize(8);
      this.doc.setFont(undefined, "bold");
      this.doc.text(listaTokenQR,
        imageX, imageY + 1.6, this.diametroX, this.diametroY
      );
      // Incrementar el contador de rectángulos
      contadorRectangulos++;


      if (contadorRectangulos === 40) {
        // Agregar una nueva página
        this.doc.addPage();
        contadorRectangulos = 0; // Reiniciar el contador de rectángulos
      }
    }

  }

  GenerarPie(TokenTiraje) {
    this.doc.setFontSize(10);
    this.doc.setFont(undefined, "bold");
    this.doc.text(`Tiraje N#: ${TokenTiraje}`,
      1,
      0.5,
    );

    this.doc.save(`TIRAJE #${TokenTiraje} FILATELIA IPOSTEL.pdf`);
    // this.doc.autoPrint();
    // this.doc.output("dataurlnewwindow", { filename: 'Filatelia IPOSTEL.pdf' });

  }

  generateRandomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


  GenerarFranqueoPostalPrevio() {
    // Crear el documento con las dimensiones deseadas
    var doc = new jsPDF({
      orientation: 'landscape',
      unit: 'cm',
      format: [48, 33]
    });

    // Definir las dimensiones de los rectángulos
    var rectWidth = 5;  // Ancho del rectángulo
    var rectHeight = 4;  // Alto del rectángulo
    var spacing = 0.2;  // Espacio entre los rectángulos
    var borderThickness = 0.08;  // Grosor del borde

    // Calcular el ancho total de los rectángulos y el espaciado entre ellos
    var totalWidth = 9 * rectWidth + (9 - 1) * spacing;
    var totalHeight = 7 * rectHeight + (7 - 1) * spacing;

    // Calcular la coordenada x para centrar los rectángulos horizontalmente
    var startX = (doc.internal.pageSize.width - totalWidth) / 2;

    // Calcular la coordenada y para centrar los rectángulos verticalmente
    var startY = (doc.internal.pageSize.height - totalHeight) / 2;
    var desplazamientoVertical = 1.2; // Valor en centímetros para desplazar hacia abajo
    startY = startY + desplazamientoVertical;

    // Generar los 9 rectángulos horizontales y 7 rectángulos verticales centrados
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 7; j++) {
        // Calcular las coordenadas del rectángulo
        var x = startX + i * (rectWidth + spacing);
        var y = startY + j * (rectHeight + spacing);

        // Dibujar el rectángulo en las coordenadas calculadas con borde rojo y grosor delgado
        doc.setDrawColor(150, 150, 150);  // Establecer el color del borde (en este caso gris)
        doc.setLineWidth(borderThickness);  // Establecer el grosor del borde
        doc.rect(x, y, rectWidth, rectHeight);

        // Agregar la imagen que ocupa todo el rectángulo y está alineada
        var imgX = x;
        var imgY = y;
        var imgWidth = rectWidth;
        var imgHeight = rectHeight;

        // Asegurarse de que la imagen no se extienda más allá del rectángulo
        // doc.setDrawColor(0, 0, 0); // Establecer el color del borde a negro
        doc.rect(x, y, rectWidth, rectHeight); // Dibujar el borde del rectángulo
        doc.addImage('https://pbs.twimg.com/media/EhRJ50fWsAAPjQG.jpg', 'JPEG', imgX, imgY, imgWidth, imgHeight);


        // doc.setFont('', 'bold');
        // Establecer el color del texto
        doc.setTextColor(0, 0, 0); // Color negro
        // Agregar el texto "República Bolivariana de Venezuela" en la parte superior del rectángulo
        var text = "República Bolivariana de Venezuela";
        var fontSize = 7; // Modificar el tamaño de la fuente a 7
        var textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
        var textX = x + (rectWidth - textWidth) / 2;
        var textY = y + fontSize - 6.7; // Ajustar la posición vertical del texto para que aparezca más arriba
        doc.setFontSize(fontSize);
        doc.text(text, textX, textY);

        // Agregar la palabra "Instituto Postal Telegráfico de Venezuela" de manera vertical
        var word = "Instituto Postal Telegráfico de Venezuela";
        var wordX = x + 0.3; // Ajuste para posicionar la palabra en la parte lateral izquierda
        var wordY = y + rectHeight - 0.4; // Ajuste para posicionar la palabra en la parte inferior
        doc.setFontSize(5);
        doc.text(word, wordX, wordY, null, -270); // El parámetro de rotación -90 grados hará que la palabra se escriba de manera vertical


        // Agregar la letra "A" en tamaño 18 en la parte lateral izquierda inferior
        var letterX = x + 0.4; // Ajuste para posicionar la letra "A" un poco más a la derecha
        var letterY = y + rectHeight - 0.4; // Ajuste para posicionar la letra "A" en la parte inferior
        doc.setFontSize(16);
        doc.text('A', letterX, letterY);

        // Agregar la letra "A" en tamaño 18 en la parte lateral izquierda inferior
        var letterX = x + 0.4; // Ajuste para posicionar la letra "A" un poco más a la derecha
        var letterY = y + rectHeight - 0.2; // Ajuste para posicionar la letra "A" en la parte inferior
        doc.setFontSize(5);
        doc.text('Franqueo Postal Privado', letterX, letterY);

        // Agregar la imagen de 1cm de ancho por 1cm de alto en la parte lateral derecha inferior
        var imgWidthBottomRight = 1;  // Ancho de la imagen
        var imgHeightBottomRight = 1;  // Alto de la imagen
        var imgXBottomRight = x + 3.8; // Ajuste para posicionar  un poco más a la derecha
        var imgYBottomRight = y + rectHeight - 1.5; // Ajuste para posicionar  en la parte inferior
        doc.addImage('assets/images/codigo-qr.png', '', imgXBottomRight, imgYBottomRight, imgWidthBottomRight, imgHeightBottomRight);

        // Agregar  en tamaño 18 en la parte lateral izquierda inferior
        var alphanumeric = this.generateRandomString(10);
        var letterX = x + 3.8; // Ajuste para posicionar  un poco más a la derecha
        var letterY = y + rectHeight - 0.2; // Ajuste para posicionar  en la parte inferior
        doc.setFontSize(4.5);
        doc.text(alphanumeric, letterX, letterY);
      }
    }

    // Guardar o mostrar el documento
    doc.save('Franqueo Postal Previo.pdf');  // Guardar como archivo PDF
    // this.doc.autoPrint();
    // this.doc.output("dataurlnewwindow", { filename: 'Franqueo Postal Previo.pdf' });

  }

}