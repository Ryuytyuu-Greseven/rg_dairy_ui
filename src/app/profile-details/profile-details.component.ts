import { Component, OnDestroy } from '@angular/core';
import { AppServiceService } from '../app-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css'],
})
export class ProfileDetailsComponent implements OnDestroy {
  profileDetails: any[] = [];
  profileSubs: Subscription;

  constructor(public appService: AppServiceService) {
    this.profileSubs = this.appService.profileDetailsSubject.subscribe({
      next: (response: any) => {
        this.profileDetails = [
          {
            nameTag: 'Profile Name',
            key: response.profilename,
          },
          { nameTag: 'User Name', key: response.username },
          { nameTag: 'Email', key: response.email },
        ];
      },
    });
  }

  closeProfileDetails() {
    const overlay = document.getElementById('user-profile-content');
    overlay?.classList.toggle('open');
  }

  ngOnDestroy() {
    this.profileSubs.unsubscribe();
  }
}
