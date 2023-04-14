import type { AppProps } from "next/app";
import "../styles/style.scss";
import { useRef, useLayoutEffect, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import LoadingScreen from "../components/LoadingScreen";
import { AnimationProvider } from "../contexts/AnimationContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import Head from "next/head";
import { DefaultSeo } from "next-seo";
import { defaultSEO } from "../constants/next-seo.config";
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
// 関数の実行を遅らせるdebounce関数の型定義
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

  // デバイス判定。初期値に判定結果が入る。
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  });

  useLayoutEffect(() => {
    // モバイルデバイスの場合、スムーズスクロールを無効にする
    if (isMobile) return;

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
      updateYValue();
      ScrollTrigger.refresh();
    }, 200);
    window.addEventListener("resize", handleResize);

    if (container) {
      // 初回のbodyの高さを設定
      // updateBodyHeightを実行するだけでは、正確な高さを取得出来ずページ下部が少し切れてしまう。
      // handleResize()を実行することで正確に動作した。
      // updateBodyHeight();
      handleResize();

      // スムーズスクロールのアニメーションを設定
      // document.documentElement.clientHeight = ビューポートの高さ
      // ページの高さからビューポートの高さを引いた値分、移動する。
      const tween = gsap.to(container, {
        y: -(container.clientHeight - document.documentElement.clientHeight),
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            scrollTriggerInstance = self;
          },
        },
      });
      tweenInstance = tween;
    }
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
      <AnimationProvider>
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <DefaultSeo {...defaultSEO} />
        <LoadingScreen />
        <Header />
        <div id="viewport" className={isMobile ? "mobileDevice" : ""}>
          <div
            id="scroll-container"
            ref={scrollContainerRef}
            className={isMobile ? "mobileDevice" : ""}
          >
            <Component {...pageProps} />
            <Footer />
          </div>
        </div>
      </AnimationProvider>
    </>
  );
}

export default MyApp;
