// _app.tsx でインポートしているものを index.tsx や他のコンポーネントでインポートすることでパフォーマンスが悪化することはない。gsapなど使用するページファイルでもimportする。
import type { AppProps } from "next/app";
import "../styles/style.scss";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import LoadingScreen from "../components/LoadingScreen";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// 関数の実行を遅らせる debounce 関数を定義
// 型を指定しているだけ
// ()が2つあるのは、関数の型指定において、引数と戻り値の型をそれぞれ指定するための構文
// 1つ目の()が引数で、2つ目が戻り値。
function debounce(
  func: (...args: any[]) => void,
  wait: number
): (...args: any[]) => void {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function MyApp({ Component, pageProps }: AppProps) {

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // useEffectはレンダリング後に実行されるため、正確なページの高さを取得できる
  useEffect(() => {
    const container = scrollContainerRef.current;
    // body の高さを更新する関数
    const updateBodyHeight = () => {
      if (container) {
        // ページコンテンツの高さをbodyのheightとして設定する
        const height = container.clientHeight;
        document.body.style.height = `${height}px`;
      }
    };
    let scrollTriggerInstance: ScrollTrigger | undefined;
    let tweenInstance: gsap.core.Tween | undefined;
    // Y 値を更新する関数
    const updateYValue = () => {
      if (container && tweenInstance) {
        // Y 値を更新
        tweenInstance.vars.y = -(
          container.clientHeight - document.documentElement.clientHeight
        );
        // スクロールトリガーの更新を強制的に行う
        if (scrollTriggerInstance) {
          scrollTriggerInstance.update();
        }
      }
    };
    // リサイズイベントの処理を debounce で最適化
    const handleResize = debounce(() => {
      updateBodyHeight();
      updateYValue(); // Y 値を更新
      ScrollTrigger.refresh(); // スクロールトリガーをリフレッシュ
    }, 200);
    window.addEventListener("resize", handleResize);

    if (container) {
      // 初回のbodyの高さを設定
      updateBodyHeight();
      // スムーズスクロールのアニメーションを設定
      // document.documentElement.clientHeight = ビューポートの高さ
      // ページの高さからビューポートの高さを引いた値分、移動する。
      const tween = gsap.to(container, {
        y: -(container.clientHeight - document.documentElement.clientHeight),
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          // [vertical] [horizontal]
          // つまり、startが左上、endが右下
          // startプロパティとendプロパティに指定された値は、ビューポートを基準とする
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            scrollTriggerInstance = self; // ScrollTrigger インスタンスを取得
          },
        },
      });
      tweenInstance = tween; // Tween インスタンスを取得
    }

    // クリーンアップ関数
    // アンマウントされる際に実行。リサイズイベントリスナー等を削除して、メモリリークを防ぐ役割。
    return () => {
      window.removeEventListener("resize", handleResize);
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
      if (tweenInstance) {
        tweenInstance.kill();
      }
    };
  }, []);

  return (
    <>
    <LoadingScreen />
    <div id="viewport">
      <div id="scroll-container" ref={scrollContainerRef}>
        <Component {...pageProps} />
      </div>
    </div>
    </>
  );
}

export default MyApp;
