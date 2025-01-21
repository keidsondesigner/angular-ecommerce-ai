import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-product-form',
  template: `
    <div class="form-container">
      <h2>Adicionar Novo Produto</h2>
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Nome do Produto</label>
          <input id="name" type="text" formControlName="name">
        </div>
        
        <div class="form-group">
          <label for="description">Descrição</label>
          <textarea id="description" formControlName="description"></textarea>
        </div>
        
        <div class="form-group">
          <label for="price">Preço</label>
          <input id="price" type="number" step="0.01" formControlName="price">
        </div>
        
        <div class="form-group">
          <label for="image">URL da Imagem</label>
          <input id="image" type="url" formControlName="image">
        </div>
        
        <div class="form-group">
          <label for="category">Categoria</label>
          <input id="category" type="text" formControlName="category">
        </div>
        
        <button type="submit" [disabled]="!productForm.valid">Adicionar Produto</button>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    input, textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    textarea {
      height: 100px;
    }
    button {
      background: #4299e1;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background: #a0aec0;
      cursor: not-allowed;
    }
  `]
})
export class ProductFormComponent {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      image: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.productForm.valid) {
      try {
        await this.supabaseService.addProduct(this.productForm.value);
        alert('Produto adicionado com sucesso!');
        this.productForm.reset();
        this.router.navigate(['/products']);
      } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        alert('Erro ao adicionar produto. Por favor, tente novamente.');
      }
    }
  }
}