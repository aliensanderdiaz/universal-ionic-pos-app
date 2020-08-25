import { Component, OnInit } from '@angular/core';
import { OrdenesService } from 'src/app/services/ordenes.service';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.page.html',
  styleUrls: ['./ordenes.page.scss'],
})
export class OrdenesPage implements OnInit {

  clienteExiste = false;
  cliente: any;
  crearCliente = false;

  constructor(
    public ordenesService: OrdenesService
  ) { }

  ngOnInit() {
  }

  clienteEncontrado( event: any ) {
    if (!event.clienteEncontrado) {
      this.crearCliente = true;
      return;
    }
    this.clienteExiste = event.clienteEncontrado;
    this.cliente = event.cliente;
  }

  reiniciar() {
    this.ordenesService.buscarCliente = true;
    this.ordenesService.clienteEncontrado = false;
    this.ordenesService.crearCliente = false;
    this.ordenesService.buscarProductos = false;
    this.ordenesService.orden = false;
    this.ordenesService.formasDePago = false;

    this.ordenesService.cliente = null;
    this.ordenesService.productos = [];
    this.ordenesService.total = 0;
    // this.router.navigate(['/ordenes']);

  }

}
