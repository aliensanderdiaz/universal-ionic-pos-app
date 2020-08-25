import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrdenesPage } from './ordenes.page';
import { BuscarClienteComponent } from 'src/app/componentes/clientes/buscar-cliente/buscar-cliente.component';
import { ClienteComponent } from 'src/app/componentes/clientes/cliente/cliente.component';
import { CrearClienteComponent } from 'src/app/componentes/clientes/crear-cliente/crear-cliente.component';
import { BuscarProductosComponent } from 'src/app/componentes/productos/buscar-productos/buscar-productos.component';
import { OrdenComponent } from 'src/app/componentes/ordenes/orden/orden.component';
import { FormasDePagoComponent } from 'src/app/componentes/ordenes/formas-de-pago/formas-de-pago.component';

const routes: Routes = [
  {
    path: '',
    component: OrdenesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    OrdenesPage,
    BuscarClienteComponent,
    ClienteComponent,
    CrearClienteComponent,
    BuscarProductosComponent,
    OrdenComponent,
    FormasDePagoComponent
  ]
})
export class OrdenesPageModule {}
