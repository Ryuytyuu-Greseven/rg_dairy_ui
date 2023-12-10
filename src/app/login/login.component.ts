import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppServiceService } from '../app-service.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  // ====================================  START  ====================================  //

  // login type
  activePage = 1;
  enableLogin = true;

  loginForm!: FormGroup;
  signupForm!: FormGroup;
  emailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // signup/login process
  singup_loading = false;

  // text animation
  animationInProcess = true;

  constructor(
    private formbuilder: FormBuilder,
    private appService: AppServiceService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    sessionStorage.clear();
    setTimeout(() => {
      this.stopAnimation();
    }, 4000);

    this.loginForm = this.formbuilder.group({
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

    this.signupForm = this.formbuilder.group({
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
  }

  // login type switch
  switchLogin() {
    this.enableLogin = !this.enableLogin;
    this.signupForm.reset();
    this.signupForm.updateValueAndValidity();
  }

  switchToSignUp() {
    this.enableLogin = !this.enableLogin;
    this.loginForm.reset();
    this.loginForm.updateValueAndValidity();
  }

  // login process
  onClickLogin() {
    console.log(this.loginForm);

    if (this.loginForm.valid) {
      this.loginUser();
    }
  }

  // login user request handler
  loginUser() {
    if (this.singup_loading) {
      return;
    }

    this.singup_loading = true;
    const chunky = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

    this.appService.login(chunky).subscribe({
      next: (response: any) => {
        console.log('Login Response', response);
        this.singup_loading = false;
        if (response?.success) {
          sessionStorage.setItem('locator', response.data.access_token);
          sessionStorage.setItem('name', response.data.profilename);
          sessionStorage.setItem('email', response.data.email);
          sessionStorage.setItem('username', response.data.username);
          this.toastr.success(response.message);
          this.loginForm.reset();
          this.router.navigateByUrl('/book');
        } else {
          this.toastr.error(response.message);
        }
      },
      error: () => {
        this.singup_loading = false;
        this.toastr.error('Unable to login.');
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
    if (this.singup_loading) {
      return;
    }
    this.singup_loading = true;
    const chunky = {
      username: this.signupForm.value.username,
      password: this.signupForm.value.password,
      email: this.signupForm.value.email,
      profilename: this.signupForm.value.profilename,
    };

    this.appService.singup(chunky).subscribe({
      next: (response: any) => {
        console.log('Login Response', response);
        this.singup_loading = false;
        if (response?.success) {
          this.toastr.success(response.message);
          this.enableLogin = true;
          this.signupForm.reset();
        } else {
          this.toastr.error(response.message);
        }
      },
      error: (error: any) => {
        console.log(error);
        this.singup_loading = false;
        this.toastr.error('Unable to create an account.');
      },
    });
  }

  // =================  FORM VALIDATIONS  =====================  //
  replaceSpace(event: any) {
    console.log(event.target.value);
    event.target.value = event.target.value.replace(/ /g, '_').trim();
    return event;
    // this.signupForm.patchValue({
    //   username: newValue,
    // });
    // this.signupForm.updateValueAndValidity();
  }

  adjustFontSize(finalSize: any) {
    let changingText: any = document.getElementById('logotext');

    changingText.style.animation = `textAnimation 5s infinite alternate`;
    changingText.style.fontSize = finalSize + 'px';
  }

  stopAnimation() {
    let changingText: any = document.getElementById('logotext');

    // changingText.style.animation = 'none';
    this.animationInProcess = false;
  }
}
