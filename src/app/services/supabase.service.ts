import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        },
        db: {
          schema: 'public'
        }
      }
    );
  }

  async getProducts() {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getSimilarProducts(categories: string[]) {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .in('category', categories)
      .limit(5);
    
    if (error) throw error;
    return data;
  }

  async addProduct(product: any) {
    const { data, error } = await this.supabase
      .from('products')
      .insert([{
        ...product,
        price: Number(product.price)
      }])
      .select();
      
    if (error) throw error;
    return data;
  }
}