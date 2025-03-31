import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="ko">
            <Head>
                <link
                    rel="preload"
                    as="style"
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css"
                    // @ts-ignore
                    onLoad="this.onload=null;this.rel='stylesheet'"
                />
                <noscript
                    dangerouslySetInnerHTML={{
                        __html: `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css" />`,
                    }}
                />
            </Head>
            <body className="font-sans antialiased">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
