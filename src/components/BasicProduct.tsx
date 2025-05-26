import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api-service";
import { useLikedProducts } from "../contexts/LikedProductsContext";

type BasicProductProps = {
  productId: number;
  productName: string;
  productSex: number;
  imageUrl: string;
  startPrice: number;
  isLiked: boolean;
  setUseEffectTrigger: React.Dispatch<React.SetStateAction<number>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};
const BasicProduct = ({
  productId,
  productName,
  productSex,
  imageUrl,
  startPrice,
  isLiked,
  setUseEffectTrigger,
  setError,
}: BasicProductProps) => {
  const { userRole } = useAuth();
  const { increaseLikedInNavByOne, decreaseLikedInNavByOne } = useLikedProducts();
  const navigate = useNavigate();
  const sex = productSex === 0 ? "Unisex" : productSex === 1 ? "Man" : "Kvinna";

  const handleLiking = async (productId: number) => {
    try {
      await apiService.addProductToLikedAsync(productId);
      increaseLikedInNavByOne(); 
      setUseEffectTrigger((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || "Ett oväntat fel inträffade. Det gick inte att gilla produkten.");
    }
  };

  const handleUnLiking = async (productId: number) => {
    try {
      await apiService.removeProductFromLikedAsync(productId);
      decreaseLikedInNavByOne(); 
      setUseEffectTrigger((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || "Ett oväntat fel inträffade. Det gick inte att sluta gilla produkten.");
    }
  };

  const handleLikingWhenNotLoggedIn = () => {
    setError("Du måste vara inloggad för att kunna gilla en produkt.");
  };

  return (
    <div className="basic-product" onClick={() => navigate(`/product/${productId}`)}>
      <h3>{productName}</h3>
      <p>{sex}</p>
      <div className="product-small-img-wrapper">
        <img src={imageUrl} alt={productName} className="product-small-img" />
        {userRole && isLiked === false && (
          <img
            src="/images/heart-hollow.png"
            alt="hollow heart"
            className="heart-icon-small"
            onClick={(e) => {e.stopPropagation(); handleLiking(productId);} }
          />
        )}
        {userRole && isLiked === true && (
          <img
            src="/images/heart-filled.png"
            alt="filled-heart"
            className="heart-icon-small"
            onClick={(e) => {e.stopPropagation(); handleUnLiking(productId);}}
          />
        )}
        {!userRole && (
          <img
            src="/images/heart-hollow.png"
            alt="hollow heart"
            className="heart-icon-small"
            onClick={(e) => {e.stopPropagation(); handleLikingWhenNotLoggedIn();}}
          />
        )}
      </div>
      <p>Från {startPrice} kr</p>
    </div>
  );
};

export default BasicProduct;
