import { useRouter, usePathname } from "next/navigation";

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();

    const handleBoardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        router.push(selected);
    };
    
    return (
        <div className="flex items-center gap-2">
              <select
                onChange={handleBoardChange}
                defaultValue={pathname}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="/">📋 자유게시판</option>
                <option value="/qna">💬 Q&A 게시판</option>
              </select>
            </div>
    );
}