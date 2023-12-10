import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from './app-settings';

@Injectable({
  providedIn: 'root',
})
export class AppServiceService {
  constructor(
    private httpClient: HttpClient,
    private appSettings: AppSettings
  ) {}

  login(body: any) {
    const url = this.appSettings.APIS.LOGIN_USER;
    return this.appSettings.requestServer(body, url);
  }
  singup(body: any) {
    const url = this.appSettings.APIS.SIGNUP_USER;
    return this.appSettings.requestServer(body, url);
  }
  userDetails(body: any) {
    const url = this.appSettings.APIS.FETCH_USER_DETAILS;
    return this.appSettings.requestServer(body, url);
  }
}
