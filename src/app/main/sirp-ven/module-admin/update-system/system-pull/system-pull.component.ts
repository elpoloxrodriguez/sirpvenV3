import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-system-pull',
  templateUrl: './system-pull.component.html',
  styleUrls: ['./system-pull.component.scss']
})
export class SystemPullComponent implements OnInit {

  public SelectUpdateSystem = [
    { id: 1, name: 'FRONTEND - SIRPV-IPOSTEL'},
    { id: 2, name: 'BACKEND - SYSTEM'}
  ]

  public log

  public logs = ''

  constructor() { }

  ngOnInit(): void {
  }

  async GitAll(data: any){
    console.log(data)
    this.logs = data
    // this.SelectUpdateSystem = []
  }

  async GitReset(){
    this.log
    this.logs
  }

  

}
