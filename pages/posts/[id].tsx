"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import {
  doc,
  getDoc,
  deleteDoc,
  collection,
  addDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Header from "@/components/Header";

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [replyMap, setReplyMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("게시글을 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const q = query(
      collection(db, "posts", id as string, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentData);
    });

    return () => unsubscribe();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "posts", post.id));
      alert("게시글이 삭제되었습니다.");
      router.push("/");
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await addDoc(collection(db, "posts", id as string, "comments"), {
        content: comment,
        authorEmail: user?.email || "익명",
        authorId: user?.uid || null,
        createdAt: serverTimestamp(),
        parentId: null, // 댓글 기본
      });
      setComment("");
    } catch (err) {
      console.error("댓글 등록 실패:", err);
      alert("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  const handleReplySubmit = async (parentId: string) => {
    const reply = replyMap[parentId];
    if (!reply?.trim()) return;

    try {
      await addDoc(collection(db, "posts", id as string, "comments"), {
        content: reply,
        authorEmail: user?.email || "익명",
        authorId: user?.uid || null,
        createdAt: serverTimestamp(),
        parentId,
      });
      setReplyMap((prev) => ({ ...prev, [parentId]: "" }));
    } catch (err) {
      console.error("답글 등록 실패:", err);
      alert("답글 등록 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const confirmDelete = confirm("댓글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "posts", id as string, "comments", commentId));
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleEditComment = async (commentId: string, newContent: string) => {
    try {
      await updateDoc(doc(db, "posts", id as string, "comments", commentId), {
        content: newContent,
      });
      setEditingCommentId(null);
    } catch (err) {
      console.error("댓글 수정 실패:", err);
      alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  const renderComments = (parentId: string | null = null) => {
    return comments
      .filter((c) => c.parentId === parentId)
      .map((c) => (
        <li key={c.id} className="border-b pb-2 ml-0 mb-2">
          {editingCommentId === c.id ? (
            <div className="flex flex-col">
              <textarea
                defaultValue={c.content}
                onBlur={(e) => handleEditComment(c.id, e.target.value)}
                className="border p-2 mb-1"
              />
              <button
                onClick={() => setEditingCommentId(null)}
                className="text-sm text-gray-500 self-end"
              >
                취소
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{c.content}</p>
              <p className="text-xs text-gray-400">
                {c.authorEmail} · {c.createdAt?.toDate?.().toLocaleString() || "방금 전"}
              </p>
              {user?.uid === c.authorId && (
                <div className="flex gap-2 text-xs mt-1">
                  <button
                    onClick={() => setEditingCommentId(c.id)}
                    className="text-blue-500"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    className="text-red-500"
                  >
                    삭제
                  </button>
                </div>
              )}
              {user && (
                <div className="mt-2">
                  <textarea
                    value={replyMap[c.id] || ""}
                    onChange={(e) =>
                      setReplyMap((prev) => ({ ...prev, [c.id]: e.target.value }))
                    }
                    placeholder="답글을 입력하세요..."
                    className="border p-1 w-full"
                  />
                  <button
                    onClick={() => handleReplySubmit(c.id)}
                    className="text-sm text-green-600 mt-1"
                  >
                    답글 작성
                  </button>
                </div>
              )}
              <ul className="ml-4 mt-2 border-l pl-2">
                {renderComments(c.id)}
              </ul>
            </>
          )}
        </li>
      ));
  };

    return (
    <>
      <Header/>
      <div className="max-w-screen-xl mx-auto p-4">
        {error && <p className="text-red-500">{error}</p>}
        {!post ? (
          <p>게시글을 불러오는 중...</p>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
            <p className="text-gray-600 text-sm mb-4">
              작성자: {post.authorEmail || "익명"} / 작성일: {post.createdAt?.toDate?.().toLocaleString() || "작성일자 없음"}
            </p>
            <div className="whitespace-pre-wrap mb-6">{post.content}</div>

            {user?.uid === post.authorId && (
              <div className="flex gap-2 mb-6">
                <Link href={`/posts/${post.id}/edit`}>
                  <button className="bg-yellow-500 text-white px-4 py-2 rounded-md">수정</button>
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  삭제
                </button>
              </div>
            )}

            <hr className="my-6" />
            <h2 className="text-lg font-bold mb-2">💬 댓글 {comments.length}개</h2>

            <ul className="mb-4 space-y-2">
              {renderComments(null)}
            </ul>

            {user ? (
              <form onSubmit={handleAddComment} className="flex flex-col space-y-2">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                  className="border p-2 rounded"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md self-end"
                >
                  댓글 등록
                </button>
              </form>
            ) : (
              <p className="text-sm text-gray-500">로그인 후 댓글을 작성할 수 있습니다.</p>
            )}
          </>
        )}
      </div>
    </>
    
  );
}
