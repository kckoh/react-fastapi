import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import SignUp from "./pages/signup";
import PostList from "./pages/postlist";
import PostDetail from "./pages/postdetail";
import PostWrite from "./pages/postwrite";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function App() {
  const { logout, sessionId } = useAuth();

  const handleLogout = async () => {
    try {
      // Call backend to remove session
      await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          "X-Session-ID": sessionId,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear frontend session even if backend call fails
      logout();
    }
  };

  return (
    <BrowserRouter>
      <div>
        {/* Navigation */}
        <nav>
          <div>
            <Link to="/">Home</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/posts">Posts</Link>
            {sessionId && <button onClick={handleLogout}>Logout</button>}
          </div>
        </nav>

        {/* Routes */}
        <main>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected routes - all require authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path="/posts" element={<PostList />} />
              <Route path="/posts/write" element={<PostWrite />} />
              <Route path="/posts/:id" element={<PostDetail />} />
            </Route>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
