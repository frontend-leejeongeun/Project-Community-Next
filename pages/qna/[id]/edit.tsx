import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getQnaPostById, updateQnaPost } from "@/services/qnaApi";
import Header from "@/components/Header";

interface QnaPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorEmail?: string;
  createdAt?: string;
}

export default function EditQnaPost() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return; // 🔑 user 없을 때는 실행하지 않음

      try {
        const post = await getQnaPostById(id) as QnaPost | null;
        if (!post) {
          setError("게시글을 찾을 수 없습니다.");
          setLoading(false);
          return;
        }
        if (post.authorId !== user.uid) {
          setError("수정 권한이 없습니다.");
          setLoading(false);
          return;
        }
        setTitle(post.title);
        setContent(post.content);
        setLoading(false);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    if (id && user) fetchData(); // 🔑 user가 있을 때만 fetch
  }, [id, user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }
    try {
      await updateQnaPost(id, { title, content });
      alert("수정 완료!");
      router.push(`/qna/${id}`);
    } catch (err) {
      console.error("수정 실패:", err);
      setError("게시글 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div className="p-4">로딩 중...</div>;
  if (error) return <div className="p-4 text-red-500">❌ {error}</div>;

  return (
    <>
      <Header />
      <div className="max-w-screen-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">질문 수정</h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            className="w-full border rounded px-3 py-2"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용"
            className="w-full border rounded px-3 py-2 min-h-[200px]"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            저장하기
          </button>
        </form>
      </div>      
    </>

  );
}
