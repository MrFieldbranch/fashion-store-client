import { useNavigate } from "react-router-dom";

type AdminCategoryProps = {
  categoryId: number;
  categoryName: string;
};

const AdminCategory = ({ categoryId, categoryName }: AdminCategoryProps) => {
  const navigate = useNavigate();

  return (
    <div className="admin-category">
      <p onClick={() => navigate(`/categoryadmin/${categoryId}`)}>{categoryName}</p>
    </div>
  );
};

export default AdminCategory;
