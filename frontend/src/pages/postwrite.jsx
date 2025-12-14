import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function PostWrite() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const { sessionId } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-ID": sessionId,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Failed to create post");
        return;
      }

      console.log("Success:", data);
      navigate("/posts");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Post</h1>
      <p>Title</p>
      <input
        name="title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />

      <p>Content</p>
      <textarea
        name="content"
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        rows={5}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
export default PostWrite;
