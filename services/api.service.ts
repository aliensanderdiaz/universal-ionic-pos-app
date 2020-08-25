import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type':  'application/json',
  //     Authorization: 'fdsfds eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI1ZDg0ZmNkYjRiYWFjNjBlMTA5Mzk0ZGMiLCJudW1lcm9JZCI6IjEiLCJpYXQiOjE1NjkzNjc4MzN9.hu7394Jns63uZynaSWkabfLEHM4mkF9AJMwezmXMdn0'
  //   })
  // };

  urlApi: string = environment.urlApi;

  constructor(
    private httpClient: HttpClient,
    private storage: Storage
  ) { }

  peticionGet(url) {
    // return this.httpClient.get(`${ this.urlApi }/${ url }`, this.httpOptions);
    return this.httpClient.get(`${this.urlApi}/${url}`);
  }

  peticionPostConToken(url, body, token) {

    console.log({
      url, body, token
    });

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token
    });

    return this.httpClient.post(`${this.urlApi}/${url}`, body, { headers });

  }



  peticionPost(url, body) {

    return this.httpClient.post(`${this.urlApi}/${url}`, body);

  }

}
