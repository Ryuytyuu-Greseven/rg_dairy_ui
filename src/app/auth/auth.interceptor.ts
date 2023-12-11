import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // You can modify the request here before it's sent

    const modifiedRequest = request.clone({
      // Add headers, manipulate URL, etc.
      setHeaders: { authorization: `Bearer ${sessionStorage.getItem('locator')}` },
    });

    return next.handle(modifiedRequest);
  }
}
