import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

// このファイルは、すべてのページで共通のマークアップ（たとえば、Google Tag Managerのようなサイト全体のスクリプト）を追加するために使用する。_app.tsx のコードとうまくマージしてくれる。<Main />は、自動的に現在のページの内容を注入するためのコンポーネント。

// _document.tsxを作成し、それを/pagesディレクトリに置くと、Next.jsは自動的にそのファイルを使用してHTMLドキュメントをレンダリングします。別途インポートしたり呼び出したりする必要はありません。

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="ja">
        <Head></Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
