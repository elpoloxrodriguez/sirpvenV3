import { Component, Input, OnInit } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import jwt_decode from "jwt-decode";

import { NotificationsService } from 'app/layout/components/navbar/navbar-notification/notifications.service';
import { UtilService } from '@core/services/util/util.service';

// Interface
interface notification {
  messages: []
  systemMessages: [];
  system: Boolean;
}

@Component({
  selector: 'app-navbar-notification',
  templateUrl: './navbar-notification.component.html'
})
export class NavbarNotificationComponent implements OnInit {

  public token

  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    valores : {},
  };

  public StatusRole
  
  public Notificaciones = []

  // Public
  public notifications: notification;

  /**
   *
   * @param {NotificationsService} _notificationsService
   */
  constructor(
    private _notificationsService: NotificationsService,
    private apiService : ApiService,
    private utilService: UtilService,
    ) {}

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  async ngOnInit() {
    // await this.NotificacionesTotal()
    if (sessionStorage.getItem('token') != null) {
      this.token =  jwt_decode(sessionStorage.getItem('token'));
      if (this.token.Usuario[0].role === 3 || this.token.Usuario[0].role === 4  || this.token.Usuario[0].role === 6) {
        this.StatusRole = 1
        await this.NotificacionesTotal()
        this._notificationsService.onApiDataChange.subscribe(res => {
          this.notifications = res;
        });
      } else {
        this.StatusRole = 0
      }
    } 
  }


  async NotificacionesTotal(){
    this.xAPI.funcion = "IPOSTEL_R_PagoConciliacion_Notificaciones";
    this.xAPI.parametros = `${'0'}`
     await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
         data.Cuerpo.map(e => {
          // if (e.referencia_bancaria !== null) {
            e.nombre_empresa = e.nombre_empresa.slice(0, 45)
            e.monto_pc = this.utilService.ConvertirMoneda(e.monto_pc)
            this.Notificaciones.push(e)
          // }
        });
        // console.log(this.Notificaciones)
      },
      (error) => {
        console.log(error)
      }
    )
  }


}


