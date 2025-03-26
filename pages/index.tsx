import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Login from "../components/Login";

export default function Home() {
  const [posts, setPosts] = useState<{ id: string; title: string; content: string }[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("API 요청 실패:", error);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-grow w-full max-w-screen-xl mx-auto">
        {/* Left Section: Posts */}
        <div className="w-3/4 p-4 border-r border-gray-200">
          <h1 className="text-2xl font-bold mb-4">게시글 목록</h1>
          {error && <p className="text-red-500">{error}</p>}
          <ul>
            {posts.map((post) => (
              <li key={post.id} className="border-b border-gray-200 py-2">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section: Login Form */}
        <div className="w-1/4 p-4">
          <Login />
        </div>
      </main>
    </div>
  );
}