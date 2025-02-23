import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { UtilService } from '@core/services/util/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jwt_decode from "jwt-decode";
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { PdfService } from '@core/services/pdf/pdf.service';

@Component({
  selector: 'app-postal-solvency',
  templateUrl: './postal-solvency.component.html',
  styleUrls: ['./postal-solvency.component.scss']
})
export class PostalSolvencyComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;


  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public searchValue = '';

  public rowsOPP_SUB
  public tempDataOPP_SUB = []
  public List_OPP_SUB = []
  public Subcontratista = []
  public rowsSubcontratistas
  public tempDataSubcontratas = []


  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private modalService: NgbModal,
    private router: Router,
    private _formBuilder: FormBuilder,
    private pdf: PdfService,
  ) { }

  ngOnInit(): void {
  }


  filterUpdate(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataOPP_SUB.filter(function (d) {
      return d.nombre_empresa.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsOPP_SUB = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

}
