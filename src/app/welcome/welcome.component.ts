import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  animations: [
    trigger('fadeInScale', [
      state('void', style({
        opacity: 0,
        transform: 'scale(0.8)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('void => *', [
        animate('600ms ease-out')
      ])
    ])
  ]
})
export class WelcomeComponent {}