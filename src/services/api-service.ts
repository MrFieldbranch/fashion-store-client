import type { BasicCategoryResponse } from "../models/BasicCategoryResponse";
import type { CreateNewCategoryRequest } from "../models/CreateNewCategoryRequest";
import type { CreateNewProductRequest } from "../models/CreateNewProductRequest";
import type { CreateNewProductVariantRequest } from "../models/CreateNewProductVariantRequest";
import type { CreateNewUserRequest } from "../models/CreateNewUserRequest";
import type { DetailedCategoryResponse } from "../models/DetailedCategoryResponse";
import type { LoginRequest } from "../models/LoginRequest";
import type { DetailedProductResponse } from "../models/DetailedProductResponse";
import type { ProductVariantResponse } from "../models/ProductVariantResponse";
import type { TokenResponse } from "../models/TokenResponse";
import type { UpdateProductVariantRequest } from "../models/UpdateProductVariantRequest";
import type { UpdateExistingProductRequest } from "../models/UpdateExistingProductRequest";

export class ApiService {
  private requestHeaders: { [key: string]: string };
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.requestHeaders = {
      "Content-Type": "application/json",
    };
  }

  setAuthorizationHeader(token: string): void {
    this.requestHeaders = {
      ...this.requestHeaders,
      Authorization: `Bearer ${token}`,
    };
  }

  removeAuthorizationHeader(): void {
    const { Authorization, ...rest } = this.requestHeaders;
    this.requestHeaders = rest;
  }
  // Ska alla ha AbortSignal, även login och register?
  async registerNewUserAsync(newUserRequest: CreateNewUserRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/registration`, {
      method: "POST",
      headers: { ...this.requestHeaders },
      body: JSON.stringify(newUserRequest),
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Det gick inte att registrera. ${errorMessage}`);
    }
  }

  async loginAsync(loginRequest: LoginRequest): Promise<TokenResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      headers: { ...this.requestHeaders },
      body: JSON.stringify(loginRequest),
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Det gick inte att logga in. ${errorMessage}`);
    }
    const tokenResponse: TokenResponse = await response.json();
    return tokenResponse;
  }

  async getAllCategoriesAsync(signal?: AbortSignal): Promise<BasicCategoryResponse[]> {
    const response = await fetch(`${this.baseUrl}/categories/allcategories`, {
      method: "GET",
      headers: { ...this.requestHeaders },
      signal,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Det gick inte att hämta kategorierna. ${errorMessage}`);
    }

    const allInterests: BasicCategoryResponse[] = await response.json();
    return allInterests || [];
  }

  async getProductsByCategoryAsync(categoryId: number, signal?: AbortSignal): Promise<DetailedCategoryResponse> {
    const response = await fetch(`${this.baseUrl}/categories/${categoryId}/products`, {
      method: "GET",
      headers: { ...this.requestHeaders },
      signal,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Det gick inte att hämta kategorin. ${errorMessage}`);
    }

    const categoryWithProducts: DetailedCategoryResponse = await response.json();
    return categoryWithProducts;
  }

  async createNewCategoryAsync(request: CreateNewCategoryRequest): Promise<BasicCategoryResponse> {
    const response = await fetch(`${this.baseUrl}/categories`, {
      method: "POST",
      headers: { ...this.requestHeaders },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Det gick inte att skapa kategorin. ${errorMessage}`);
    }

    const newCategory: BasicCategoryResponse = await response.json();
    return newCategory;
  }

  async createNewProductAsync(categoryId: number, request: CreateNewProductRequest): Promise<DetailedProductResponse> {
    const response = await fetch(`${this.baseUrl}/products/${categoryId}`, {
      method: "POST",
      headers: { ...this.requestHeaders },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Det gick inte att skapa produkten. ${errorMessage}`);
    }

    const newProduct: DetailedProductResponse = await response.json();
    return newProduct;
  }

  async getProductAsync(productId: number, signal?: AbortSignal): Promise<DetailedProductResponse> {
    const response = await fetch(`${this.baseUrl}/products/${productId}`, {
      method: "GET",
      headers: { ...this.requestHeaders },
      signal,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Det gick inte att hämta produkten. ${errorMessage}`);
    }

    const product: DetailedProductResponse = await response.json();
    return product;
  }

  async createNewProductVariantAsync(
    productId: number,
    request: CreateNewProductVariantRequest
  ): Promise<ProductVariantResponse> {
    const response = await fetch(`${this.baseUrl}/products/${productId}/productvariants`, {
      method: "POST",
      headers: { ...this.requestHeaders },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Det gick inte att skapa produktvarianten. ${errorMessage}`);
    }

    const newProductVariant: ProductVariantResponse = await response.json();
    return newProductVariant;
  }

  async updateExistingProductAsync(
    productId: number,
    request: UpdateExistingProductRequest
  ): Promise<DetailedProductResponse> {
    const response = await fetch(`${this.baseUrl}/products/${productId}`, {
      method: "PUT",
      headers: { ...this.requestHeaders },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Det gick inte att uppdatera produkten. ${errorMessage}`);
    }

    const updatedProduct: DetailedProductResponse = await response.json();
    return updatedProduct;
  }

  async updateExistingProductVariantAsync(
    productId: number,
    request: UpdateProductVariantRequest
  ): Promise<ProductVariantResponse> {
    const response = await fetch(`${this.baseUrl}/products/${productId}/productvariants`, {
      method: "PUT",
      headers: { ...this.requestHeaders },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Det gick inte att uppdatera produktvarianten. ${errorMessage}`);
    }

    const updatedProductVariant: ProductVariantResponse = await response.json();
    return updatedProductVariant;
  }
}

const apiUrl = import.meta.env.VITE_API_URL;
const apiService = new ApiService(apiUrl); /* Singleton */
export default apiService;
