import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';

interface CartItem {
  product: { id: number; name: string; price: number; image: string };
  quantity: number;
}

interface Order {
  id: number;
  userEmail: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
  date: string;
  shippingAddress: { name: string; address: string; phone?: string };
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [animate('600ms ease-out')])
    ])
  ]
})
export class CheckoutComponent implements OnInit {
  cart: CartItem[] = [];
  checkoutForm: FormGroup;
  orderConfirmation: { id: number; total: number } | null = null;
  userCartKey: string = '';

  constructor(private router: Router, private fb: FormBuilder) {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.pattern(/^\d{10}$/)]]
    });
  }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('clothify-current-user') || '{}');
    this.userCartKey = `clothify-cart-${currentUser.email || 'guest'}`;

    const storedCart = localStorage.getItem(this.userCartKey);
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    }
    if (!this.cart.length) {
      this.router.navigate(['/shop']);
    }
  }

  getCartTotal(): number {
    return this.cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      const user = JSON.parse(localStorage.getItem('clothify-current-user') || '{}');
      const orders = JSON.parse(localStorage.getItem('clothify-orders') || '[]');
      const orderId = orders.length ? Math.max(...orders.map((o: Order) => o.id)) + 1 : 1;
      const order: Order = {
        id: orderId,
        userEmail: user.email || 'guest@example.com',
        items: this.cart,
        total: this.getCartTotal(),
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        shippingAddress: this.checkoutForm.value
      };

      orders.push(order);
      localStorage.setItem('clothify-orders', JSON.stringify(orders));
      localStorage.removeItem(this.userCartKey); // Clear user-specific cart
      this.orderConfirmation = { id: orderId, total: order.total };
      this.cart = [];

      setTimeout(() => {
        this.router.navigate(['/shop']);
      }, 3000);
    }
  }

  cancel() {
    this.router.navigate(['/shop']);
  }
}