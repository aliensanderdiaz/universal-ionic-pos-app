import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { OrdenesService } from 'src/app/services/ordenes.service';

@Component({
  selector: 'app-buscar-cliente',
  templateUrl: './buscar-cliente.component.html',
  styleUrls: ['./buscar-cliente.component.scss'],
})
export class BuscarClienteComponent implements OnInit {

  numeroId = 22222222;
  @Output() clienteEncontrado = new EventEmitter<any>();

  constructor(
    private apiService: ApiService,
    private ordenesService: OrdenesService
  ) { }

  ngOnInit() {}

  buscarCliente() {
    const NUMERO_ID = this.numeroId.toString();

    if (NUMERO_ID === '22222222') {
      const CLIENTE = {
        _id: '5ce48057b8549c079cef1eb9',
        primerNombre: 'Cliente',
        apellidos: 'Ocasional',
        numeroId: '22222222',
        tipoId: 'cc',
        direccion: 'Cr 3 # 9 - 101',
        telefono: '8711366',
        ciudad: 'Neiva',
        departamento: 'Huila'
      };
      this.ordenesService.cliente = CLIENTE;
      this.ordenesService.buscarCliente = false;
      this.ordenesService.clienteEncontrado = false;
      this.ordenesService.buscarProductos = true;
      return;
    }

    this.ordenesService.numeroId = this.numeroId.toString();

    this.apiService.peticionGet(`usuarios/usuario-por-numero/${ NUMERO_ID }`)
      .subscribe(
        ( data: any ) => {
          console.log({ OK: true });
          this.ordenesService.cliente = data.usuario;
          this.ordenesService.buscarCliente = false;
          this.ordenesService.clienteEncontrado = true;
        },
        ( error: any ) => {
          console.log({ OK: false });
          this.ordenesService.buscarCliente = false;
          this.ordenesService.crearCliente = true;
        },
        () => {
          console.log('Termino petición busqueda de cliente');
        }
      );
  }
}
