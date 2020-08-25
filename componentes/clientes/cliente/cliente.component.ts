import { Component, OnInit, Input } from '@angular/core';
import { OrdenesService } from 'src/app/services/ordenes.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
})
export class ClienteComponent implements OnInit {

  cliente: any;
  clienteString: any;

  constructor(
    private ordenesService: OrdenesService
  ) { }

  ngOnInit() {
    this.cliente = this.ordenesService.cliente;
    this.clienteString = JSON.stringify( this.ordenesService.cliente );
  }

  elegirProductos() {
    this.ordenesService.buscarProductos = true;
    this.ordenesService.clienteEncontrado = false;
  }
}
