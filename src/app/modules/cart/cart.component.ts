import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-cart',
  template: `
    <div class="cart-container">
      <h2>Your Cart</h2>
      
      <div class="cart-items">
        <div *ngFor="let item of cartItems" class="cart-item">
          <img [src]="item.image" [alt]="item.name">
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p>{{ item.price | currency }}</p>
          </div>
          <button (click)="removeFromCart(item)">Remove</button>
        </div>
      </div>

      <div class="suggestions" *ngIf="suggestions.length">
        <h3>Recommended Products</h3>
        <div class="suggestion-items">
          <div *ngFor="let item of suggestions" class="suggestion-item">
            <img [src]="item.image" [alt]="item.name">
            <h4>{{ item.name }}</h4>
            <p>{{ item.price | currency }}</p>
            <button (click)="addToCart(item)">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .cart-items, .suggestion-items {
      display: grid;
      gap: 20px;
      margin: 20px 0;
    }
    .cart-item, .suggestion-item {
      display: flex;
      align-items: center;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    img {
      width: 100px;
      height: 100px;
      object-fit: cover;
      margin-right: 20px;
    }
    button {
      padding: 8px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background: #0056b3;
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  suggestions: any[] = [];

  constructor(
    private supabaseService: SupabaseService,
    private geminiService: GeminiService
  ) {}

  async ngOnInit() {
    await this.loadCartItems();
    await this.getSuggestions();
  }

  async loadCartItems() {
    const cartData = localStorage.getItem('cart');
    this.cartItems = cartData ? JSON.parse(cartData) : [];
  }

  async getSuggestions() {
    if (this.cartItems.length === 0) return;

    const suggestionsText = await this.geminiService.getSimilarProductSuggestions(this.cartItems);
    
    const categories = this.cartItems.map(item => item.category);
    this.suggestions = await this.supabaseService.getSimilarProducts(categories);
  }

  async addToCart(item: any) {
    this.cartItems.push(item);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    await this.getSuggestions();
  }

  async removeFromCart(item: any) {
    this.cartItems = this.cartItems.filter(i => i.id !== item.id);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    await this.getSuggestions();
  }
}