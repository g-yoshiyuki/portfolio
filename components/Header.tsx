import { useAnimationContext } from "../contexts/AnimationContext";
import { useRef, useLayoutEffect, useEffect } from "react";
import { gsap } from "gsap";

function isSafari() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.indexOf("safari") !== -1 && ua.indexOf("chrome") === -1;
}

export const Header = () => {
  const { animationFinished } = useAnimationContext();
  const headerRef = useRef<HTMLHeadingElement | null>(null);

  // ローディング完了後にheaderをおろす
  useLayoutEffect(() => {
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

  return (
    <>
      <header className="header" ref={headerRef}>
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
      </header>
    </>
  );
};
