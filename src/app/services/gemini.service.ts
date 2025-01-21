import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(environment.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async getSimilarProductSuggestions(products: any[]) {
    const productNames = products.map(p => p.name);
    const prompt = `Based on these products in the cart: ${productNames.join(', ')}, 
                   suggest similar products that the customer might be interested in, 
                   excluding the items already in the cart. 
                   Consider factors like category, price range, and typical buying patterns.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const suggestions = response.text().split(', ');

      // Filtrar sugestões para remover itens que já estão no carrinho
      const filteredSuggestions = suggestions.filter((suggestion: string) => 
        !productNames.includes(suggestion)
      );

      return filteredSuggestions;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }
}