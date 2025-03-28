import { useEffect, useImperativeHandle, useState, forwardRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import QnaCommentForm from "./QnaCommentForm";
import {
  getCommentsForQna,
  deleteCommentFromQna,
} from "@/services/qnaApi";

interface Comment {
  id: string;
  content: string;
  authorEmail: string;
  authorId: string;
  createdAt?: { _seconds: number; _nanoseconds: number };
  parentId: string | null;
}

interface Props {
  postId: string;
}

export type QnaCommentListHandle = {
  reload: () => void;
};

const QnaCommentList = forwardRef<QnaCommentListHandle, Props>(({ postId }, ref) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const loadComments = async () => {
    const res = await getCommentsForQna(postId);
    const mappedComments: Comment[] = res.map((comment: any) => ({
      id: comment.id,
      content: comment.content || "",
      authorEmail: comment.authorEmail || "",
      authorId: comment.authorId || "",
      createdAt: comment.createdAt || undefined,
      parentId: comment.parentId || null,
    }));
    setComments(mappedComments);
  };

  useImperativeHandle(ref, () => ({
    reload: loadComments,
  }));

  useEffect(() => {
    loadComments();
  }, []);

  const handleDelete = async (commentId: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await deleteCommentFromQna(postId, commentId);
    loadComments();
  };

  const renderComments = (parentId: string | null = null, depth = 0) => {
    return comments
      .filter((c) => c.parentId === parentId)
      .map((comment) => (
        <div
          key={comment.id}
          className={`ml-${depth * 4} border-l border-gray-300 pl-3 mt-3`}
        >
          <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
          <div className="text-xs text-gray-500 mt-1">
            {comment.authorEmail} · {formatDate(comment.createdAt)}
          </div>

          <div className="flex space-x-2 mt-1 text-sm">
            {user && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="text-blue-500 hover:underline"
              >
                답글
              </button>
            )}
            {user?.uid === comment.authorId && (
              <button
                onClick={() => handleDelete(comment.id)}
                className="text-red-500 hover:underline"
              >
                삭제
              </button>
            )}
          </div>

          {replyingTo === comment.id && (
            <div className="mt-2">
              <QnaCommentForm
                postId={postId}
                parentId={comment.id}
                onCommentAdded={() => {
                  setReplyingTo(null);
                  loadComments();
                }}
              />
            </div>
          )}

          {renderComments(comment.id, depth + 1)}
        </div>
      ));
  };

  const formatDate = (timestamp?: { _seconds: number }) => {
    if (!timestamp) return "";
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">💬 댓글 {comments.length}개</h3>
      {renderComments(null)}
    </div>
  );
});

QnaCommentList.displayName = "QnaCommentList";

export default QnaCommentList;
