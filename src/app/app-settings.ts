import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs';
import { environment } from 'src/environments/environement';

@Injectable({
  providedIn: 'root',
})
export class AppSettings {
  constructor(private httpClient: HttpClient, private router: Router) {}

  APIS = {
    LOGIN_USER: environment.apiUrl + '/users/login',
    SIGNUP_USER: environment.apiUrl + '/users/signup',
    FETCH_USER_DETAILS: environment.apiUrl + '/user/details',
    CREATE_DAIRY: environment.apiUrl + '/users/create',
    FETCH_SELF_DAIRIES: environment.apiUrl + '/users/self-dairies',
    FETCH_DAIRY_DETAILS: environment.apiUrl + '/users/dairy-details',
  };

  requestServer(body: any, url: string) {
    return this.httpClient.post(url, body).pipe(
      tap((response: any) => {
        console.log('response', response);
        if (response.statusCode === 401) {
          sessionStorage.clear();
          this.router.navigate(['/login']);
        }
        return response;
      })
    );
  }
}
