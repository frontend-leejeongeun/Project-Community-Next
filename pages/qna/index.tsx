import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";
import Login from "@/components/Login";
import { useAuth } from "@/contexts/AuthContext";
import QnaPostItem from "@/components/QnaPostItem";

interface Post {
  id: string;
  title: string;
  content: string;
  authorEmail: string;
  createdAt?: { _seconds: number; _nanoseconds: number };
  isNotice?: boolean;
}

export default function QnaHome() {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQnaPosts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/qna`);
        setPosts(res.data);
      } catch (err) {
        console.error("Q&A 게시글 불러오기 실패:", err);
        setError("Q&A 게시글을 불러오는 중 오류가 발생했습니다.");
      }
    };
    fetchQnaPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <h1 className="text-2xl font-bold">Q&A 게시판</h1>
            </div>
            {user && (
              <button
                onClick={() => router.push("/qna/write")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                질문하기
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

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <ul>
            {currentPosts.length === 0 ? (
              <p className="text-gray-500">검색 결과가 없습니다.</p>
            ) : (
                currentPosts.map((post) => <QnaPostItem key={post.id} post={post} searchTerm={ searchTerm} />)
            )}
          </ul>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-30"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded border ${
                    page === currentPage ? "bg-blue-500 text-white" : "bg-white text-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-30"
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