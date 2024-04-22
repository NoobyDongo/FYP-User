/** @type {import('next').NextConfig} */
const nextConfig = {
    images: { domains: ['localhost', 'upload.wikimedia.org'] },
    env: {
        NEXT_PUBLIC_PK: process.env.TEST_PK,
        NEXT_PUBLIC_SK: process.env.TEST_SK,
    },
};

export default nextConfig;
