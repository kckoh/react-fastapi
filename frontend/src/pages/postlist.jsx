import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  useEffect(() => {
    fetch(`http://localhost:8000/api/posts?page=${page}&page_size=1`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts); // Extract posts array from response
        setPagination(data); // Store pagination metadata
      });
  }, [page]);

  return (
    <div>
      <h1>Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          {post.title} | {post.author.email} |
          <Link to={`/posts/${post.id}`}>View</Link>
        </div>
      ))}

      <div>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={!pagination?.has_previous}
        >
          이전
        </button>
        <span>
          {" "}
          Page {page} of {pagination?.total_pages}{" "}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!pagination?.has_next}
        >
          다음
        </button>
      </div>
    </div>
  );
}
export default PostList;
