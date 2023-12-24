import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppServiceService } from '../app-service.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', './login2.component.css'],
})
export class LoginComponent {
  // ====================================  START  ====================================  //

  // login type
  activePage = 1;
  loginMode = 'login';

  // password
  isPassVisivble = false;

  loginForm!: FormGroup;
  signupForm!: FormGroup;
  otpForm!: FormGroup;
  passResetForm!: FormGroup;

  emailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // user id
  userIdToProcess = '';

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
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
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
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
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

    this.otpForm = this.formbuilder.group({
      otp1: ['', Validators.required],
      otp2: ['', Validators.required],
      otp3: ['', Validators.required],
      otp4: ['', Validators.required],
    });

    this.passResetForm = this.formbuilder.group({
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

  // =====================  password & it's masking  =====================  //
  // password view
  openPass() {
    this.isPassVisivble = !this.isPassVisivble;
  }

  // login type switch
  switchToLogin() {
    this.loginMode = 'login';
    this.signupForm.reset();
    this.passResetForm.reset();
    this.otpForm.reset();
    this.userIdToProcess = '';
    this.signupForm.updateValueAndValidity();
  }

  switchToSignUp() {
    this.loginMode = 'signup';
    this.loginForm.reset();
    this.loginForm.updateValueAndValidity();
  }

  onClickForgotPass() {
    this.loginMode = 'pass_reset';
    this.loginForm.reset();
    this.loginForm.updateValueAndValidity();
  }

  // login process
  onClickLogin() {
    this.loginForm.markAllAsTouched();
    this.loginForm.markAsDirty();
    this.loginForm.updateValueAndValidity();
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
      username: `${this.loginForm.value.username}`.trim().toLowerCase(),
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
          this.router.navigateByUrl('/books-catalog');
          this.appService.userLoggedIn = true;
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
    this.signupForm.markAllAsTouched();
    this.signupForm.markAsDirty();
    this.signupForm.updateValueAndValidity();

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
      username: `${this.signupForm.value.username}`.trim().toLowerCase(),
      password: `${this.signupForm.value.password}`,
      email: `${this.signupForm.value.email}`.trim().toLowerCase(),
      profilename: `${this.signupForm.value.profilename}`.trim(),
    };

    this.appService.singup(chunky).subscribe({
      next: (response: any) => {
        console.log('Login Response', response);
        this.singup_loading = false;
        if (response?.success) {
          this.userIdToProcess = response.userId;
          // this.toastr.success(response.message);
          this.loginMode = 'otp';
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

  onVerifyOtp() {
    if (this.otpForm.valid) {
      this.verifySignUp();
    }
  }

  verifySignUp() {
    if (this.singup_loading) {
      return;
    }

    this.singup_loading = true;
    let otp = '';
    for (const formControl in this.otpForm.controls) {
      otp += this.otpForm.value[formControl];
    }

    const chunky = {
      userId: this.userIdToProcess,
      otp: otp,
    };

    this.appService.verifyUser(chunky).subscribe({
      next: (response: any) => {
        console.log('Login Response', response);
        this.singup_loading = false;
        if (response?.success) {
          this.toastr.success(response.message);
          this.loginMode = 'login';
          this.otpForm.reset();
          this.userIdToProcess = '';
        } else {
          this.toastr.error(response.message);
        }
      },
      error: (error: any) => {
        console.log(error);
        this.singup_loading = false;
        this.toastr.error('Unable to verify an account.');
      },
    });
  }

  requestOTP() {
    if (this.singup_loading) {
      return;
    }

    this.singup_loading = true;
    const chunky = {
      userId: this.userIdToProcess,
    };

    this.appService.resendOtp(chunky).subscribe({
      next: (response: any) => {
        console.log('Login Response', response);
        this.singup_loading = false;
        if (response?.success) {
          this.toastr.success(response.message);
          this.otpForm.reset();
          this.signupForm.reset();
        } else {
          this.toastr.error(response.message);
        }
      },
      error: (error: any) => {
        console.log(error);
        this.singup_loading = false;
        this.toastr.error('Unable to resend otp.');
      },
    });
  }

  onClickPassSendOtp() {
    this.passResetForm.markAllAsTouched();
    this.passResetForm.markAsDirty();
    this.passResetForm.updateValueAndValidity();

    if (this.passResetForm.valid) {
      this.requestForgotPass();
    }
  }

  requestForgotPass() {
    if (this.singup_loading) {
      return;
    }

    this.singup_loading = true;
    const chunky = {
      email: this.passResetForm.value.email,
      password: this.passResetForm.value.password,
    };

    this.appService.forgotPassword(chunky).subscribe({
      next: (response: any) => {
        console.log('Forgot pass Response', response);
        this.singup_loading = false;

        if (response?.success) {
          this.loginMode = 'pass_reset_otp';
          this.userIdToProcess = response.userId;
          this.passResetForm.reset();
        } else {
          this.toastr.error(response.message);
        }
      },
      error: (error: any) => {
        console.log(error);
        this.singup_loading = false;
        this.toastr.error('Unable to request password reset.');
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

  //  ===================  OTP  =====================  //
  switchOtp(otpInput: number) {
    $(`#otp-${otpInput}`).focus();
  }

  //  ================  EVENTS  ==================  //
  spaceValidation(event: any) {
    if (event.target.value.charCodeAt() === 32) {
      return false;
    }
    return event;
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
