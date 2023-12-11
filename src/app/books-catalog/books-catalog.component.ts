import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppServiceService } from '../app-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-books-catalog',
  templateUrl: './books-catalog.component.html',
  styleUrls: ['./books-catalog.component.css'],
})
export class BooksCatalogComponent {
  loadNewBook = false;

  selfDairies: any[] = [];

  constructor(
    private toastr: ToastrService,
    private appService: AppServiceService
  ) {}

  ngOnInit() {
    this.fetchDairies();
  }
  // opening a new book
  createNewBook() {
    this.loadNewBook = true;
    // this.router.navigate(['/book']);
  }

  fetchDairies() {
    const chunky = {};
    this.selfDairies = [];

    this.appService.selfDairies(chunky).subscribe({
      next: (response: any) => {
        console.log(response);

        if (response?.success) {
          this.selfDairies = response.data;
          // this.toastr.success(response.message);
        } else {
          this.toastr.error('Unable to fetch dairies.');
        }
      },
      error: (error: any) => {
        console.log(error);
        this.toastr.error('Unable to fetch dairies');
      },
    });
  }

  newDairyAdded(event: boolean) {
    if (event) {
      this.fetchDairies();
    }
    this.loadNewBook = false;
  }
}
