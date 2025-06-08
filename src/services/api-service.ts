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
import type { BasicProductResponse } from "../models/BasicProductResponse";
import type { AddItemToShoppingBasketRequest } from "../models/AddItemToShoppingBasketRequest";
import type { RemoveItemFromShoppingBasketRequest } from "../models/RemoveItemFromShoppingBasketRequest";
import type { ShoppingBasketResponse } from "../models/ShoppingBasketResponse";
import type { ChangeQuantityRequest } from "../models/ChangeQuantityRequest";

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

  async getAllCategoriesBySexAsync(sex: string, signal?: AbortSignal): Promise<BasicCategoryResponse[]> {
    const response = await fetch(`${this.baseUrl}/categories/sex/${sex}/allcategories`, {
      method: "GET",
      headers: { ...this.requestHeaders },
      signal,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Det gick inte att hämta kategorierna. ${errorMessage}`);
    }

    const interestsBasedOnSex: BasicCategoryResponse[] = await response.json();
    return interestsBasedOnSex;
  }

  async getProductsByCategoryBasedOnSexAsync(
    categoryId: number,
    sex: string,
    signal?: AbortSignal
  ): Promise<DetailedCategoryResponse> {
    const response = await fetch(`${this.baseUrl}/categories/${categoryId}/sex/${sex}/products`, {
      method: "GET",
      headers: { ...this.requestHeaders },
      signal,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Det gick inte att hämta kategorin. ${errorMessage}`);
    }

    const categoryWithProductsBasedOnSex: DetailedCategoryResponse = await response.json();
    return categoryWithProductsBasedOnSex;
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

  async addProductToLikedAsync(productId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/likedproducts/${productId}`, {
      method: "POST",
      headers: { ...this.requestHeaders },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Det gick inte att gilla produkten. ${errorMessage}`);
    }
  }

  async removeProductFromLikedAsync(productId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/likedproducts/${productId}`, {
      method: "DELETE",
      headers: { ...this.requestHeaders },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Det gick inte att sluta gilla produkten. ${errorMessage}`);
    }
  }

  async getLikedProductsAsync(signal?: AbortSignal): Promise<BasicProductResponse[]> {
    const response = await fetch(`${this.baseUrl}/likedproducts`, {
      method: "GET",
      headers: { ...this.requestHeaders },
      signal,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Det gick inte att hämta de gillade produkterna. ${errorMessage}`);
    }

    const products: BasicProductResponse[] = await response.json();
    return products;
  }

  async addItemToShoppingBasketAsync(request: AddItemToShoppingBasketRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/shoppingbasket/items`, {
      method: "POST",
      headers: { ...this.requestHeaders },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Det gick inte att lägga till varan i varukorgen. ${errorMessage}`);
    }
  }

  async removeItemFromShoppingBasketAsync(request: RemoveItemFromShoppingBasketRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/shoppingbasket/items`, {
      method: "DELETE",
      headers: { ...this.requestHeaders },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Det gick inte att ta bort varan från varukorgen. ${errorMessage}`);
    }
  }

  async getShoppingBasketAsync(signal?: AbortSignal): Promise<ShoppingBasketResponse> {
    const response = await fetch(`${this.baseUrl}/shoppingbasket/items`, {
      method: "GET",
      headers: { ...this.requestHeaders },
      signal,
    }); 

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Det gick inte att hämta varorna i varukorgen. ${errorMessage}`);
    }

    const basket: ShoppingBasketResponse = await response.json();
    return basket;    
  }

  async changeQuantityAsync(productVariantId: number, request: ChangeQuantityRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/shoppingbasket/items/${productVariantId}/quantity`, {
      method: "PUT",
      headers: { ...this.requestHeaders },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Det gick inte att ändra antalet. ${errorMessage}`);
    }
  }

  // Ändra i denna fil för shopping basket
}

const apiUrl = import.meta.env.VITE_API_URL;
const apiService = new ApiService(apiUrl); /* Singleton */
export default apiService;

/* items.map((i) => (
  <div className="row-in-shopping-basket-table" key={i.productVariantId}>
    <div className="shopping-basket-item-left">
      <img src={i.imageUrl} alt={i.productName} className="product-tiny-img" />
      <div className="name-color-size">
        <p>{i.productName}</p>
        <p>{i.color}</p>
        <p>{i.size}</p>
      </div>
    </div>
    <p>{i.price} kr</p>
    <select
      className="quantity-dropdown"
      value={i.quantity}
      onChange={(e) =>
        setItemsFromApi((prev) =>
          prev.map((item) =>
            item.productVariantId === i.productVariantId ? { ...item, quantity: Number(e.target.value) } : item
          )
        )
      }
    >
      {[1, 2, 3, 4, 5].map((q) => (
        <option key={q} value={q}>
          {q}
        </option>
      ))}
    </select>
    <button className="remove-item-from-shopping-basket" onClick={() => handleRemoveItem(i.productVariantId)}>
      X
    </button>
  </div>
)); */