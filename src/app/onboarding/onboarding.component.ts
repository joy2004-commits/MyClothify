import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css'],
  animations: [
    trigger('slide', [
      transition(':increment', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in-out', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class OnboardingComponent {
  currentSlide = 0;
  slides = [
    {
      title: 'Welcome to Clothify',
      description: 'Explore curated fashion tailored to your style.',
      image: 'assets/welcome.png',
      fallbackImage: 'https://via.placeholder.com/300x400?text=Welcome'
    },
    {
      title: 'Discover Unique Pieces',
      description: 'Find high-quality clothing that stands out.',
      image: 'assets/discover.jpg',
      fallbackImage: 'https://via.placeholder.com/300x400?text=Discover'
    },
    {
      title: 'Shop with Ease',
      description: 'Enjoy a seamless shopping experience.',
      image: 'assets/shop.jpg',
      fallbackImage: 'https://via.placeholder.com/300x400?text=Shop'
    }
  ];

  private touchStartX = 0;
  private touchEndX = 0;

  constructor(private router: Router) {}

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe() {
    const swipeThreshold = 50;
    if (this.touchStartX - this.touchEndX > swipeThreshold) {
      this.nextSlide();
    } else if (this.touchEndX - this.touchStartX > swipeThreshold) {
      this.prevSlide();
    }
  }

  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    } else {
      this.completeOnboarding();
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  skipOnboarding() {
    this.completeOnboarding();
  }

  completeOnboarding() {
    localStorage.setItem('clothify-onboarding-completed', 'true');
    this.router.navigate(['/shop']);
  }
}