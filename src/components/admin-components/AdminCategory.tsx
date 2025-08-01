import { useNavigate } from "react-router-dom";

type AdminCategoryProps = {
  categoryId: number;
  categoryName: string;
};

const AdminCategory = ({ categoryId, categoryName }: AdminCategoryProps) => {
  const navigate = useNavigate();

  return (
    <div className="item" onClick={() => navigate(`/admin/category/${categoryId}`)}>
      <p>{categoryName}</p>
    </div>
  );
};

export default AdminCategory;
