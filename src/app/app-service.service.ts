import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from './app-settings';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppServiceService {
  // authentication
  userLoggedIn = false;
  // books
  oldDairySubject = new Subject();
  // passsing the dairy details to book component
  currentDiary: any = {};

  // user details
  profileDetailsSubject = new BehaviorSubject({});
  profileDetails: any = {};

  constructor(
    private httpClient: HttpClient,
    private appSettings: AppSettings
  ) {
    if (sessionStorage.getItem('locator')?.length) {
      this.userDetails({}).subscribe({
        next: (response: any) => {
          console.log('User Details', response);
          if (response?.success) {
            this.profileDetails = response.data;
            this.profileDetailsSubject.next(this.profileDetails);
          }
        },
        error: (error: any) => {
          console.log(error);
          // this.toastr.error('Unable to create an account.');
        },
      });
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
  verifyUser(body: any) {
    const url = this.appSettings.APIS.VERIFY_USER;
    return this.appSettings.requestServer(body, url);
  }
  resendOtp(body: any) {
    const url = this.appSettings.APIS.RESEND_OTP;
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
  publicDiaries(body: any) {
    const url = this.appSettings.APIS.FETCH_OPEN_DIARIES;
    return this.appSettings.requestServer(body, url);
  }
  dairyDetails(body: any) {
    const url = this.appSettings.APIS.FETCH_DAIRY_DETAILS;
    return this.appSettings.requestServer(body, url);
  }
  publicDiaryDetails(body: any) {
    const url = this.appSettings.APIS.FETCH_OPEN_DIARY_DETAILS;
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
  pagesFromPublicDiary(body: any) {
    const url = this.appSettings.APIS.FETCH_OPEN_DIARY_PAGES;
    return this.appSettings.requestServer(body, url);
  }

  // password reset request
  forgotPassword(body: any) {
    const url = this.appSettings.APIS.REQUEST_PASS_RESET;
    return this.appSettings.requestServer(body, url);
  }
}
