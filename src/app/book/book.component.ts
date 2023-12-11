import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppServiceService } from '../app-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
})
export class BookComponent {
  // pages
  totalPages: Array<any> = [];
  previousTurnedPage = 0;

  title = 'Title';
  year = new Date().getFullYear();

  // requests loading
  book_loading = false;

  @Input() bookType: 'new' | 'old' = 'old';
  @Output() incomingBook = new EventEmitter();

  constructor(
    private appService: AppServiceService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    for (let pageNo = 1; pageNo <= 10; pageNo++) {
      this.totalPages.push({
        pageNo,
        text: 'Hi',
        turned: false,
      });
    }

    this.totalPages = this.totalPages.reverse();
  }

  // page turn
  onTurnPage(pageDetails: any) {
    console.log('Turn', pageDetails);

    if (!pageDetails?.turned) {
      pageDetails.turned = true;
      this.previousTurnedPage = pageDetails.pageNo;
      const page = document.getElementById('page-' + pageDetails.pageNo);
      page?.classList.toggle('turn'); // Toggle the class for page flipping
    } else {
      if (this.previousTurnedPage === 1) {
        this.totalPages.slice(-this.previousTurnedPage)[0].turned = false;
      } else {
        this.totalPages.slice(
          -this.previousTurnedPage,
          -this.previousTurnedPage + 1
        )[0].turned = false;
      }
      // pageDetails.turned = false;
      const page = document.getElementById('page-' + this.previousTurnedPage);
      page?.classList.toggle('turn'); // Toggle the class for page flipping
      this.previousTurnedPage -= 1;
    }
    console.log(pageDetails);

    // this.activePage = pgNo === this.activePage ? pgNo + 1 : pgNo;
  }

  createDairy() {
    if (this.book_loading) {
      return;
    }

    this.book_loading = true;
    const chunky = {
      title: document.getElementById('book-title')?.innerText,
      year: document.getElementById('book-year')?.innerText,
    };

    console.log(chunky);

    if (chunky?.title?.length && chunky?.year) {
      this.appService.createDairy(chunky).subscribe({
        next: (response: any) => {
          console.log(response);
          this.book_loading = false;
          if (response?.success) {
            this.toastr.success(response.message);
            this.incomingBook.emit(true);
          } else {
            this.toastr.error('Unable to create dairy.');
          }
        },
        error: (error: any) => {
          console.log(error);
          this.book_loading = false;
          this.toastr.error('Unable to create dairy.');
        },
      });
    }
  }

  closeDairy() {
    this.incomingBook.emit(false);
  }
}
