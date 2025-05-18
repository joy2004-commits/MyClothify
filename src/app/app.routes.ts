import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ShopComponent } from './shop/shop.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { AdminSignInComponent } from './admin-sign-in/admin-sign-in.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './admin.guard';
import { CheckoutComponent } from './checkout/checkout.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'onboarding', component: OnboardingComponent },
  { path: 'admin/sign-in', component: AdminSignInComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];