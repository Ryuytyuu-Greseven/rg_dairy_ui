import { Component } from '@angular/core';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
})
export class BookComponent {
  // pages
  totalPages: Array<any> = [];
  previousTurnedPage = 0;

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
}
