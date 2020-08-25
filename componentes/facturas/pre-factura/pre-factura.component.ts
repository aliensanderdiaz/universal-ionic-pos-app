import { Component, OnInit } from '@angular/core';
import { FacturasService } from 'src/app/services/facturas.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-pre-factura',
  templateUrl: './pre-factura.component.html',
  styleUrls: ['./pre-factura.component.scss'],
})
export class PreFacturaComponent implements OnInit {

  orden: any;
  ordenCompletada = false;

  constructor(
    private facturasService: FacturasService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.orden = this.facturasService.orden;
    console.log(this.orden);
  }

  verOrdenes() {
    this.facturasService.ordenElegida = false;
    this.facturasService.orden = null;
  }

  verificarMetodo(indice, tipo) {
    if (tipo === 'cambio') {

      if ( this.orden.metodosDePago[ indice ].cash < this.orden.metodosDePago[ indice ].cantidad ) {
        return;
      }
      this.orden.metodosDePago[ indice ].vueltas = this.orden.metodosDePago[ indice ].cash - this.orden.metodosDePago[ indice ].cantidad;
      this.orden.metodosDePago[ indice ].comprobado = true;
    }

    if (tipo === 'comprobante') {

      if ( !this.orden.metodosDePago[ indice ].comprobante || this.orden.metodosDePago[ indice ].comprobante.length < 4 ) {
        return;
      }
      this.orden.metodosDePago[ indice ].comprobado = true;
    }

    if (this.orden.metodosDePago.filter(metodo => metodo.comprobado === false).length === 0) {
      console.log('Se Puede Crear La Factura');
      this.ordenCompletada = true;
    } else {
      console.log('Falta cumplir mas condiciones');
    }
  }

  crearFactura() {

    console.log({ orden: this.orden });
    // return;
    // const subtotal = +( this.orden.total / 1.19 ).toFixed(2);
    // const iva = +(this.orden.total - subtotal).toFixed(2);

    const FACTURA2 = this.orden;
    const FACTURA = {
      cliente: this.orden.cliente._id,
      vendedor: this.orden.vendedor._id,
      productos: this.orden.productos.map(
        ( producto: any) => {
          return {
            producto: producto.producto._id,
            cantidad: +producto.cantidad,
            valorUnidad: +producto.valorVenta,
            valorNeto: +( (+producto.cantidad) * (+producto.valorVenta) / (1 + producto.producto.impuesto.tarifa * 0.01 ) ).toFixed(2),
            impuesto: +((+producto.cantidad) * (+producto.valorVenta) - ( (+producto.cantidad) * (+producto.valorVenta) / (1 + producto.producto.impuesto.tarifa * 0.01 ) )).toFixed(2),
            valorTotal: (+producto.cantidad) * (+producto.valorVenta)
          };
        }
      ),
      total: this.calcularTotal(),
      subtotal: this.calcularSubtotal(),
      impuestos: this.crearArrayImpuestos(),
      metodosDePago: this.orden.metodosDePago.map(
        ( metodo: any) => {
          return {
            metodoDePago: metodo.metodoDePago._id,
            cantidad: +metodo.cantidad,
            comprobante: metodo.comprobante,
            cash: metodo.cash ? +metodo.cash : undefined,
            vueltas: metodo.vueltas ? +metodo.vueltas : undefined,
          };
        }
      )
    };
    console.log({ FACTURA2, FACTURA });

    // return;

    this.apiService.peticionPost('pos', FACTURA)
      .subscribe(
        (data: any) => {
          console.log({ data });
        },
        (error: any) => {
          console.log({ error });
        },
        () => {
          console.log('Terminó petición Post a "/pos"');
        }
      );
  }


  crearArrayImpuestos() {
    const IMPUESTOS = [];

    this.orden.productos.forEach(
      ( producto: any) => {
        const IMPUESTO_ITEM = IMPUESTOS.find( impuesto => impuesto._id === producto.producto.impuesto._id );
        if (!IMPUESTO_ITEM) {
          const IMPUESTO_ITEM_NUEVO = {
            _id: producto.producto.impuesto._id,
            nombre: producto.producto.impuesto.nombre,
            codigo: producto.producto.impuesto.codigo,
            tarifa: producto.producto.impuesto.tarifa,
            valor: +((+producto.cantidad) * (+producto.valorVenta) - ( (+producto.cantidad) * (+producto.valorVenta) / (1 + producto.producto.impuesto.tarifa * 0.01 ) )).toFixed(2)
          };
          IMPUESTOS.push( IMPUESTO_ITEM_NUEVO );
        } else {
          IMPUESTO_ITEM.valor += (+((+producto.cantidad) * (+producto.valorVenta) - ( (+producto.cantidad) * (+producto.valorVenta) / (1 + producto.producto.impuesto.tarifa * 0.01 ) )).toFixed(2))
        }
      }
    );

    return IMPUESTOS.map( impuesto => {
      return {
        impuesto: impuesto._id,
        valor: impuesto.valor
      };
    });
  }

  calcularSubtotal() {
    let SUBTOTAL = 0;

    this.orden.productos.forEach(
      ( producto: any) => {
        SUBTOTAL += (+( (+producto.cantidad) * (+producto.valorVenta) / (1 + producto.producto.impuesto.tarifa * 0.01 ) ).toFixed(2));
      }
    );

    return SUBTOTAL;
  }

  calcularTotal() {
    let TOTAL = 0;

    this.orden.productos.forEach(
      ( producto: any) => {
        TOTAL += ((+producto.cantidad) * (+producto.valorVenta));
      }
    );

    return TOTAL;
  }

}
