import Header from '../components/Header';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, GithubAuthProvider, signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth,db } from "@/services/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [posts, setPosts] = useState<{ id: string; [key: string]: any }[]>([]);
    const [userInfo, setUserInfo] = useState<User | null>(null);
  
    useEffect(() => {
        const fetchPosts = async () => {
          const querySnapshot = await getDocs(collection(db, "posts"));
          setPosts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        };
    
        fetchPosts();
      }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
              setIsLoggedIn(true);
              setUserInfo(user)
            } else {
                setIsLoggedIn(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // Google 로그인
    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            console.log("로그인 성공:", result.user);
            alert(`로그인 성공: ${result.user.displayName}`);
            setIsLoggedIn(true);
            router.push("/");
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
            setIsLoggedIn(true);
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
            setIsLoggedIn(true);
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

    // 로그아웃
    const logout = async () => {
        try {
            await signOut(auth);
            setIsLoggedIn(false);
            router.push("/");
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex flex-grow w-full max-w-screen-xl mx-auto">
                {isLoggedIn ? (
                    <div className="flex w-full">
                        <div className="w-1/6 p-4 border-r border-gray-200">채팅창</div>
                        <div className="w-2/3 p-4">
                            <ul>
                                {posts.map((post) => (
                                <li key={post.id}>
                                    <h2>{post.title}</h2>
                                    <p>{post.content}</p>
                                </li>
                                ))}
                            </ul>
                        </div>
              <div className="w-1/6 p-4 border-l border-gray-200">
                  {userInfo && <p>{userInfo.displayName}님 안녕하세요!</p>}
                            <button
                                onClick={logout}
                                className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
                            >
                                로그아웃
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex w-full">
                            <div className="w-3/4 p-4">
                                <ul>
                                    {posts.map((post) => (
                                    <li key={post.id}>
                                        <h2>{post.title}</h2>
                                        <p>{post.content}</p>
                                    </li>
                                    ))}
                                </ul>
                            </div>
                        <div className="w-1/4 p-4 border-l border-gray-200">
                            <div className="flex flex-col items-center justify-top min-h-screen">
                                <form onSubmit={loginWithEmail} className="flex flex-col w-full">
                                    <input
                                        type="email"
                                        placeholder="이메일 입력"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none mb-2"
                                    />
                                    <input
                                        type="password"
                                        placeholder="비밀번호 입력"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none mb-2"
                                    />
                                    <button type="submit" className="bg-gray-700 text-white px-4 py-2 rounded-md mb-4">
                                        이메일 로그인
                                    </button>
                                </form>

                                {error && <p className="text-red-500 mb-4">{error}</p>}

                                <div className="flex space-x-4 w-full">
                                    <button
                                        onClick={loginWithGoogle}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 w-full"
                                    >
                                        Google 로그인
                                    </button>
                                    <button
                                        onClick={loginWithGithub}
                                        className="bg-gray-700 text-white px-4 py-2 rounded-md mb-4 w-full"
                                    >
                                        Github 로그인
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}