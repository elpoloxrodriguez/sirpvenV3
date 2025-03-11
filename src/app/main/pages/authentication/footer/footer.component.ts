import { Component, OnInit } from '@angular/core';
import { VERSION } from '@angular/core';
import { UtilService } from '@core/services/util/util.service';
import { environment } from 'environments/environment'
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public currentDate: Date;
  public build
  public fechaX
  public fechafinal

  public ShowbuildDateTimeGitHub: boolean = true;

  constructor(
    private utilservice: UtilService,
    private http: HttpClient
  ) { }
  public Version

  async ngOnInit() {
    sessionStorage.removeItem('version')
    sessionStorage.setItem('version',environment.buildDateTime)
    await this.getBuildDateTime();
    this.currentDate = new Date();
    this.fechafinal = environment.buildDateTime
    this.fechaX = 'Build: ' + this.utilservice.FechaMoment(environment.buildDateTime)
    this.build = this.utilservice.FechaMomentL(environment.buildDateTime).replace(/\//g, '.')
    this.Version = VERSION.full

  }

  getBuildDateTime() {
    const url = 'https://raw.githubusercontent.com/elpoloxrodriguez/sirpvenV3/main/src/environments/environment.prod.ts';

    this.http.get(url, { responseType: 'text' }).subscribe(
      (data: string) => {
        // Extraer el valor de buildDateTime usando una expresión regular
        const match = data.match(/buildDateTime:\s*'([^']+)'/);
        const hash = sessionStorage.getItem('version');

        if (match && match[1]) {
          const buildDateTimeGitHub = match[1];
          // Comparar match[1] con el hash
          if (buildDateTimeGitHub === hash) {
            // console.log('Los valores coinciden:', buildDateTimeGitHub);
            // Aquí puedes agregar la lógica si los valores coinciden
          } else {
            // console.log('Los valores NO coinciden:', buildDateTimeGitHub);
            // Aquí puedes agregar la lógica si los valores NO coinciden
            Swal.fire({
              title: '<strong><font color="red">Actualización Disponible</font></strong>',
              html: `
                <div style="text-align: left;">
                  <div style="text-align: center;">✨✨✨ <strong>¡Atención!</strong> ✨✨✨</div> <br><br>
                  Para disfrutar de las nuevas actualizaciones, le sugerimos lo siguiente: <br><br>
                  🗑 <strong>Eliminar el historial de su navegador</strong> <br>
                  🍪 <strong>Borrar las cookies</strong> <br><br>
                  ¡Así su experiencia será más fluida y actualizada!
                </div>
              `,
              icon: 'warning',
              confirmButtonText: 'Gracias!!!'
            });
          }
        } else {
          console.error('No se encontró buildDateTime en el archivo.');
          Swal.fire({
            title: 'Oops Lo Sentimos!',
            html: '<strong>No se encontró Versión</strong><br> le sugerimos eliminar el historial de su navegador y eliminar las cookies, para poder disfrutar de las nuevas actualizaciones!',
            icon: 'error',
          })
        }
      },
      (error) => {
        console.error('Error al obtener el archivo:', error);
        Swal.fire({
          title: 'Oops Lo Sentimos!!!',
          text: 'Algo salio mal, intente de nuevo mas tarde',
          icon: 'warning',
        })
      }
    );
  }

}
