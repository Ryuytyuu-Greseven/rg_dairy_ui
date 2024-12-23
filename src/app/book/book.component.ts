import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  OnInit,
} from '@angular/core';
import { AppServiceService } from '../app-service.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css', './book2.component.css'],
})
export class BookComponent implements OnDestroy, OnInit {
  // current book
  currentDairyId = '';
  currentDairyDetails: any = {};
  disableBookActions = false;

  // user details
  userDetails: any = {};

  // pages
  totalPages: Array<any> = [];
  previousTurnedPage = 0;
  isUserWriting = false;
  isDairyClosed = true;

  title = 'Title';
  year = `${new Date().getFullYear()}`;
  diaryType = 1;
  diaryLevel = 2;

  // requests loading
  book_loading = false;

  // fonts
  fontsAvailable: { font: string; title: string }[] = [];
  currentFont = { font: 'cursive', title: 'Cursive' };

  // colors
  staticBGColor = '#E0C9A6';
  bgColorSelected = this.staticBGColor;
  bgColorSelecetdTitle = '#000000';

  // subscriptions
  urlSubscription = new Subscription();
  profileSubs: Subscription;

  @Input() bookType: 'new' | 'old' = 'old';
  @Output() incomingBook = new EventEmitter();

  constructor(
    private appService: AppServiceService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.profileSubs = this.appService.profileDetailsSubject.subscribe({
      next: (response: any) => {
        this.userDetails = response;
      },
    });
  }

  ngOnInit() {
    console.log('Yeah Book Opened');
    this.diaryType = 1;
    this.diaryLevel = 2;

    this.urlSubscription = this.activatedRoute.url.subscribe({
      next: (query) => {
        console.log(query);

        if (query.length && query[0].path !== 'books-catalog') {
          console.log(query[0].path);
          this.currentDairyId = query[0].path;
          // fetch dairy pages
          this.title = 'Loading . . .';
          this.year = '';
          this.bookType = 'old';
          this.previousTurnedPage = 0;
          const userView = sessionStorage.getItem('user_view');
          if (this.appService.currentDiary?.title) {
            this.collectDiaryDetails(this.appService.currentDiary);
          }
          if (
            sessionStorage.getItem('locator')?.length &&
            (!userView || userView === 'own')
          ) {
            this.fetchDairy();
            this.fetchPages();
            this.userDetails = this.appService.profileDetails;
          } else {
            this.fetchPublicDiary();
            this.fetchPublicPages();
            this.userDetails = {};
          }
        }
      },
    });

    // console.log(this.activatedRoute.url);
    // for (let pageNo = 1; pageNo <= 10; pageNo++) {
    //   this.totalPages.push({
    //     pageNo,
    //     text: 'Hi',
    //     turned: false,
    //   });
    // }

    // this.totalPages = this.totalPages.reverse();

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

  // turn to next page
  openDairy() {
    if (this.previousTurnedPage === 0) {
      const page = document.getElementById('book-open-card');
      page?.classList.toggle('turn'); // Toggle the class for page flipping
      this.isDairyClosed = !this.isDairyClosed;
    }
  }
  // turn to next page
  onTurnPage(pageDetails: any, ind: number) {
    console.log('Turn', pageDetails);
    if (this.isUserWriting) {
      return;
    }
    if (!pageDetails?.turned) {
      pageDetails.turned = true;
      this.previousTurnedPage = pageDetails.pageNo;
      const page = document.getElementById('page-' + pageDetails.pageNo);
      page?.classList.toggle('turn'); // Toggle the class for page flipping
    }
    console.log(pageDetails);

    // this.activePage = pgNo === this.activePage ? pgNo + 1 : pgNo;
  }

  // turn the previous page
  onTurnPreviousPage(pageDetails: any, ind: number) {
    let previousPageDetails: any = {};

    if (this.previousTurnedPage === 1) {
      previousPageDetails = this.totalPages.slice(-this.previousTurnedPage)[0];
    } else {
      previousPageDetails = this.totalPages.slice(
        -this.previousTurnedPage,
        -this.previousTurnedPage + 1
      )[0];
    }

    if (this.isUserWriting || !previousPageDetails?.turned) {
      return;
    }
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

  // toggle the layers
  toggleCustomizationLayers() {
    console.log('Toggle Layers');
    const layers = document.getElementById('custom-layers-toggle');
    layers?.classList.toggle('custom-layers-toggle-open');
    this.disableBookActions = !this.disableBookActions;

    const layer2 = document.getElementById('book-card');
    layer2?.classList.toggle('book-freeze');
  }

  // change diary type
  changeDiaryType(type: 1 | 2) {
    this.diaryType = type;
  }

  // change diary level
  changeDiaryLevel(type: 1 | 2) {
    this.diaryLevel = type;
  }

  // create a new dairy
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
      type: this.diaryType,
      accessLevel: this.diaryLevel,
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
            this.toastr.error('Unable to create diary.');
          }
        },
        error: (error: any) => {
          console.log(error);
          this.book_loading = false;
          this.toastr.error('Unable to create diary.');
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

  //  ==================   DAIRY DETAILS   ===================  //
  fetchDairy() {
    const chunky = {
      dairyId: this.currentDairyId,
    };

    this.appService.dairyDetails(chunky).subscribe({
      next: (response: any) => {
        console.log('Login Response', response);

        if (response?.success) {
          this.collectDiaryDetails(response.data);
        } else {
          this.toastr.error(response.message);
        }
      },
      error: () => {
        this.toastr.error('Unable to login.');
      },
    });
  }

  collectDiaryDetails(book: any) {
    // this.previousTurnedPage = 0;
    this.currentDairyDetails = book;
    this.title = this.currentDairyDetails.title;
    this.year = this.currentDairyDetails.year;
    this.bgColorSelected = this.currentDairyDetails.bookConfig.color;
    this.bgColorSelecetdTitle = this.currentDairyDetails.titleConfig.color;
  }

  // fetch the publix diary
  fetchPublicDiary() {
    const chunky = {
      dairyId: this.currentDairyId,
    };

    this.appService.publicDiaryDetails(chunky).subscribe({
      next: (response: any) => {
        console.log('Login Response', response);

        if (response?.success) {
          // this.previousTurnedPage = 0;
          this.collectDiaryDetails(response.data);
        } else {
          this.toastr.error(response.message);
        }
      },
      error: () => {
        this.toastr.error('Unable to login.');
      },
    });
  }

  closeOldDairy() {
    this.router.navigate(['/books-catalog']);
    this.appService.currentDiary = {};
    this.appService.oldDairySubject.next(false);
  }

  //  =========================  PAGE DATA  ===========================  //
  editPage() {
    this.isUserWriting = !this.isUserWriting;
  }
  // Handle user input and apply styles to selected words
  handleInput(event: Event) {
    console.log('Selection', event);

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedNode = range.commonAncestorContainer;

      // Check if the selected node is within the editable word span
      if (
        selectedNode.parentElement &&
        selectedNode.parentElement.classList.contains('editable-word')
      ) {
        // Apply font style to the selected word
        selectedNode.parentElement.style.fontFamily = 'Verdana'; // Change font as needed
      }
    }
  }

