'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log('회원가입 성공:', userCredential.user);
            alert(`회원가입 성공! 이메일: ${userCredential.user.email}`);

            // 회원가입 후 로그인 페이지로 이동
            router.push('/login');
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                alert('이미 가입된 이메일입니다. 로그인 페이지로 이동합니다.');
                router.push('/login'); // 이미 가입된 이메일이면 로그인 페이지로 이동
            } else {
                console.error('회원가입 실패:', error);
                setError(error.message);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-xl font-bold mb-4">회원가입</h1>
            <form onSubmit={handleSignup} className="flex flex-col">
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
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    회원가입
                </button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}
