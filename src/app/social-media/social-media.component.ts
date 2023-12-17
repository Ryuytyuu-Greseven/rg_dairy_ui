import { Component } from '@angular/core';
import { contactProfile } from '../about/contact-profile.interface';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.css'],
  animations: [
    trigger('contactAnimation', [
      state('void', style({ opacity: 1 })), // Initial state when the element is added to the DOM
      transition(':enter, :leave', [
        animate(
          '2s ease-in-out',
          keyframes([
            style({ offset: 0 }), // Initial state
            style({ offset: 0.5 }), // Middle state
            style({ offset: 1 }), // Final state
          ])
        ),
      ]),
    ]),
  ],
})
export class SocialMediaComponent {
  urlsList: contactProfile[];

  constructor() {
    this.urlsList = this.allProfilesList;
  }

  get allProfilesList(): contactProfile[] {
    return [
      {
        profileLink: 'https://github.com/Ryuytyuu-Greseven',
        icon: 'fa-github',
        portal: 'github',
      },
      {
        profileLink: 'https://www.linkedin.com/in/ryuytyuu-greseven',
        icon: 'fa-linkedin',
        portal: 'linkedin',
      },
      {
        profileLink: 'https://www.instagram.com/ryuytyuu_greseven',
        icon: 'fa-instagram',
        portal: 'instagram',
      },
      {
        profileLink: 'https://twitter.com/Ryuytyuu',
        icon: 'fa-twitter-square',
        portal: 'twitter',
      },
      {
        profileLink: 'https://www.reddit.com/user/Critical_Pianist_947',
        icon: 'fa-reddit-alien',
        portal: 'reddit',
      },
    ];
  }
}
