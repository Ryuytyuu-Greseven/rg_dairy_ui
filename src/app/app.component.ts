import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppServiceService } from './app-service.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'dairy_ui';



  constructor(
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private appService: AppServiceService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

  }

  isScreenSmall(): boolean {
    return this.breakpointObserver.isMatched('(max-width: 768px)');
  }

  toggleSidenav(): void {
    // Toggle the side nav when the menu button is clicked
    // Adjust this method based on your needs
    // For example, you might want to use Angular Router to navigate
  }




}
