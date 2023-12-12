import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppServiceService } from '../app-service.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-books-catalog',
  templateUrl: './books-catalog.component.html',
  styleUrls: ['./books-catalog.component.css'],
})
export class BooksCatalogComponent implements OnDestroy, OnInit {
  loadNewBook = false;

  selfDairies: any[] = [];

  // child book component
  isBookOpened = false;
  oldBookSubsciption = new Subscription();

  // subscriptions
  urlSubscription = new Subscription();

  constructor(
    private toastr: ToastrService,
    private appService: AppServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.fetchDairies();

    this.urlSubscription = this.activatedRoute.url.subscribe({
      next: (url) => {
        console.log(
          'This is books catalog',
          this.router.url,
          this.router.url.split('/')[2]
        );
        const bookId = this.router.url.split('/')[2];
        if (bookId) {
          // fetch dairy pages
          this.isBookOpened = true;
          this.openBook({ _id: bookId });
        } else {
          this.isBookOpened = false;
        }
      },
    });

    this.oldBookSubsciption = this.appService.oldDairySubject.subscribe({
      next: (event) => {
        if (!event) {
          this.isBookOpened = false;
        }
      },
    });
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

  openBook(bookDetails: any) {
    this.isBookOpened = true;
    this.router.navigate([`/books-catalog/${bookDetails?._id}`]);
  }

  ngOnDestroy() {
    this.oldBookSubsciption.unsubscribe();
    this.urlSubscription.unsubscribe();
  }
}
