// pages/posts/[id]/edit.tsx
"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";

export default function EditPostPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const post = docSnap.data();
          if (user?.uid !== post.authorId) {
            alert("본인만 수정할 수 있습니다.");
            router.push("/");
            return;
          }

          setTitle(post.title);
          setContent(post.content);
        } else {
          setError("게시글을 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("불러오기 실패:", err);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchPost();
  }, [id, user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const docRef = doc(db, "posts", id as string);
      await updateDoc(docRef, {
        title,
        content,
      });

      alert("수정 완료!");
      router.push(`/posts/${id}`);
    } catch (err) {
      console.error("수정 실패:", err);
      setError("수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Header/>
      <div className="max-w-screen-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">게시글 수정</h1>
        <form onSubmit={handleUpdate} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2"
          />
          <textarea
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-2 h-40"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            수정 완료
          </button>
        </form>
      </div>
    </>
  );
}
