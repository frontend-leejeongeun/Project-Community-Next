import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from "@/contexts/AuthContext"; // context 경로 확인!

export default function App({ Component, pageProps }: AppProps) {
    return <AuthProvider><Component {...pageProps} /></AuthProvider>;
}