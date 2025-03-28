import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("로그아웃 되었습니다.");
      router.push("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-gray-400 text-white px-4 py-3 w-full rounded-sm hover:bg-gray-500 transition-all mt-6"
    >
      로그아웃
    </button>
  );
}
