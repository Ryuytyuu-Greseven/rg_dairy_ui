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

  // fonts
  fontsAvailable: { font: string; title: string }[] = [];
  currentFont = { font: 'cursive', title: 'Cursive' };

  // colors
  staticBGColor = '#E0C9A6';
  bgColorSelected = this.staticBGColor;
  bgColorSelecetdTitle = '#000000';

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

    this.fontsAvailable = this.getAllHtmlFonts;
  }

  // returns fonts array
  get getAllHtmlFonts() {
    return [
      { font: 'roboto', title: 'Roboto' },
      { font: 'cursive', title: 'Cursive' },
      { font: 'fantasy', title: 'Fantasy' },
      { font: 'math', title: 'Math' },
      { font: 'monospace', title: 'Monospace' },
      { font: 'Times New Roman', title: 'Times New Roman' },
      { font: 'Verdana', title: 'Verdana' },
      { font: 'Georgia', title: 'Georgia' },
      { font: 'Courier New', title: 'Courier New' },
      { font: 'Ubuntu', title: 'Ubuntu' },
    ];
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
      font: this.currentFont.font,
      titleColor: this.bgColorSelecetdTitle,
      bookColor: this.bgColorSelected,
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

  // =======  FONTS  ==========  //
  applyFont(font: any) {
    this.currentFont = font;
  }

  onColorPickedBook(event: any) {
    console.log(event.target.value);
    this.bgColorSelected = event.target.value;
  }
  onColorPickedTitle(event: any) {
    console.log(event.target.value);
    this.bgColorSelecetdTitle = event.target.value;
  }
}
