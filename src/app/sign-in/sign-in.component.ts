import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  animations: [
    trigger('slideIn', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [animate('400ms ease-out')])
    ])
  ]
})
export class SignInComponent {
  signInForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signInForm.valid) {
      const { email, password } = this.signInForm.value;
      const users = JSON.parse(localStorage.getItem('clothify-users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem('clothify-current-user', JSON.stringify({ email }));

        // Migrate legacy cart data (if any) to user-specific cart
        const legacyCart = localStorage.getItem('clothify-cart');
        const userCartKey = `clothify-cart-${email}`;
        if (legacyCart && !localStorage.getItem(userCartKey)) {
          localStorage.setItem(userCartKey, legacyCart);
          localStorage.removeItem('clothify-cart'); // Clear legacy cart
        } else if (!localStorage.getItem(userCartKey)) {
          localStorage.setItem(userCartKey, JSON.stringify([])); // Initialize empty cart
        }

        const onboardingCompleted = localStorage.getItem('clothify-onboarding-completed');
        this.router.navigate([onboardingCompleted ? '/shop' : '/onboarding']);
      } else {
        this.errorMessage = 'Invalid email or password';
      }
    }
  }
}