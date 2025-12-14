import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function BoardList() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <h1>Board Page</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
export default BoardList;
