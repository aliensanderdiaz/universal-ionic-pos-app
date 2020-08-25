import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { OrdenesService } from 'src/app/services/ordenes.service';
import { AlertController } from '@ionic/angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-buscar-productos',
  templateUrl: './buscar-productos.component.html',
  styleUrls: ['./buscar-productos.component.scss'],
})
export class BuscarProductosComponent implements OnInit {

  queryBusqueda = '';
  etiqueta = 'Producto';
  productos: any[] = [];
  urlApi = '';

  constructor(
    private apiService: ApiService,
    private ordenesService: OrdenesService,
    public alertController: AlertController,
    private barcodeScanner: BarcodeScanner
  ) { }

  ngOnInit() {
    this.urlApi = this.apiService.urlApi;
  }

  buscarProductos() {
    this.apiService.peticionGet(`productos-por-etiqueta-y-termino/${ this.etiqueta }/${ this.queryBusqueda }`)
      .subscribe(
        ( data: any ) => {
          this.productos = data.productos;
        }
      );
  }

  elegirProducto(producto) {
    console.log({ producto });
    this.ordenesService.buscarProductos = false;
    this.ordenesService.orden = true;
    this.ordenesService.productos.push( producto );
  }

  async agregarPrecio( producto ) {
    const alert = await this.alertController.create({
      header: producto.caracteristicas.referencia,
      subHeader: producto.nombre,
      // message: 'This is an alert message.',
      inputs: [
        {
          name: 'precio',
          type: 'number',
          min: 0,
          placeholder: 'Precio'
        }
      ],
      buttons: [
        {
          text: 'Ok',
          handler: ( data ) => {
            producto.precio = data.precio;
            producto.cantidad = 1;
            this.elegirProducto(producto);
          }
        }
      ]
    });

    await alert.present();
  }

  buscarProductoPorCodigoDeBarras() {
    this.barcodeScanner.scan().then((barcodeData: any) => {

      console.log(`producto-por-codigo-de-barra/${barcodeData.text}`);

      this.apiService.peticionGet(`producto-por-codigo-de-barra/${barcodeData.text}`)
        .subscribe(
          ( data: any ) => {
            this.agregarPrecio( data.producto );
          },
          ( error: any ) => {
            console.log('Error Desde la API', JSON.stringify(error));
          },
          () => {

          },
        );


     }).catch(err => {
         console.log('Error Leyendo el Codigo de barras.');
     });
  }

}
