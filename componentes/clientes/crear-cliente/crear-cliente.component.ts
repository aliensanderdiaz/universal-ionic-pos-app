import { Component, OnInit } from '@angular/core';
import { OrdenesService } from 'src/app/services/ordenes.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.scss'],
})
export class CrearClienteComponent implements OnInit {

  razonSocial = '';
  nombreComercial = '';
  primerNombre = '';
  segundoNombre = '';
  apellidos = '';
  tipoId = 'cc';
  numeroId = '';
  ciudad = 'Neiva';
  departamento = 'Huila';
  direccion = '';
  telefono: number;
  email = '';

  constructor(
    private ordenesService: OrdenesService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.numeroId = this.ordenesService.numeroId;
  }

  cambioTipoId(ev: any) {
    this.tipoId = ev.detail.value;
  }

  crearCliente() {
    const CLIENTE = {
      razonSocial: this.razonSocial === '' ? undefined : this.razonSocial,
      nombreComercial: this.nombreComercial === '' ? undefined : this.nombreComercial,
      primerNombre: this.primerNombre === '' ? undefined : this.primerNombre,
      segundoNombre: this.segundoNombre === '' ? undefined : this.segundoNombre,
      apellidos: this.apellidos === '' ? undefined : this.apellidos,
      tipoId: this.tipoId,
      numeroId: this.numeroId,
      ciudad: this.ciudad === '' ? undefined : this.ciudad,
      departamento: this.departamento === '' ? undefined : this.departamento,
      direccion: this.direccion === '' ? undefined : this.direccion,
      telefono: this.telefono.toString(),
      tipo: 'cliente'
    };

    this.apiService.peticionPost('usuarios', CLIENTE)
      .subscribe(
        ( data: any ) => {
          console.log('Cliente Creado');
          this.ordenesService.cliente = data.usuario;
          this.ordenesService.buscarCliente = false;
          this.ordenesService.clienteEncontrado = true;
          this.ordenesService.crearCliente = false;
        },
        ( error: any ) => {
          console.log('Error creando cliente');
        },
        () => {
          console.log('Termino petición crear cliente');
        }
      );
  }

}
