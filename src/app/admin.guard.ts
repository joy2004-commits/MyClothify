import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const currentAdmin = localStorage.getItem('clothify-current-admin');
    if (currentAdmin) {
      return true;
    }
    this.router.navigate(['/admin/sign-in']);
    return false;
  }
}