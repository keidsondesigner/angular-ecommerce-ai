import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { GeminiService } from 'src/app/services/gemini.service';

@Component({
  selector: 'app-product-list',
  template: `
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

    <div class="products-container">
      <h2>Produtos Disponíveis</h2>
      <div class="products-grid">
        <div *ngFor="let product of products" class="product-card">
          <img [src]="product.image" [alt]="product.name">
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="price">{{ product.price | currency }}</p>
            <button (click)="addToCart(product)">Adicionar ao Carrinho</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .suggestion-items {
      display: flex;
      justify-content: space-between;
      padding: 20px;
    }
    .products-container {
      padding: 20px;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .product-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
    }
    .product-card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 4px;
    }
    .product-info {
      margin-top: 10px;
    }
    .price {
      color: #2c5282;
      font-weight: bold;
      font-size: 1.2em;
    }
    button {
      background: #4299e1;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
    }
    button:hover {
      background: #2b6cb0;
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: any[] = [];

  cartItems: any[] = [];
  suggestions: any[] = [];

  constructor(
    private supabaseService: SupabaseService,
    private geminiService: GeminiService
  ) {}

  async ngOnInit() {
    this.products = await this.supabaseService.getProducts();
  
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

  addToCart(product: any) {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    cartItems.push(product);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    alert('Produto adicionado ao carrinho!');
  }
}