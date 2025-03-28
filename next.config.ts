import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    // 새로고침 시 동적 라우팅 경로 문제 방지
    // 빌드 시 standalone 모드로 설정 (custom 서버 또는 node 환경에서 배포할 경우 안정적)
    output: 'standalone',
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
