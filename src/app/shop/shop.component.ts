import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FilterByProductIdPipe } from '../filter-by-product-id.pipe';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  image: string;
  description: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, FilterByProductIdPipe],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [animate('600ms ease-out')])
    ]),
    trigger('cartFly', [
      state('start', style({ transform: 'translate(0, 0) scale(1)', opacity: 1 })),
      state('end', style({ transform: 'translate(100vw, -100vh) scale(0.5)', opacity: 0 })),
      transition('start => end', [animate('500ms ease-in')])
    ]),
    trigger('modalFade', [
      state('void', style({ opacity: 0, transform: 'scale(0.8)' })),
      state('*', style({ opacity: 1, transform: 'scale(1)' })),
      transition('void => *', [animate('300ms ease-out')]),
      transition('* => void', [animate('200ms ease-in')])
    ])
  ]
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  cart: CartItem[] = [];
  categories: string[] = [];
  selectedCategory: string = 'All';
  priceRange: number = 100;
  searchQuery: string = '';
  showCartModal: boolean = false;
  showQuickView: Product | null = null;
  cartAnimation: { productId: number; state: string }[] = [];
  userCartKey: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('clothify-current-user') || '{}');
    this.userCartKey = `clothify-cart-${currentUser.email || 'guest'}`;

    const storedProducts = localStorage.getItem('clothify-products');
    if (storedProducts) {
      this.products = JSON.parse(storedProducts);
    } else {
      this.products = [
        { id: 1, name: 'Beige Linen Shirt', price: 49.99, category: 'Shirts', rating: 4.5, image: '/assets/beige-linen-shirt.jpg', description: 'Lightweight and breathable.' },
        { id: 2, name: 'Khaki Chinos', price: 59.99, category: 'Pants', rating: 4.2, image: '/assets/khaki-chinos.jpg', description: 'Versatile and stylish.' },
        { id: 3, name: 'Cream Button-Up', price: 39.99, category: 'Shirts', rating: 4.0, image: '/assets/cream-button-up.jpg', description: 'Classic and comfortable.' },
        { id: 4, name: 'Sand Cargo Pants', price: 69.99, category: 'Pants', rating: 4.7, image: '/assets/sand-cargo-pants.jpg', description: 'Durable with multiple pockets.' },
        { id: 5, name: 'Ivory T-Shirt', price: 29.99, category: 'Shirts', rating: 3.8, image: '/assets/ivory-t-shirt.jpg', description: 'Soft and casual.' }
      ];
      localStorage.setItem('clothify-products', JSON.stringify(this.products));
    }

    const storedCart = localStorage.getItem(this.userCartKey);
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    } else {
      this.cart = [];
      localStorage.setItem(this.userCartKey, JSON.stringify(this.cart));
    }

    this.categories = ['All', ...new Set(this.products.map(p => p.category))];
    this.filterProducts();
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesCategory = this.selectedCategory === 'All' || product.category === this.selectedCategory;
      const matchesPrice = product.price <= this.priceRange;
      const matchesSearch = product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesCategory && matchesPrice && matchesSearch;
    });
  }

  addToCart(product: Product) {
    this.cartAnimation.push({ productId: product.id, state: 'start' });
    setTimeout(() => {
      this.cartAnimation = this.cartAnimation.map(a => a.productId === product.id ? { ...a, state: 'end' } : a);
      setTimeout(() => {
        this.cartAnimation = this.cartAnimation.filter(a => a.productId !== product.id);
      }, 500);
    }, 100);

    const existingItem = this.cart.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({ product, quantity: 1 });
    }
    localStorage.setItem(this.userCartKey, JSON.stringify(this.cart));
  }

  updateCartItemQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.cart = this.cart.filter(item => item.product.id !== productId);
    } else {
      const item = this.cart.find(item => item.product.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    }
    localStorage.setItem(this.userCartKey, JSON.stringify(this.cart));
  }

  openQuickView(product: Product) {
    this.showQuickView = product;
  }

  closeQuickView() {
    this.showQuickView = null;
  }

  toggleCartModal() {
    this.showCartModal = !this.showCartModal;
  }

  getCartTotal() {
    return this.cart.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);
  }

  signOut() {
    localStorage.removeItem('clothify-current-user');
    localStorage.removeItem('clothify-onboarding-completed');
    localStorage.removeItem(this.userCartKey);
    this.cart = [];
    this.router.navigate(['/sign-in']);
  }

  @HostListener('window:resize')
  onResize() {
    this.filterProducts();
  }
}