import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from './app-settings';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppServiceService {
  // authentication
  userLoggedIn = false;
  // books
  oldDairySubject = new Subject();

  constructor(
    private httpClient: HttpClient,
    private appSettings: AppSettings
  ) {
    if (sessionStorage.getItem('locator')?.length) {
      this.userLoggedIn = true;
    }
  }

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
  createDairy(body: any) {
    const url = this.appSettings.APIS.CREATE_DAIRY;
    return this.appSettings.requestServer(body, url);
  }
  selfDairies(body: any) {
    const url = this.appSettings.APIS.FETCH_SELF_DAIRIES;
    return this.appSettings.requestServer(body, url);
  }
  dairyDetails(body: any) {
    const url = this.appSettings.APIS.FETCH_DAIRY_DETAILS;
    return this.appSettings.requestServer(body, url);
  }
  savePage(body: any) {
    const url = this.appSettings.APIS.SAVE_PAGE;
    return this.appSettings.requestServer(body, url);
  }
  pagesFromDairy(body: any) {
    const url = this.appSettings.APIS.DAIRY_PAGES;
    return this.appSettings.requestServer(body, url);
  }
}
