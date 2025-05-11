import type { CreateNewUserRequest } from "../models/CreateNewUserRequest";
import type { LoginRequest } from "../models/LoginRequest";
import type { TokenResponse } from "../models/TokenResponse";

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
}

const apiUrl = import.meta.env.VITE_API_URL;
const apiService = new ApiService(apiUrl); /* Singleton */
export default apiService;