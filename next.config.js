// リダイレクトリスト
// const redirectMap = [
//   { oldPath: '/works/', newPath: '/works' },
//   { oldPath: '/works/0/', newPath: '/works/0' },
//   { oldPath: '/works/1/', newPath: '/works/1' },
//   { oldPath: '/works/2/', newPath: '/works/2' },
//   { oldPath: '/works/3/', newPath: '/works/3' },
//   { oldPath: '/works/4/', newPath: '/works/4' },
//   { oldPath: '/works/5/', newPath: '/works/5' },

// ];
const TerserPlugin = require("terser-webpack-plugin");
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // 静的ファイルを生成するための設定。これを指定するとapiディレクトリが使えなくなる。apiディレクトリは空にしておく。以下のredirects()を使用するときはoutput: 'export',を使用できないのでコメントアウトして、npm run exportを使用する。
  output: 'export',

  // ロリポップにアップするためにexportする際は、以下のコメントアウトを外す。
  // Imageコンポーネントのサーバーサイドの機能を無効に出来るためエラーを起こさずにビルドできる。
  images: {
    disableStaticImages: true,
    unoptimized: true,
  },
  // async redirects() {
  //   return redirectMap.map(({ oldPath, newPath }) => ({
  //     source: oldPath,
  //     destination: newPath,
  //     permanent: true,
  //   }));
  // },
   // トレイリングスラッシュを追加することで、ページをディレクトリとしてエクスポートする
  //  ※URLの末尾にスラッシュがつくようになるので、カノニカルの設定など気をつける。
  //  /works/index.tsxをビルドすると/works.htmlとして出力されるのでロリポップにアップすると
  //  worksにダイレクトでアクセスすると403エラーが発生する。
  // 下層にディレクトリを作るときは、以下を指定する。
  // trailingSlash: true

  webpack(config, { dev, isServer }) {
    if (!dev && !isServer) {
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false, // コメントを削除
            },
          },
          extractComments: false, // ライセンスコメントも削除
        })
      );
    }
    return config;
  },
}

module.exports = nextConfig
