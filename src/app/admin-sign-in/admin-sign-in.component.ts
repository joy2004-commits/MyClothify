import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-admin-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './admin-sign-in.component.html',
  styleUrls: ['./admin-sign-in.component.css'],
  animations: [
    trigger('slideIn', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [animate('400ms ease-out')])
    ])
  ]
})
export class AdminSignInComponent {
  adminSignInForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.adminSignInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Initialize default admin if none exist
    const admins = JSON.parse(localStorage.getItem('clothify-admin-users') || '[]');
    if (!admins.length) {
      admins.push({ email: 'admin@clothify.com', password: 'admin123' });
      localStorage.setItem('clothify-admin-users', JSON.stringify(admins));
    }
  }

  onSubmit() {
    if (this.adminSignInForm.valid) {
      const { email, password } = this.adminSignInForm.value;
      const admins = JSON.parse(localStorage.getItem('clothify-admin-users') || '[]');
      
      const admin = admins.find((a: any) => a.email === email && a.password === password);
      if (admin) {
        localStorage.setItem('clothify-current-admin', JSON.stringify({ email }));
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.errorMessage = 'Invalid admin email or password';
      }
    }
  }
}