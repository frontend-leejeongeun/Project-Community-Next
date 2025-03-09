import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useRouter } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {

  const router = useRouter();

  return (
  
      <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Mini Cafe Platform</h1>

      <div className="flex space-x-4">
        {/* ✅ 로그인 페이지 이동 버튼 */}
        <button
          onClick={() => router.push("/login")}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          로그인
        </button>

        {/* ✅ 회원가입 페이지 이동 버튼 */}
        <button
          onClick={() => router.push("/signup")}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          회원가입
        </button>
      </div>
      </div>
    
  );
}
