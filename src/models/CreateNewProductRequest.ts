export interface CreateNewProductRequest {
	name: string;
	productSex: number;
	imageUrl: string;
	color: string;
	description?: string;
}