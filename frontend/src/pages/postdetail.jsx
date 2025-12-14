import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function PostDetail() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Post Detail</h1>
    </div>
  );
}
export default PostDetail;
