"use client";

import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, GithubAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Google 로그인
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("로그인 성공:", result.user);
      alert(`로그인 성공: ${result.user.displayName}`);
      router.push("/"); // 로그인 후 메인 페이지로 이동
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") {
        console.warn("사용자가 팝업을 닫아서 로그인 취소됨");
      } else {
        console.error("로그인 실패:", error);
      }
    }
  };

  // Github 로그인
  const loginWithGithub = async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("로그인 성공:", result.user);
      alert(`로그인 성공: ${result.user.displayName}`);
      router.push("/");
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") {
        console.warn("사용자가 팝업을 닫아서 로그인 취소됨");
      } else {
        console.error("로그인 실패:", error);
      }
    }
  };

  // 이메일 로그인
  const loginWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("이메일 로그인 성공:", userCredential.user);
      alert(`로그인 성공! 이메일: ${userCredential.user.email}`);
      router.push("/");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
      setError("가입되지 않은 이메일입니다.");
      } else if (error.code === "auth/wrong-password") {
      setError("비밀번호가 올바르지 않습니다.");
      } else if (error.code === "auth/invalid-email") {
      setError("올바른 이메일 형식을 입력해주세요.");
      } else {
      setError("로그인에 실패했습니다. 다시 시도해주세요.");
      }
      console.error("이메일 로그인 실패:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold mb-4">Firebase 로그인</h1>
      <form onSubmit={loginWithEmail} className="flex flex-col">
        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-2"
        />
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md mb-4">
          이메일 로그인
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={loginWithGoogle}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
      >
        Google 로그인
      </button>
      <button
        onClick={loginWithGithub}
        className="bg-gray-700 text-white px-4 py-2 rounded-md"
      >
        Github 로그인
      </button>
    </div>
  );
}
