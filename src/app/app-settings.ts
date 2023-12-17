import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environement';

@Injectable({
  providedIn: 'root',
})
export class AppSettings {
  constructor(private httpClient: HttpClient, private router: Router) {}

  APIS = {
    LOGIN_USER: environment.apiUrl + '/users/login',
    SIGNUP_USER: environment.apiUrl + '/users/signup',
    VERIFY_USER: environment.apiUrl + '/users/verify',
    RESEND_OTP: environment.apiUrl + '/users/resend_otp',

    FETCH_USER_DETAILS: environment.apiUrl + '/user/details',
    CREATE_DAIRY: environment.apiUrl + '/users/create',
    FETCH_SELF_DAIRIES: environment.apiUrl + '/users/self-dairies',
    FETCH_DAIRY_DETAILS: environment.apiUrl + '/users/dairy-details',
    SAVE_PAGE: environment.apiUrl + '/users/save-page',
    DAIRY_PAGES: environment.apiUrl + '/users/pages',
  };

  requestServer(body: any, url: string) {
    const encData = { stinky: this.encrypt(body) };

    return this.httpClient.post(url, encData).pipe(
      map((response: any) => {
        console.log('response', response);
        if (response.statusCode === 401) {
          sessionStorage.clear();
          this.router.navigate(['/login']);
        }
        response = this.decrypt(response.spicy);
        return response;
      })
    );
  }

  encrypt(dataToEncrypt: any) {
    try {
      const encryptedText = CryptoJS.AES.encrypt(
        JSON.stringify(dataToEncrypt),
        environment.enc_key
      ).toString();
      // console.log('\n\nEncoded String', encryptedText);
      // console.log(this.decryptService(encryptedText));

      return encryptedText;
    } catch (error) {
      return;
    }
  }

  // decrypt data using nodejs crypto module
  decrypt(dataToDecrypt: any) {
    try {
      const bytes = CryptoJS.AES.decrypt(dataToDecrypt, environment.enc_key);
      const decryptedText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      // console.log('\n\nDecoded String', decryptedText);

      return decryptedText;
    } catch (error) {
      return false;
    }
  }
}
