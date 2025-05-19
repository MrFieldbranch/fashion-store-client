export interface UpdateProductVariantRequest {
	productVariantId: number;
	stockChange: number;
	newPrice: number;
}