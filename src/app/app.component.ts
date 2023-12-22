import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppServiceService } from './app-service.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environement';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'diary_ui';
  toggleNavBar = false;

  constructor(
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    public appService: AppServiceService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (environment.production) {
      console.log = () => {};
    }
  }

  isScreenSmall(): boolean {
    // const variable = this.breakpointObserver.isMatched(
    //   '(min-width: 290px) and (max-width: 768px)'
    // );
    return this.breakpointObserver.isMatched('(max-width: 768px)');
  }

  logoutUser() {
    sessionStorage.clear();
    this.appService.userLoggedIn = false;
    this.router.navigate(['/login']);
  }

  toggleNav() {
    this.toggleNavBar = !this.toggleNavBar;
  }
}
