import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function PostDetail() {
  const [post, setPost] = useState(null);
  const { id } = useParams();  // Get ID from URL

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:8000/api/posts/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      setPost(data);
      console.log(data);
    };
    fetchData();
  }, [id]);

  // Show loading while fetching
  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Posts: {post.title}</h1>
      <h3>Author: {post.author.email}</h3>
      <div>{post.content}</div>
    </div>
  );
}
export default PostDetail;
