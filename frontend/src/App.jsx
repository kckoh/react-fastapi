import { HashRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import SignUp from "./pages/signup";
import Board from "./pages/board";

function About() {
  return <h1>About Page</h1>;
}

function Contact() {
  return <h1> Contact Page</h1>;
}

function App() {
  return (
    <HashRouter>
      <div>
        {/* Navigation */}
        <nav>
          <div>
            <Link to="/">Home</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/board">Board</Link>
          </div>
        </nav>

        {/* Routes */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/board" element={<Board />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
