import { Component } from '@angular/core';
import { contactProfile } from './contact-profile.interface';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
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
export class AboutComponent {
  constructor() {}
}
