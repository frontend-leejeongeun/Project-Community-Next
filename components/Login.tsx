import { useState } from "react";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signInAnonymously
} from "firebase/auth";
import { auth } from "@/services/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LogoutButton from "@/components/LogoutButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  // Google 로그인
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("로그인 성공:", result.user);
      alert(`로그인 성공: ${result.user.displayName}`);
      router.push("/");
    } catch (error: any) {
      if (error.code === "auth/account-exists-with-different-credential") {
        const email = error.customData?.email;
        if (email) {
          const methods = await fetchSignInMethodsForEmail(auth, email);
          const readable = methods
            .map((m) =>
              m === "google.com"
                ? "Google"
                : m === "github.com"
                ? "GitHub"
                : m === "password"
                ? "이메일/비밀번호"
                : m
            )
            .join(", ");
          alert(`해당 이메일은 다음 방법으로 가입되어 있습니다: ${readable}`);
        }
      } else if (error.code === "auth/popup-closed-by-user") {
        console.warn("사용자가 팝업을 닫아서 로그인 취소됨");
      } else {
        console.error("Google 로그인 실패:", error);
        alert("로그인에 실패했습니다.");
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
      if (error.code === "auth/account-exists-with-different-credential") {
        const email = error.customData?.email;
        if (email) {
          const methods = await fetchSignInMethodsForEmail(auth, email);
          const readable = methods
            .map((m) =>
              m === "google.com"
                ? "Google"
                :  "sss"
            )
            .join(", ");
          alert(`해당 이메일은 다음 방법으로 가입되어 있습니다: ${readable}`);
        }
      } else if (error.code === "auth/popup-closed-by-user") {
        console.warn("사용자가 팝업을 닫아서 로그인 취소됨");
      } else {
        console.error("GitHub 로그인 실패:", error);
        alert("로그인에 실패했습니다.");
      }
    }
  };

  // 이메일 로그인
  const loginWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (!methods || methods.length === 0) {
        setError("해당 이메일로 가입된 계정이 없습니다.");
        return;
      }

      if (!methods.includes("password")) {
        const readable = methods
          .map((m) =>
            m === "google.com"
              ? "Google"
              : m === "github.com"
              ? "GitHub"
              : m === "password"
              ? "이메일/비밀번호"
              : m
          )
          .join(", ");
        setError(`해당 이메일은 다음 방법으로 가입되어 있습니다: ${readable}`);
        return;
      }

      // 정상 로그인
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("이메일 로그인 성공:", userCredential.user);
      alert(`로그인 성공! 이메일: ${userCredential.user.email}`);
      router.push("/");
    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        setError("비밀번호가 올바르지 않습니다.");
      } else if (error.code === "auth/invalid-email") {
        setError("올바른 이메일 형식을 입력해주세요.");
      } else {
        setError("로그인에 실패했습니다. 다시 시도해주세요.");
      }
      console.error("이메일 로그인 실패:", error);
    }
  };

  // 익명 로그인
  const loginAnonymously = async () => {
    try {
      const result = await signInAnonymously(auth);
      console.log("익명 로그인 성공:", result.user);
      alert("익명 로그인 성공!");
      router.push("/");
    } catch (error) {
      console.error("익명 로그인 실패:", error);
      alert("익명 로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-top min-h-screen">
      {user ? (
        <>
          <span>안녕하세요 {user.email}</span>
          <LogoutButton />
        </>
      ) : (
        <>
          <form onSubmit={loginWithEmail} className="flex flex-col w-full max-w-md mb-3">
            <input
              type="email"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-3 mb-3 w-full rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-3 mb-3 w-full rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <button
              type="submit"
              className="bg-gray-400 text-white px-4 py-3 w-full rounded-sm hover:bg-gray-500 transition-all"
            >
              이메일 로그인
            </button>
          </form>
  
          {error && <p className="text-red-500 mb-4">{error}</p>}
  
          <button
            onClick={loginAnonymously}
            className="bg-gray-400 text-white px-4 py-3 w-full rounded-sm hover:bg-gray-500 transition-all mb-3"
          >
            익명 로그인
          </button>
          <button
            onClick={loginWithGoogle}
            className="bg-gray-400 text-white px-4 py-3 w-full rounded-sm hover:bg-gray-500 transition-all mb-3"
          >
            Google 로그인
          </button>
          <button
            onClick={loginWithGithub}
            className="bg-gray-400 text-white px-4 py-3 w-full rounded-sm hover:bg-gray-500 transition-all mb-3"
          >
            Github 로그인
          </button>
        </>
      )}
    </div>
  );
}
