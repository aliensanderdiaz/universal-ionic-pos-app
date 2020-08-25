import { Component, OnInit } from '@angular/core';
import { OrdenesService } from 'src/app/services/ordenes.service';
import { ApiService } from 'src/app/services/api.service';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-orden',
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.scss'],
})
export class OrdenComponent implements OnInit {

  productos: any[] = [];
  urlApi = '';
  total = 0;

  constructor(
    private ordenesService: OrdenesService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.productos = this.ordenesService.productos;
    this.urlApi = this.apiService.urlApi;
    this.calcularTotal();
    this.total = this.ordenesService.total;
  }

  agregarOtroProducto() {
    this.ordenesService.buscarProductos = true;
    this.ordenesService.orden = false;
  }

  cambiarCantidad(cantidad, indice, slidingEl: IonItemSliding) {
    if (this.ordenesService.productos[ indice ].cantidad + cantidad < 1) {
      this.ordenesService.productos[ indice ].cantidad = 1;
    } else {
      this.ordenesService.productos[ indice ].cantidad += cantidad;
      this.calcularTotal();
    }
    slidingEl.close();
  }

  eliminarProducto( indice ) {
    this.ordenesService.productos.splice(indice, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    let total = 0;
    this.ordenesService.productos.forEach(producto => {
      const totalLinea = producto.cantidad * producto.precio;
      total += totalLinea;
    });
    this.ordenesService.total = total;
    this.total = total;
  }

  agregarFormaDePago() {
    this.ordenesService.orden = false;
    this.ordenesService.formasDePago = true;
  }

}
