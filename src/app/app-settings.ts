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
  globalUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient, private router: Router) {}

  APIS = {
    LOGIN_USER: this.globalUrl + '/users/login',
    SIGNUP_USER: this.globalUrl + '/users/signup',
    VERIFY_USER: this.globalUrl + '/users/verify',
    RESEND_OTP: this.globalUrl + '/users/resend_otp',

    FETCH_USER_DETAILS: this.globalUrl + '/user/details',
    CREATE_DAIRY: this.globalUrl + '/users/create',
    FETCH_SELF_DAIRIES: this.globalUrl + '/users/self-dairies',
    FETCH_DAIRY_DETAILS: this.globalUrl + '/users/dairy-details',
    SAVE_PAGE: this.globalUrl + '/users/save-page',
    DAIRY_PAGES: this.globalUrl + '/users/pages',

    // password reset
    REQUEST_PASS_RESET: this.globalUrl + '/users/pass_reset',
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
