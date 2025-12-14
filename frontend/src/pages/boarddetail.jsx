import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function BoardDetail() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Board Detail page</h1>
    </div>
  );
}
export default BoardDetail;
