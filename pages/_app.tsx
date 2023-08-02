import type { AppProps } from "next/app";
import "../styles/style.scss";
import { useRef, useLayoutEffect, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { AnimationProvider } from "../contexts/AnimationContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import Head from "next/head";
import { DefaultSeo } from "next-seo";
import { defaultSEO } from "../constants/next-seo.config";
import router from "next/router";
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
// 全体の注意点
// リサイズしたり、ルートが変わったりした時にScrollTriggerの再計算を行い、再生成することが必要。
// そのためには、ScrollTriggerを生成する部分を関数としてまとめ、それをuseEffect内で呼び出すことが必要。
// 上記を実行しないとイベント時に正しいbodyの高さを取得できない。
// Safari、モバイルでスムーズスクロールを無効にしている。すべての関数の処理の前に条件分岐でreturnしないと、bodyの高さが更新されてしまったり、Safariで表示くずれをおこす。
// 重たい処理を書きすぎると、トップページのローディング画面のアニメーションが実行されなかった。軽量化することを意識する。

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
// Safariを判定する関数を追加
function isSafari() {
  if (typeof window === "undefined") return false; // サーバーサイドではブラウザーを判定できないため
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.indexOf("safari") !== -1 && ua.indexOf("chrome") === -1;
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
  // Safari判定。初期値に判定結果が入る。
  const [isBrowserSafari, setIsBrowserSafari] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return isSafari();
  });
  // body の高さを更新する関数
  const updateBodyHeight = () => {
    // Safariまたはモバイルデバイスの場合、スムーズスクロールを無効にする
    if (isBrowserSafari || isMobile) {
      return;
    }
    if (scrollContainerRef.current) {
      const height = scrollContainerRef.current.clientHeight;
      document.body.style.height = `${height}px`;
    }
  };
  let scrollTriggerInstance: ScrollTrigger | undefined;
  let tweenInstance: gsap.core.Tween | undefined;

  // ScrollTriggerとTweenインスタンスを生成する関数
  // スクロールトリガーとTweenを作成するための専用の関数をつくることで
  // いつでも簡単に新しいトリガーとTweenを作成できるようになる。
  const createScrollTrigger = () => {
    // Safariまたはモバイルデバイスの場合、スムーズスクロールを無効にする
    if (isBrowserSafari || isMobile) {
      return;
    }
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }
    //既存のScrollTriggerとTweenインスタンスを破棄する処理
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
      scrollTriggerInstance = undefined;
    }
    if (tweenInstance) {
      tweenInstance.kill();
      tweenInstance = undefined;
    }

    //Tweenの位置を更新し、スクロールトリガーを更新する関数
    const update = () => {
      if (container && tweenInstance) {
        tweenInstance.vars.y = -(
          container.clientHeight - document.documentElement.clientHeight
        );
        if (scrollTriggerInstance) {
          scrollTriggerInstance.update();
        }
      }
      // requestAnimationFrameを使用して、ブラウザが新しいフレームを描画するたびに更新
      requestAnimationFrame(update);
    };

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
      onStart: () => {
        if (container) {
          container.style.willChange = "transform";
        }
      },
      onComplete: () => {
        if (container && !isSafari()) {
          container.style.willChange = "auto";
        }
      },
    });
    tweenInstance = tween;
    // Tweenとスクロールトリガーの更新を開始。
    update();
  };

  // router.eventsで、Linkコンポーネントでページ遷移時にスクロールトリガーを再生成するためのイベントハンドラを登録する。
  useEffect(() => {
    const handleRouteChangeStart = () => {
      if (isBrowserSafari || isMobile) {
        return;
      }
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
    };
    const handleRouteChangeComplete = () => {
      if (isBrowserSafari || isMobile) {
        return;
      }
      updateBodyHeight();
      ScrollTrigger.refresh(true);
      createScrollTrigger();
    };
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router.events]);

  // 画面リサイズ時の処理と、初期表示時のScrollTriggerの設定
  useLayoutEffect(() => {
    // モバイルデバイスまたはSafariの場合、スムーズスクロールを無効にする
    if (isMobile || isBrowserSafari) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.position = "static";
        scrollContainerRef.current.style.overflow = "visible";
      }
      const viewport = document.getElementById("viewport");
      if (viewport) {
        viewport.style.position = "static";
        viewport.style.overflow = "visible";
      }
      return;
    }
    // リサイズイベントの処理を debounce で最適化
    const handleResize = debounce(() => {
      updateBodyHeight();
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
      if (tweenInstance) {
        tweenInstance.kill();
      }
      createScrollTrigger();
    }, 200);
    window.addEventListener("resize", handleResize);
    // 初期化時に一度だけ handleResize を呼び出す
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
      if (tweenInstance) {
        tweenInstance.kill();
      }
    };
  }, [isMobile, isBrowserSafari]);

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
