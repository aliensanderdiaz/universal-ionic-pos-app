import { Component, OnInit } from '@angular/core';
import { FacturasService } from 'src/app/services/facturas.service';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.page.html',
  styleUrls: ['./facturas.page.scss'],
})
export class FacturasPage implements OnInit {

  constructor(
    public facturasService: FacturasService
  ) {}

  ngOnInit() {}

}
