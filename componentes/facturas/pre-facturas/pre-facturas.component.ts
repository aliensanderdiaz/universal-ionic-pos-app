import { Component, OnInit } from '@angular/core';
import { FacturasService } from 'src/app/services/facturas.service';
import { ApiService } from 'src/app/services/api.service';

import * as io from 'socket.io-client';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pre-facturas',
  templateUrl: './pre-facturas.component.html',
  styleUrls: ['./pre-facturas.component.scss'],
})
export class PreFacturasComponent implements OnInit {

  socket;

  ordenes: any[] = [];

  constructor(
    private facturasService: FacturasService,
    private apiService: ApiService
  ) {
    this.socket = io(environment.urlApi);
  }

  ngOnInit() {
    this.ordenes = this.facturasService.ordenes;
    this.cargarOrdenes();

    this.socket.on('nuevaOrdenCreada', () => {
      console.log('SE RECIBIO EL EVENTO newTaskAdded');
      this.cargarOrdenes();
    });
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
          console.log('Termino Cargar Ordenes');
        }
      );
  }

  elegirOrden( indice ) {
    this.facturasService.orden = this.ordenes[ indice ];
    this.facturasService.ordenElegida = true;
  }

}
