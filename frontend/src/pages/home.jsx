import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login, sessionId } = useAuth();

  // Redirect to posts if already logged in
  if (sessionId) {
    return <Navigate to="/posts" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Login failed");
        return;
      }

      console.log("Success:", data);
      console.log("session id:", data.session_id);

      login(data.session_id);
      navigate("/posts");
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <>
      <h1>Login </h1>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
export default Home;
