import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  image: string; // Can be a URL (e.g., /assets/image.jpg) or base64 string (e.g., data:image/jpeg;base64,...)
  description: string;
}

interface Order {
  id: number;
  userEmail: string;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
  date: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [animate('600ms ease-out')])
    ]),
    trigger('modalFade', [
      state('void', style({ opacity: 0, transform: 'scale(0.8)' })),
      state('*', style({ opacity: 1, transform: 'scale(1)' })),
      transition('void => *', [animate('300ms ease-out')]),
      transition('* => void', [animate('200ms ease-in')])
    ])
  ]
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'products' | 'orders' = 'products';
  products: Product[] = [];
  orders: Order[] = [];
  showAddProductModal = false;
  showEditProductModal: Product | null = null;
  showDeleteConfirm: Product | null = null;
  newProduct: Product = { id: 0, name: '', price: 0, category: '', rating: 0, image: '', description: '' };
  imagePreview: string | null = null; // For displaying selected image in modals

  constructor(private router: Router) {}

  ngOnInit() {
    const storedProducts = localStorage.getItem('clothify-products');
    if (storedProducts) {
      this.products = JSON.parse(storedProducts);
    }

    const storedOrders = localStorage.getItem('clothify-orders');
    if (storedOrders) {
      this.orders = JSON.parse(storedOrders);
    } else {
      this.orders = [
        { id: 1, userEmail: 'user1@example.com', total: 99.98, status: 'Pending', date: '2025-05-18' },
        { id: 2, userEmail: 'user2@example.com', total: 59.99, status: 'Shipped', date: '2025-05-17' }
      ];
      localStorage.setItem('clothify-orders', JSON.stringify(this.orders));
    }
  }

  switchTab(tab: 'products' | 'orders') {
    this.activeTab = tab;
  }

  openAddProductModal() {
    this.newProduct = { id: this.products.length + 1, name: '', price: 0, category: '', rating: 0, image: '', description: '' };
    this.imagePreview = null;
    this.showAddProductModal = true;
  }

  handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        if (this.showEditProductModal) {
          this.showEditProductModal.image = base64String;
          this.imagePreview = base64String;
        } else {
          this.newProduct.image = base64String;
          this.imagePreview = base64String;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  addProduct() {
    if (this.newProduct.name && this.newProduct.price && this.newProduct.category && this.newProduct.image) {
      this.products.push({ ...this.newProduct });
      localStorage.setItem('clothify-products', JSON.stringify(this.products));
      this.showAddProductModal = false;
      this.imagePreview = null;
    }
  }

  openEditProductModal(product: Product) {
    this.showEditProductModal = { ...product };
    this.imagePreview = product.image; // Show existing image (URL or base64)
  }

  updateProduct() {
    if (this.showEditProductModal) {
      const index = this.products.findIndex(p => p.id === this.showEditProductModal!.id);
      if (index !== -1) {
        this.products[index] = { ...this.showEditProductModal };
        localStorage.setItem('clothify-products', JSON.stringify(this.products));
      }
      this.showEditProductModal = null;
      this.imagePreview = null;
    }
  }

  openDeleteConfirm(product: Product) {
    this.showDeleteConfirm = product;
  }

  deleteProduct() {
    if (this.showDeleteConfirm) {
      this.products = this.products.filter(p => p.id !== this.showDeleteConfirm!.id);
      localStorage.setItem('clothify-products', JSON.stringify(this.products));
      this.showDeleteConfirm = null;
    }
  }

  updateOrderStatus(orderId: number, status: 'Pending' | 'Shipped' | 'Delivered') {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      localStorage.setItem('clothify-orders', JSON.stringify(this.orders));
    }
  }

  signOut() {
    localStorage.removeItem('clothify-current-admin');
    this.router.navigate(['/admin/sign-in']);
  }
}