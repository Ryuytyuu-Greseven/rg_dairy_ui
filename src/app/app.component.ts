import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppServiceService } from './app-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './book.css'],
})
export class AppComponent {
  title = 'dairy_ui';

  // login type
  enableLogin = true;
  activePage = 1;

  // pages
  totalPages: Array<any> = [];

  loginForm!: FormGroup;
  signupForm!: FormGroup;
  emailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private appService: AppServiceService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
    });

    this.signupForm = this.fb.group({
      profilename: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
    });

    document.querySelectorAll('.page').forEach((page) => {
      page.addEventListener('click', () => {
        page.classList.toggle('turn'); // Toggle the class for page flipping
      });
    });

    for (let pageNo = 1; pageNo <= 10; pageNo++) {
      this.totalPages.push({
        pageNo,
        text: 'Hi',
      });
    }

    this.totalPages = this.totalPages.reverse();
  }

  onSubmit() {
    // Handle login form submission
    if (this.loginForm.valid) {
      // Access form values: this.loginForm.value
      // Process login logic here
    }
  }

  isScreenSmall(): boolean {
    return this.breakpointObserver.isMatched('(max-width: 768px)');
  }

  toggleSidenav(): void {
    // Toggle the side nav when the menu button is clicked
    // Adjust this method based on your needs
    // For example, you might want to use Angular Router to navigate
  }

  // login type switch
  switchLogin() {
    this.enableLogin = !this.enableLogin;
    this.signupForm.reset();
  }

  switchToSignUp() {
    this.enableLogin = !this.enableLogin;
    this.loginForm.reset();
  }

  // page turn
  onTurnPage(pgNo: number) {
    console.log('Turn', pgNo);

    const page = document.getElementById('page-' + pgNo);
    page?.classList.toggle('turn'); // Toggle the class for page flipping

    this.activePage = pgNo === this.activePage ? pgNo + 1 : pgNo;
  }

  // ====================================  START  ====================================  //

  // login process
  onClickLogin() {
    console.log(this.loginForm);

    if (this.loginForm.valid) {
      this.loginUser();
    }
  }

  // login user request handler
  loginUser() {
    const chunky = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

    this.appService.login(chunky).subscribe({
      next: (response: any) => {
        console.log('Login Response', response);
      },
    });
  }

  // signup process
  onClickSignup() {
    console.log(this.signupForm);

    if (this.signupForm.valid) {
      this.singupUser();
    }
  }

  // login user request handler
  singupUser() {
    const chunky = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

    this.appService.login(chunky).subscribe({
      next: (response: any) => {
        console.log('Login Response', response);
      },
    });
  }
}
