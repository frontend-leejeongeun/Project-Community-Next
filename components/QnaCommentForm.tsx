import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { addCommentToQna } from "@/services/qnaApi";

interface Props {
  postId: string;
  parentId?: string | null;
  onCommentAdded?: () => void;
}

export default function QnaCommentForm({ postId, parentId = null, onCommentAdded }: Props) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("로그인이 필요합니다.");
      return;
    }

    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    try {
      await addCommentToQna(postId, {
        content,
        authorEmail: user.email || "익명",
        authorId: user.uid,
        createdAt: new Date(),
        parentId: parentId || null,
      });
      setContent("");
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error("댓글 등록 실패:", err);
      setError("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요"
        className="w-full border rounded p-2 mb-2 min-h-[80px]"
      />
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        댓글 등록
      </button>
    </form>
  );
}