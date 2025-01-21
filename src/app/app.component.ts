import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <header>
        <h1>Smart Shopping Cart</h1>
        <nav>
          <a routerLink="/products" routerLinkActive="active">Produtos</a>
          <a routerLink="/products/add" routerLinkActive="active">Adicionar Produto</a>
          <a routerLink="/cart" routerLinkActive="active">Carrinho</a>
        </nav>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      text-align: center;
      margin-bottom: 2rem;
    }
    h1 {
      color: #333;
      font-size: 2rem;
    }
    nav {
      margin-top: 1rem;
    }
    nav a {
      margin: 0 10px;
      padding: 5px 10px;
      text-decoration: none;
      color: #4a5568;
    }
    nav a.active {
      color: #4299e1;
      border-bottom: 2px solid #4299e1;
    }
    main {
      display: grid;
      gap: 2rem;
    }
  `]
})
export class AppComponent {
  title = 'Smart Shopping Cart';
}