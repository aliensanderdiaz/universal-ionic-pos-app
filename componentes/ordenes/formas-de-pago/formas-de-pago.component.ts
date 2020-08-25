import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { OrdenesService } from 'src/app/services/ordenes.service';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-formas-de-pago',
  templateUrl: './formas-de-pago.component.html',
  styleUrls: ['./formas-de-pago.component.scss'],
})
export class FormasDePagoComponent implements OnInit {

  resolucion: any;
  metodosDePago: any;
  cargandoResolucion = true;
  total: number;

  metodoElegido = false;
  metodoTemporal: any;
  totalMetodoElegido: number;

  metodosDePagoTemporal: any[] = [];
  saldo: number;

  otroMetodoDePago = true;
  ordenCompletada = false;

  constructor(
    private apiService: ApiService,
    private ordenesService: OrdenesService,
    public actionSheetController: ActionSheetController,
    private storage: Storage,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.total = this.ordenesService.total;
    this.cargarResolucion();
  }

  cargarResolucion() {
    this.apiService.peticionGet('resoluciones')
      .subscribe(
        (data: any) => {
          this.resolucion = data.resolucion;
          this.cargandoResolucion = false;
          this.metodosDePago = data.resolucion.metodosDePago.map(
            (metodo: any) => {
              return {
                text: metodo.nombre,
                disabled: true,
                handler: () => {
                  console.log({ metodo });
                  this.metodoElegido = true;
                  this.metodoTemporal = metodo;
                  this.totalMetodoElegido = this.saldo || this.total;
                }
              };
            }
          );

          this.metodosDePago.push({
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('CANCELAR');
            }
          });
        },
        (error: any) => {
          console.log('Error');
        },
        () => {
          console.log('Termino');
        },
      );
  }

  async agregarMetodoDePago() {

    // Comprobar los metodos de pago que no se pueden duplicar

    const actionSheet = await this.actionSheetController.create({
      header: 'Métodos de Pago',
      buttons: this.metodosDePago
    });
    await actionSheet.present();
  }

  verificarTotales() {

    if (!this.saldo && this.totalMetodoElegido > this.total) {
      return;
    }

    if (!this.saldo) {

      const METODO_ORDEN = {
        metodoDePago: this.metodoTemporal,
        cantidad: this.totalMetodoElegido
      };

      if (this.metodoTemporal.comprobante) {
        METODO_ORDEN['comprobante'] = undefined;
      }

      if (this.metodoTemporal.cambio) {
        METODO_ORDEN['cash'] = undefined;
        METODO_ORDEN['vueltas'] = undefined;
      }

      // this.metodosDePagoTemporal.push({
      //   metodoDePago: this.metodoTemporal,
      //   cantidad: this.totalMetodoElegido
      // });

      this.metodosDePagoTemporal.push(METODO_ORDEN);

      this.saldo = this.total - this.totalMetodoElegido;

      if (this.saldo === 0) {
        // Podemos crear la orden
        console.log('// Podemos crear la orden');
        this.otroMetodoDePago = false;
        this.ordenCompletada = true;

      } else {
        // Activar el boton de agregar otro metodo de pago.
        console.log('// Activar el boton de agregar otro metodo de pago.');
        this.otroMetodoDePago = true;

        if (!this.metodoTemporal.duplicar) {
          console.log('Este Metodo no se puede duplicar');
          console.log({ metodoTemporal: this.metodoTemporal, metodosDePago: this.metodosDePago });
          this.metodosDePago = this.metodosDePago.filter( metodo => this.metodoTemporal.nombre !== metodo.text );
        }

      }
    } else {
      if (this.totalMetodoElegido > this.saldo) {
        return;
      }

      const METODO_ORDEN = {
        metodoDePago: this.metodoTemporal,
        cantidad: this.totalMetodoElegido
      };

      if (this.metodoTemporal.comprobante) {
        METODO_ORDEN['comprobante'] = undefined;
      }

      if (this.metodoTemporal.cambio) {
        METODO_ORDEN['cash'] = undefined;
        METODO_ORDEN['vueltas'] = undefined;
      }

      // this.metodosDePagoTemporal.push({
      //   metodoDePago: this.metodoTemporal,
      //   cantidad: this.totalMetodoElegido
      // });

      this.metodosDePagoTemporal.push(METODO_ORDEN);

      this.saldo = this.saldo - this.totalMetodoElegido;

      if (this.saldo === 0) {
        // Podemos crear la orden
        console.log('// Podemos crear la orden');
        this.otroMetodoDePago = false;
        this.ordenCompletada = true;

      } else {
        // Activar el boton de agregar otro metodo de pago.
        console.log('// Activar el boton de agregar otro metodo de pago.');
        this.otroMetodoDePago = true;

        if (!this.metodoTemporal.duplicar) {
          console.log('Este Metodo no se puede duplicar');
          console.log({ metodoTemporal: this.metodoTemporal, metodosDePago: this.metodosDePago });
          this.metodosDePago = this.metodosDePago.filter( metodo => this.metodoTemporal.nombre !== metodo.text );
        }

      }
    }

    console.log({
      metodosDePagoTemporal: this.metodosDePagoTemporal
    });

    this.metodoElegido = false;
    this.metodoTemporal = null;
  }

  async crearOrden() {

    const ORDEN = {
      cliente: this.ordenesService.cliente._id,
      productos: this.ordenesService.productos.map(
        ( producto: any) => {
          return {
            producto: producto._id,
            cantidad: +producto.cantidad,
            valorVenta: +producto.precio
          };
        }
      ),
      total: this.ordenesService.total,
      metodosDePago: this.metodosDePagoTemporal.map(
        ( metodo: any ) => {

          const METODO_TEMP = {
            metodoDePago: metodo.metodoDePago._id,
            cantidad:  metodo.cantidad
          };

          if (metodo.metodoDePago.comprobante) {
            METODO_TEMP['comprobante'] = null;
          }

          if (metodo.metodoDePago.cambio) {
            METODO_TEMP['cash'] = null;
            METODO_TEMP['vueltas'] = null;
          }

          return METODO_TEMP;
        }
      ),
      etiqueta: 'CREADA'
    };

    let token = await this.storage.get('token');

    console.log({ token });

    if (!token) {
      return;
    }

    token = 'abc ' + token;

    this.apiService.peticionPostConToken('ordenes-pos', ORDEN, token)
      .subscribe(
        async ( data: any ) => {
          console.log('OK');
          await this.presentToast('Orden Creada');
          this.ordenesService.reiniciar();
        },
        ( error: any ) => {
          console.log('Error', error);
          this.presentToast('Error Creando la orden');
        },
        () => {
          console.log('Terminado');
        },
      );
  }

  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

}
