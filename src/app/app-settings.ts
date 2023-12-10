import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environement';

@Injectable({
  providedIn: 'root',
})
export class AppSettings {
  constructor(private httpClient: HttpClient) {}

  APIS = {
    LOGIN_USER: environment.apiUrl + '/users/login',
    SIGNUP_USER: environment.apiUrl + '/users/singup',
    FETCH_USER_DETAILS: environment.apiUrl + '/user/details',
  };

  requestServer(body: any, url: string) {
    return this.httpClient.post(url, body);
  }
}
