import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {

  buscarCliente = true;
  clienteEncontrado = false;
  crearCliente = false;
  buscarProductos = false;
  orden = false;
  formasDePago = false;

  numeroId = '';

  cliente: any;

  productos: any[] = [];
  total: number;

  constructor() { }

  reiniciar() {
    this.buscarCliente = true;
    this.clienteEncontrado = false;
    this.crearCliente = false;
    this.buscarProductos = false;
    this.orden = false;
    this.formasDePago = false;

    this.cliente = null;
    this.productos = [];
    this.total = 0;
  }
}
