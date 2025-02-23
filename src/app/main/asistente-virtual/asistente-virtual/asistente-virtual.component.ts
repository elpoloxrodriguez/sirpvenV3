import { Component, OnInit, } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';

interface Mensaje {
  resp: string;
  preg: string;
}


@Component({
  selector: 'app-asistente-virtual',
  templateUrl: './asistente-virtual.component.html',
  styleUrls: ['./asistente-virtual.component.scss']
})
export class AsistenteVirtualComponent implements OnInit {


  public xAPI: IAPICore = {
    funcion: '',
    parametros: ''
  }

  public status = false
  public msj: any
  public preg: any
  public hidden = false
  public msjAux: any
  public client: Array<Mensaje> = []
  public boot: Array<Mensaje> = []

  public MostrarChat: boolean = false
  public ChatWelcome: boolean = false
  public ChatMessage: boolean = false


  constructor(private apiService: ApiService) { }



  ngOnInit(): void {
    this.status = true
  }


   ChatBot() {
    this.msjAux = this.msj
    this.msj = ''
    this.hidden = true
    this.xAPI.funcion = 'CHATBOOT'
    this.xAPI.parametros = this.msjAux
     this.apiService.EjecutarDev(this.xAPI).
      subscribe(
        (data: any) => {
          // console.log(data)
            if (data.Cuerpo.length > 0) {
              data.Cuerpo.map((e: any) => {
                e.preg = this.msjAux
                this.client.push(e)
              });
          } else {
            this.client.push({ resp: 'Oops lo siento, en este momento estoy presentando problemas con la conexion a internet, por favor intente mas tarde!', preg: this.msjAux })
          }
          this.hidden = false
        },
        error => {
          this.client.push({ resp: 'Problemas con BackEnd, porfavor contacte al administrador!', preg: this.msjAux })
          this.hidden = false
        }
      )
  }


  chat_box(){
    this.client = []
    this.msj = ''
    this.status = false
     this.MostrarChat = true
     this.ChatWelcome = true
  }

  ChatMessages(){
    this.ChatWelcome = false
    this.ChatMessage = true
  }

  hideChat(){
    this.client = []
    this.msj = ''
    this.MostrarChat = false
    this.ChatMessage = false
    this.status = true
  }


}
