import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function PostDetail() {
  const { id } = useParams(); // Get ID from URL
  const { sessionId } = useAuth(); // Get session ID for authentication
  const [post, setPost] = useState(null);
  const [formData, setFormData] = useState({
    content: "",
  });
  const [comments, setComments] = useState([]);

  // create comments
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8000/api/posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-ID": sessionId,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Failed to create comment");
        return;
      }

      // Add new comment to list and clear form
      setComments([data, ...comments]);
      setFormData({ content: "" });

      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create comment. Please try again.");
    }
  };

  // Fetch the post detail
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

  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch(
        `http://localhost:8000/api/posts/${id}/comments`,
        {
          method: "GET",
        },
      );
      const data = await response.json();
      setComments(data);
      console.log(data);
    };
    fetchComments();
  }, [id]);

  // Show loading while fetching
  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <h1>Posts: {post.title}</h1>
        <h3>Author: {post.author.email}</h3>
        <div>{post.content}</div>
      </div>
      {/* Create comment Section*/}
      <form onSubmit={handleSubmit}>
        <h1>Create comment</h1>

        <p>Content</p>
        <textarea
          name="content"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          rows={1}
        />

        <button type="submit">Submit</button>
      </form>

      {/* Comment List Section */}
      <div>
        <h2>Comments ({comments.length})</h2>
        {comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>
              <p><strong>{comment.author.email}</strong></p>
              <p>{comment.content}</p>
              <small>{new Date(comment.created_at).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
    </>
  );
}
export default PostDetail;
