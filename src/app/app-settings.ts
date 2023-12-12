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
    SIGNUP_USER: environment.apiUrl + '/users/signup',
    FETCH_USER_DETAILS: environment.apiUrl + '/user/details',
    CREATE_DAIRY: environment.apiUrl + '/users/create',
    FETCH_SELF_DAIRIES: environment.apiUrl + '/users/self-dairies',
    FETCH_DAIRY_DETAILS: environment.apiUrl + '/users/dairy-details',
  };

  requestServer(body: any, url: string) {
    return this.httpClient.post(url, body);
  }
}
