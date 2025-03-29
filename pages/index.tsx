import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "../components/Header";
import Login from "../components/Login";

interface Post {
  id: string;
  title: string;
  content: string;
  authorEmail: string;
  createdAt?: { _seconds: number; _nanoseconds: number };
  isNotice?: boolean;
}

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentCounts, setCommentCounts] = useState<{ [postId: string]: number }>({});
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error("API 요청 실패:", error);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchCommentCounts = async () => {
      for (const post of posts) {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts/${post.id}/comments/count`);
          setCommentCounts((prev) => ({ ...prev, [post.id]: res.data.count || 0 }));
        } catch (error) {
          console.error("댓글 개수 가져오기 실패:", error);
        }
      }
    };

    if (posts.length > 0) fetchCommentCounts();
  }, [posts]);

  const formatDate = (timestamp?: { _seconds: number }) => {
    if (!timestamp) return "작성일자 없음";
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleString();
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const highlightText = (text: string) => {
    if (!searchTerm.trim()) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-300 px-1 rounded">{part}</mark>
      ) : (
        part
      )
    );
  };

  const noticePosts = filteredPosts.filter((post) => post.isNotice);
  const normalPosts = filteredPosts.filter((post) => !post.isNotice);
  const combinedPosts = [...noticePosts, ...normalPosts];
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = combinedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(combinedPosts.length / postsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-grow w-full max-w-screen-xl mx-auto">
        <div className="w-3/4 p-4 border-r border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">자유게시판</h1>
            </div>
            {user && (
              <button
                onClick={() => router.push("/write")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                글쓰기
              </button>
            )}
          </div>

          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 w-full mb-4 rounded-md"
          />

          {error && <p className="text-red-500">{error}</p>}

          <ul>
            {currentPosts.length === 0 ? (
              <p className="text-gray-500">검색 결과가 없습니다.</p>
            ) : (
              currentPosts.map((post) => (
                <li key={post.id} className={`border-b border-gray-200 py-4 ${post.isNotice ? "bg-yellow-50" : ""}`}>
                  <Link href={`/posts/${post.id}`}>
                    <div className="hover:underline cursor-pointer">
                      <h2 className="text-l font-bold">
                        {post.isNotice ? "📢 " : ""}{highlightText(post.title)}
                      </h2>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                        {highlightText(post.content)}
                      </p>
                      <div className="text-xs text-gray-500 mt-2">
                        작성자: {post.authorEmail} · {formatDate(post.createdAt)} · 💬 댓글 {commentCounts[post.id] || 0}개
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-sm border bg-white text-gray-700 disabled:opacity-30"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-sm border ${page === currentPage ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-sm border bg-white text-gray-700 disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div className="w-1/4 p-4">
          <Login />
        </div>
      </main>
    </div>
  );
}
