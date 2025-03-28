"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { addQnaPost } from "@/services/qnaApi";
import Header from "@/components/Header";

export default function QnaWritePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("로그인이 필요합니다.");
      return;
    }
    if (!title || !content) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      await addQnaPost({
        title,
        content,
        authorEmail: user.email || "익명",
        authorId: user.uid,
      });
      alert("질문이 등록되었습니다!");
      router.push("/qna");
    } catch (err) {
      console.error("등록 실패:", err);
      setError("질문 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-screen-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">질문 등록</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            질문 등록하기
          </button>
        </form>
      </div>
    </>
    
  );
}