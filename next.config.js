/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // ロリポップにアップするためにexportする際は、以下のコメントアウトを外す。
  // Imageコンポーネントのサーバーサイドの機能を無効に出来るためエラーを起こさずにビルドできる。

  // images: {
  //   disableStaticImages: true,
  //   unoptimized: true,
  // },
}

module.exports = nextConfig
