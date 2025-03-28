import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import {
  getQnaPostById,
  deleteQnaPost,
} from "@/services/qnaApi";
import QnaCommentList, { QnaCommentListHandle } from "@/components/QnaCommentList";
import QnaCommentForm from "@/components/QnaCommentForm";
import Link from "next/link";
import Header from "@/components/Header";
import { Timestamp } from "firebase/firestore";

interface Post {
  id: string;
  title: string;
  content: string;
  authorEmail: string;
  authorId: string;
  createdAt?: Timestamp;
}

export default function QnaDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [idReady, setIdReady] = useState(false);

  const commentListRef = useRef<QnaCommentListHandle>(null);

  const id =
    typeof router.query.id === "string"
      ? router.query.id
      : Array.isArray(router.query.id)
      ? router.query.id[0]
      : null;

  useEffect(() => {
    if (!router.isReady) return;
    setIdReady(true);
  }, [router.isReady]);

  const loadPost = async () => {
    if (!id) return;
    try {
      const fetched = await getQnaPostById(id);
      if (!fetched) {
        setError("게시글을 찾을 수 없습니다.");
        return;
      }
      setPost(fetched as Post);
    } catch (err) {
      console.error("게시글 로딩 오류:", err);
      setError("게시글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && idReady) {
      loadPost();
    }
  }, [id, idReady]);

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteQnaPost(id!);
      alert("삭제 완료!");
      router.push("/qna");
    } catch (err) {
      console.error("삭제 오류:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleCommentAdded = () => {
    commentListRef.current?.reload();
  };

  const formatDate = (timestamp?: Timestamp) => {
      if (!timestamp) return "";
      const date = timestamp.toDate();
      return date.toLocaleString();
    };

  if (!idReady) return null;
  if (!id) return <div className="p-4 text-red-500">❌ 유효하지 않은 경로입니다.</div>;
  if (error) return <div className="p-4 text-red-500">❌ {error}</div>;
  if (loading || !post) return <div className="p-4">게시글을 불러오는 중...</div>;

  return (
    <>
      <Header />
      <div className="max-w-screen-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-600 text-sm mb-4">
              작성자: {post.authorEmail || "익명"} / 작성일: {post.createdAt?.toDate?.().toLocaleString() || "작성일자 없음"}
        </p>
        <div className="whitespace-pre-wrap mb-6 text-gray-800">{post.content}</div>

        {user?.uid === post.authorId && (
          <div className="flex space-x-3 mb-6">
            <Link href={`/qna/${id}/edit`}>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-md">수정</button>
            </Link>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md">
              삭제
            </button>
          </div>
        )}

        {user && id && (
          <QnaCommentForm postId={id} onCommentAdded={handleCommentAdded} />
        )}
        {id && <QnaCommentList postId={id} ref={commentListRef} />}
      </div>
    </>
  );
}
