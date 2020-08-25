import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  numeroId = '';
  password = '';
  mensajeSuccess = '';
  mensajeFailed = '';
  mensajeFinished = '';

  constructor(
    private apiService: ApiService,
    public loadingController: LoadingController,
    private storage: Storage,
    private router: Router
  ) { }

  ngOnInit() {
  }


  async login() {

    this.mensajeSuccess = '';
    this.mensajeFailed = '';
    this.mensajeFinished = '';

    const loading = await this.loadingController.create({
      keyboardClose: true,
      message: 'Cargando...'
    });

    await loading.present();

    this.apiService.peticionPost('signin-local', { numeroId: this.numeroId, password: this.password })
      .subscribe(
        async ( data: any) => {
          this.storage.set('token', data.token);
          await loading.dismiss();
          this.router.navigate(['/ordenes']);
        },
        async ( error: any) => {
          this.mensajeFailed = ':(' + JSON.stringify(error);
          await loading.dismiss();
        },
        () => {
          this.mensajeFinished = 'Termino';
        }
      );
  }

  vertoken() {
    this.storage.get('token').then((val) => {
      this.mensajeSuccess = val;
    });
  }
  remove() {
    this.storage.remove('token').then((val) => {
      this.mensajeSuccess = 'Removido';
    });
  }

  irAOrdenes() {
    this.router.navigate(['/ordenes']);
  }

}
