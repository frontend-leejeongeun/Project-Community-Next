// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // 새로고침 시 동적 라우팅 경로 문제 방지
    // 빌드 시 standalone 모드로 설정 (custom 서버 또는 node 환경에서 배포할 경우 안정적)
    output: 'standalone',

    // ESLint 에러가 있어도 빌드 진행되도록 설정 (Vercel 배포용)
    eslint: {
        ignoreDuringBuilds: true,
    },

    // 외부에서 경로 직접 접근 시 404 방지용 rewrites 설정 (필요 시)
    async rewrites() {
        return [
            {
                source: '/:path*',
                destination: '/:path*',
            },
        ];
    },
};

export default nextConfig;
