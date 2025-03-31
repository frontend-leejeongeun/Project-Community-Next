import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="ko">
            <Head>
                {/* Pretendard 웹폰트 - 비동기 로드로 렌더링 차단 방지 */}
                <link
                    rel="preload"
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css"
                    as="style"
                    onLoad={(e) => {
                        const link = e.target as HTMLLinkElement;
                        link.onload = null;
                        link.rel = 'stylesheet';
                    }}
                />
                <noscript>
                    <link
                        rel="stylesheet"
                        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css"
                    />
                </noscript>
            </Head>
            <body className="font-sans antialiased">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
