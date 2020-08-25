import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FacturasPage } from './facturas.page';
import { PreFacturasComponent } from 'src/app/componentes/facturas/pre-facturas/pre-facturas.component';
import { PreFacturaComponent } from 'src/app/componentes/facturas/pre-factura/pre-factura.component';

const routes: Routes = [
  {
    path: '',
    component: FacturasPage
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
    FacturasPage,
    PreFacturasComponent,
    PreFacturaComponent
  ]
})
export class FacturasPageModule {}
