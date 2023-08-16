/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 静的ファイルを生成するための設定。これを指定するとapiディレクトリが使えなくなる。apiディレクトリは空にしておく。
  output: 'export',
  // ロリポップにアップするためにexportする際は、以下のコメントアウトを外す。
  // Imageコンポーネントのサーバーサイドの機能を無効に出来るためエラーを起こさずにビルドできる。

  images: {
    disableStaticImages: true,
    unoptimized: true,
  },
   // トレイリングスラッシュを追加することで、ページをディレクトリとしてエクスポートする
  //  ※URLの末尾にスラッシュがつくようになるので、カノニカルの設定など気をつける。
  //  /works/index.tsxをビルドすると/works.htmlとして出力されるのでロリポップにアップすると
  //  worksにダイレクトでアクセスすると403エラーが発生する。
  // 下層にディレクトリを作るときは、以下を指定する。
  trailingSlash: true
}

module.exports = nextConfig
