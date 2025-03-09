import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();

    return (
        <header className="w-full bg-white shadow-md">
            <div className="container mx-auto flex justify-between items-center py-4 px-6 max-w-screen-xl">
                <div className="flex items-center">
                    <img src="/logo.png" alt="Logo" className="h-8" />
                </div>
                <div className="flex-grow mx-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none"
                    />
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={() => router.push('/signup')}
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                        회원가입
                    </button>
                </div>
            </div>
        </header>
    );
}