  // save a new or old page
  savePage(pageDetails: any) {
    if (this.book_loading) {
      return;
    }

    this.book_loading = true;
    let text = document.getElementById(
      'user-text-input-' + pageDetails.pageNo
    )?.innerHTML;

    text = text?.replaceAll('<p></p>', '');

    const chunky = {
      text,
      pageNo: pageDetails.pageNo,
      bookId: this.currentDairyId,
      pageId: pageDetails._id,
    };

    console.log(pageDetails, chunky);

    this.appService.savePage(chunky).subscribe({
      next: (response: any) => {
        console.log('Page Save Response', response);
        this.book_loading = false;

        if (response?.success) {
          pageDetails = response.data;
          this.isUserWriting = false;
        } else {
          this.toastr.error(response.message);
        }
      },
      error: () => {
        this.book_loading = false;
        this.toastr.error('Ooops!! Try again!');
      },
    });
  }

  // fetching pages in dairy
  fetchPages() {
    if (this.book_loading) {
      return;
    }

    this.book_loading = true;
    const chunky = {
      // pageNo: 1,
      dairyId: this.currentDairyId,
    };

    this.appService.pagesFromDairy(chunky).subscribe({
      next: (response: any) => {
        console.log('Pages Response', response);
        this.book_loading = false;

        if (response?.success) {
          const newPages = [...response.data];

          this.totalPages.unshift(...newPages.reverse());
        } else {
          this.toastr.error(response.message);
        }
      },
      error: (error) => {
        console.log(error);
        this.book_loading = false;
        this.toastr.error('Ooops!! Try again!');
      },
    });
  }

  // fetching the apges in public diary
  fetchPublicPages() {
    if (this.book_loading) {
      return;
    }

    this.book_loading = true;
    const chunky = {
      // pageNo: 1,
      dairyId: this.currentDairyId,
    };

    this.appService.pagesFromPublicDiary(chunky).subscribe({
      next: (response: any) => {
        console.log('Pages Response', response);
        this.book_loading = false;

        if (response?.success) {
          const newPages = [...response.data];

          this.totalPages.unshift(...newPages.reverse());
        } else {
          this.toastr.error(response.message);
        }
      },
      error: (error) => {
        console.log(error);
        this.book_loading = false;
        this.toastr.error('Ooops!! Try again!');
      },
    });
  }

  addNewPage() {
    this.totalPages.unshift({
      text: 'Write someting...',
      pageNo: this.totalPages.length + 1,
    });
  }

  ngOnDestroy() {
    this.urlSubscription.unsubscribe();
    this.profileSubs.unsubscribe();
  }
}
