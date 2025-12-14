import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function BoardList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // defintion
    const fetchData = async () => {
      const response = await fetch("http://localhost:8000/api/posts", {
        method: "GET",
      });
      const data = await response.json();
      setPosts(data); // 상태에 저장
      console.log(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Board Page</h1>
      {posts.map((post) => (
        <>
          <div key={post.id}>
            {post.title} | {post.content} | {post.author.email} |
            <Link to={`/board/${post.id}`}>View</Link>
          </div>
        </>
      ))}
    </div>
  );
}
export default BoardList;
