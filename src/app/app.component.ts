import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppServiceService } from './app-service.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environement';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  title = 'diary_ui';
  toggleNavBar = false;

  profileDetails: any = {};
  profileSubs!: Subscription;

  constructor(
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private appService: AppServiceService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    //
    if (environment.production) {
      console.log = () => {};
    }

    this.profileSubs = this.appService.profileDetailsSubject.subscribe({
      next: (response: any) => {
        this.profileDetails = response;
      },
    });
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
    this.appService.currentDiary = false;
    this.appService.profileDetailsSubject.next({});
    // const navbar = document.getElementById('mobile-nav-ind');
    // navbar?.classList.remove('open');
    this.router.navigate(['/login']);
  }

  toggleNav() {
    // this.toggleNavBar = !this.toggleNavBar;
    const navbar = document.getElementById('mobile-nav-ind');
    navbar?.classList.toggle('open');
  }

  openProfileDetails() {
    const overlay = document.getElementById('user-profile-content');
    overlay?.classList.toggle('open');
  }

  ngOnDestroy() {
    this.profileSubs.unsubscribe();
  }
}
