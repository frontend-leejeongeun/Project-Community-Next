import Link from "next/link";

interface QnaPostItemProps {
  post: {
    id: string;
    title: string;
    content: string;
    authorEmail: string;
    createdAt?: { _seconds: number; _nanoseconds: number };
    isNotice?: boolean;
  };
  searchTerm: string;
}

export default function QnaPostItem({ post, searchTerm }: QnaPostItemProps) {
  const formatDate = (timestamp?: { _seconds: number }) => {
    if (!timestamp) return "작성일자 없음";
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleString();
  };

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

  return (
    <li className={`border-b border-gray-200 py-4 ${post.isNotice ? "bg-yellow-50" : ""}`}>
      <Link href={`/qna/${post.id}`}>
        <div className="hover:underline cursor-pointer">
          <h2 className="text-l font-bold">
            {post.isNotice ? "📢 " : ""}
            {highlightText(post.title)}
          </h2>
          <p className="text-sm text-gray-700 mt-1 line-clamp-2">
            {highlightText(post.content)}
          </p>
          <div className="text-xs text-gray-500 mt-1">
            작성자: {post.authorEmail} · {formatDate(post.createdAt)}
          </div>
        </div>
      </Link>
    </li>
  );
}
