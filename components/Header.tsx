import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <header className="w-full bg-white shadow-md">
            <div className="container mx-auto flex justify-between items-center py-4 px-6 max-w-screen-xl">
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => router.push('/')}
                    role="button"
                    tabIndex={0}
                >
                    <img src="/logo.png" alt="Logo" className="h-8" />
                </div>
                <div
                    className="flex-grow mx-4 text-3xl font-bold cursor-pointer"
                    onClick={() => router.push('/')}
                    role="button"
                    tabIndex={0}
                >
                    COMMUNITY
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={() => router.push('/signup')}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-sm"
                    >
                        회원가입
                    </button>
                </div>
            </div>
            <nav className="bg-gray-200">
                <div className="container mx-auto flex items-center py-2 max-w-screen-xl">
                    <Link
                        href="/"
                        className={`mx-4 text-gray-700 hover:text-gray-900 ${
                            pathname && (pathname === '/' || pathname.startsWith('/posts')) ? 'font-bold' : ''
                        }`}
                    >
                        자유게시판
                    </Link>
                    <Link
                        href="/qna"
                        className={`mx-4 text-gray-700 hover:text-gray-900 ${
                            pathname && pathname.startsWith('/qna') ? 'font-bold' : ''
                        }`}
                    >
                        Q&A 게시판
                    </Link>
                </div>
            </nav>
        </header>
    );
}
