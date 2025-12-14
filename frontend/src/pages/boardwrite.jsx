import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function BoardWrite() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const { sessionId } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 form 동작 막기
    if (sessionId === "" || sessionId === null) {
      alert("Please login first");
      return;
    }

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
      console.log("Success:", data);
      navigate("/board");
      // redirect to the home page
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
export default BoardWrite;
