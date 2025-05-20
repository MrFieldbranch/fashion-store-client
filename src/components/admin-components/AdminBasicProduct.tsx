import { useNavigate } from "react-router-dom";

type AdminBasicProductProps = {
  productId: number;
  productName: string;
  productSex: number;
  imageUrl: string;
  startPrice: number;
};

const AdminBasicProduct = ({ productId, productName, productSex, imageUrl, startPrice }: AdminBasicProductProps) => {
  const navigate = useNavigate();

  // Kanske bryta ut till en separat fil/funktion.
  // Kanske också alltid skicka med productSex från API:ets endpoints/services som använder ProductResponse.
  const sex = productSex === 0 ? "Unisex" : productSex === 1 ? "Man" : "Kvinna";

  return (
    <div className="admin-record">
      <h3>{productName}</h3>
      <p>{sex}</p>
      <p>Från {startPrice} kr</p>
      <img
        src={imageUrl}
        alt={productName}
        className="product-small"
        onClick={() => navigate(`/productadmin/${productId}`)}
      />      
    </div>
  );
};

export default AdminBasicProduct;
