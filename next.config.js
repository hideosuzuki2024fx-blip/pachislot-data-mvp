// 🔧 changed: 不要なswcMinify設定を削除し警告を解消

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true, // 🔧 deleted: この行を削除しました
}

module.exports = nextConfig
