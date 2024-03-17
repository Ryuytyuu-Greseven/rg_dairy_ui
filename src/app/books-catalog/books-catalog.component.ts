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
  userLoggedIn = false;
  userView = 'public';

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
    if (sessionStorage.getItem('locator')?.length) {
      this.userLoggedIn = true;
    }

    // sessionStorage.setItem('user_view', 'public');
    if (
      sessionStorage.getItem('user_view') === 'public' ||
      !this.userLoggedIn
    ) {
      sessionStorage.setItem('user_view', 'public');
      this.userView = 'public';
    } else {
      sessionStorage.setItem('user_view', 'own');
      this.userView = 'own';
    }

    if (this.userView === 'own') {
      this.fetchDairies();
    } else {
      this.fetchPublicDairies();
    }

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

          if (sessionStorage.getItem('user_view') === 'public') {
            sessionStorage.setItem('user_view', 'public');
            this.userView = 'public';
          } else {
            sessionStorage.setItem('user_view', 'own');
            this.userView = 'own';
          }
        }
      },
    });
  }
  // opening a new book
  createNewBook() {
    this.loadNewBook = true;
    // this.router.navigate(['/book']);
  }

  // open and closed access
  loadPersonalData(type: string) {
    if (type === 'loca$%pudfic') {
      this.fetchPublicDairies();
      this.userView = 'public';
      sessionStorage.setItem('user_view', 'public');
    } else if (type === 'per(*@dety') {
      this.fetchDairies();
      this.userView = 'own';
      sessionStorage.setItem('user_view', 'own');
    }
  }

  // fetch self diaries after login
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

  // fetch self diaries after login
  fetchPublicDairies() {
    const chunky = {};
    this.selfDairies = [];

    this.appService.publicDiaries(chunky).subscribe({
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
    this.appService.currentDiary = bookDetails;
    this.router.navigate([`/books-catalog/${bookDetails?._id}`]);
  }

  ngOnDestroy() {
    this.oldBookSubsciption.unsubscribe();
    this.urlSubscription.unsubscribe();
  }
}
