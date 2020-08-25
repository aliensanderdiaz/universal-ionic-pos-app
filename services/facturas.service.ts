import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  ordenes: any[] = [];
  orden: any;
  ordenElegida = false;

  constructor(
    private apiService: ApiService
  ) {
    // this.cargarOrdenes();
  }

  cargarOrdenes() {
    this.apiService.peticionGet('ordenes-pos')
      .subscribe(
        ( data: any ) => {
          this.ordenes = data.ventas;
        },
        ( error: any ) => {
          console.log('Error');
        },
        () => {
          console.log('Termino');
        }
      );
  }
}
