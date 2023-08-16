import { useAnimationContext } from "../contexts/AnimationContext";
import { useRef, useLayoutEffect, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";

function isSafari() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.indexOf("safari") !== -1 && ua.indexOf("chrome") === -1;
}

export const Header = () => {
  const { animationFinished } = useAnimationContext();
  const headerRef = useRef<HTMLHeadingElement | null>(null);
  const hmRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  // クライアントサイドでのみ動作するuseLayoutEffectを定義
  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  // ローディング完了後にheaderをおろす
  useIsomorphicLayoutEffect(() => {
    const header = headerRef.current;
    if (header) {
      gsap.set(header, {
        opacity: 0,
        y: -90,
      });
      if (animationFinished) {
        gsap.to(header, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.7,
          ease: "power2.out",
          onStart: function () {
            gsap.set(header, { willChange: "opacity, transform" });
          },
          onComplete: function () {
            if (!isSafari()) {
              gsap.set(header, { willChange: "auto" });
            }
          },
        });
      }
    }
  }, [animationFinished]);

  // 以下headerのスクロールアニメーション。上にスクロールした時にheaderをおろす。
  // requestAnimationFrameは、画面描画のタイミングで処理が実行されるためスクロールイベントよりもリソースの無駄遣いを防ぐことができる。
  // script.jsが読み込まれると、この無名関数がすぐに実行され、スクロールイベントリスナーが設定される。
  // let update: () => void;
  // if (typeof window !== "undefined") {
  //   const header = document.querySelector(".header");
  //   let lastScrollPosition = window.pageYOffset;
  //   let ticking = false;
  //   update = function () {
  //     const currentScrollPosition = window.pageYOffset;
  //     if (header) {
  //       // headerがnullでないことを確認
  //       if (currentScrollPosition < lastScrollPosition) {
  //         header.classList.remove("scroll-header-hidden");
  //       } else {
  //         header.classList.add("scroll-header-hidden");
  //       }
  //     }
  //     lastScrollPosition = currentScrollPosition;
  //     ticking = false;
  //   };
  //   // スクロールイベントが高速で連続して発生する場合、requestAnimationFrameがすでに実行中であっても、新しいイベントが発生する可能性がある。tickingフラグを使って、requestAnimationFrameが実行中でない場合に限り、update関数が実行されるようにしている。
  //   window.addEventListener("scroll", () => {
  //     if (!ticking) {
  //       window.requestAnimationFrame(() => {
  //         update();
  //         ticking = false;
  //       });
  //       ticking = true;
  //     }
  //   });
  // }

  // 以下headerのスクロールアニメーション。上にスクロールした時にheaderをおろす。
  useEffect(() => {
    if (typeof window !== "undefined") {
      let lastScrollPosition = window.scrollY;
      let ticking = false;
      const update = () => {
        const currentScrollPosition = window.scrollY;
        if (headerRef.current) {
          // Safariの「オーバースクロール」対策。
          // スクロール位置がゼロ以下になったときにもヘッダーを表示する。
          if (
            currentScrollPosition <= 0 ||
            currentScrollPosition < lastScrollPosition
          ) {
            headerRef.current.classList.remove("scroll-header-hidden");
          } else {
            headerRef.current.classList.add("scroll-header-hidden");
          }
        }
        lastScrollPosition = currentScrollPosition;
        ticking = false;
      };
      // スクロールイベントが高速で連続して発生する場合、requestAnimationFrameがすでに実行中であっても、新しいイベントが発生する可能性がある。tickingフラグを使って、requestAnimationFrameが実行中でない場合に限り、update関数が実行されるようにしている。
      window.addEventListener("scroll", () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            update();
            ticking = false;
          });
          ticking = true;
        }
      });

      return () => {
        // コンポーネントのアンマウント時にイベントリスナーを削除
        window.removeEventListener("scroll", update);
      };
    }
  }, []);

  // Next.jsのLinkをつかっているため、ハンバーガー内のメニューをクリックしてもハンバーガーがとじない。メニューをクリックした時にとじるように各メニューに以下の関数をクリックイベントに設定している。
  // そのためpc時は影響しないようにmatchMediaを使っている。
  const handleHmClick = () => {
    if (window.matchMedia("(max-width: 640px)").matches) {
      if (hmRef.current) {
        hmRef.current.classList.toggle("active");
      }
      if (navRef.current) {
        navRef.current.classList.toggle("active");
      }
    }
  };

  return (
    <>
      <header className="header" ref={headerRef}>
        <div className="container">
          <Link href="/" className="header__logo">
            <img src="/img/logo.svg" alt="郷原 芳幸" width="50" height="50" />
          </Link>
          <nav className="header__nav" ref={navRef}>
            <ul className="header__nav-list">
              <li className="header__nav-item">
                <Link
                  href="/"
                  className="header__nav-link"
                  onClick={handleHmClick}
                >
                  HOME
                </Link>
              </li>
              <li className="header__nav-item">
                <a
                  href="https://private.goubarayoshiyuki.com/"
                  target="_blank"
                  rel="noopener"
                  className="header__nav-link"
                >
                  COMPANY WORKS
                </a>
              </li>
              <li className="header__nav-item">
                <Link
                  href="/works/"
                  className="header__nav-link"
                  onClick={handleHmClick}
                >
                  FREELANCE WORKS
                </Link>
              </li>
              <li className="header__nav-item">
                <a
                  href="https://svc.goubarayoshiyuki.com/"
                  target="_blank"
                  rel="noopener"
                  className="header__nav-link"
                >
                  MY SERVICES
                </a>
              </li>
              <li className="header__nav-item">
                <a
                  href="mailto:info@goubarayoshiyuki.com"
                  className="header__nav-link"
                >
                  SEND MAIL
                </a>
              </li>
            </ul>
            <span className="nonScroll"></span>
          </nav>
          <div className="hm" ref={hmRef} onClick={handleHmClick}>
            <span className="line"></span>
          </div>
        </div>
      </header>
      {/* 以下、ロゴ無しheader */}
      {/* <header className="header" ref={headerRef}>
        <div className="container">
          <nav className="header__nav">
            <ul className="header__nav-list">
              <li className="header__nav-item">
                <a
                  href="https://private.goubarayoshiyuki.com/"
                  target="_blank"
                  rel="noopener"
                  className="header__nav-link"
                >
                  - COMPANY WORKS -
                </a>
              </li>
              <li className="header__nav-item">
                <a className="header__nav-link no-link">
                  - FREELANCE WORKS -
                </a>
              </li>
              <li className="header__nav-item">
                <a href="https://svc.goubarayoshiyuki.com/" target="_blank" rel="noopener" className="header__nav-link">
                  - MY SERVICES -
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header> */}
    </>
  );
};
