import { useNavigate } from "react-router-dom";

type AdminBasicProductProps = {
  categoryId: number;
  productId: number;
  productName: string;
  productSex: number;
  imageUrl: string;
  startPrice: number;
};

const AdminBasicProduct = ({ categoryId, productId, productName, productSex, imageUrl, startPrice }: AdminBasicProductProps) => {
  const navigate = useNavigate();

  // Kanske bryta ut till en separat fil/funktion.
  // Kanske också alltid skicka med productSex från API:ets endpoints/services som använder ProductResponse.
  const sex = productSex === 0 ? "Unisex" : productSex === 1 ? "Man" : "Kvinna";

  return (
    <div className="basic-product" onClick={() => navigate(`/admin/category/${categoryId}/product/${productId}`)}>
      <h3>{productName}</h3>
      <p>{sex}</p>
      <div className="product-small-img-wrapper">
        <img src={imageUrl} alt={productName} className="product-small-img" />
      </div>
      <p className="from-price">Från {startPrice} kr</p>
    </div>
  );
};

export default AdminBasicProduct;
