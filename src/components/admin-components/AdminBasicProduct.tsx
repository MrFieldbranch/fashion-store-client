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
  let sex: string;

  if (productSex === 0) sex = "Unisex";
  else if (productSex === 1) sex = "Man";
  else sex = "Kvinna";

  return (
    <div className="admin-basic-product">
      <h3>{productName}</h3>
      <p>{sex}</p>
      <p>Från {startPrice} kr</p>
      <img src={imageUrl} alt={productName} className="product-small" />      
      <button onClick={() => navigate(`/productadmin/${productId}`)}>Mer info</button> {/* Skapa i App.tsx */}
    </div>
  );
};

export default AdminBasicProduct;
