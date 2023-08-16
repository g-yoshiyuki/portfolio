import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useAnimationContext } from "../contexts/AnimationContext";

function isSafari() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.indexOf("safari") !== -1 && ua.indexOf("chrome") === -1;
}

const LoadingScreen: React.FC = () => {
  const loadingScreenRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressBarInnerRef = useRef<HTMLDivElement>(null);
  const { animationFinished, setAnimationFinished } = useAnimationContext();

  const loadingText = "LOADING".split("").map((char, index) => (
    <span key={index} className="char">
      {char}
    </span>
  ));
  // クライアントサイドでのみ動作するuseLayoutEffectを定義
  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    if (animationFinished) {
      loadingScreenRef.current!.style.display = "none";
      return;
    }
    const tl = gsap.timeline();
    tl.set(`.char`, { willChange: "transform, opacity" }).to(`.char`, {
      y: 0,
      stagger: 0.05 /*テキスト間の遅延時間*/,
      duration: 0.5,
      ease: "power2.out",
      onComplete: function () {
        if (!isSafari()) {
          gsap.set(`.char`, { willChange: "auto" });
        }
      },
    });
    tl.set([progressBarRef.current, progressBarInnerRef.current], {
      willChange: "transform",
    }).to(progressBarRef.current, {
      duration: 0.6,
      delay: 0.3,
      transform: "scaleX(1)",
      ease: "expo.out",
    });
    tl.to(progressBarInnerRef.current, {
      duration: 0.6,
      delay: 0.2,
      transform: "scaleX(1)",
      ease: "expo.out",
    });
    tl.to(`.char`, {
      opacity: 0,
      y: -30,
      duration: 0.3,
    });

    tl.to(progressBarRef.current, {
      duration: 0.5,
      transform: "scaleX(0)",
      transformOrigin: "right",
      ease: "expo.out",
      onComplete: function () {
        if (!isSafari()) {
          gsap.set(progressBarRef.current, { willChange: "auto" });
        }
      },
    });
    tl.to(progressBarInnerRef.current, {
      duration: 0.5,
      transform: "scaleX(0)",
      transformOrigin: "right",
      ease: "expo.out",
      onComplete: function () {
        if (!isSafari()) {
          gsap.set(progressBarInnerRef.current, { willChange: "auto" });
        }
      },
    });
    tl.set(loadingScreenRef.current, { willChange: "opacity" }).to(
      loadingScreenRef.current,
      {
        duration: 1,
        opacity: 0,

        onComplete: () => {
          // ローディング完了通知
          if (loadingScreenRef.current) {
            loadingScreenRef.current.style.display = "none";
            if (!isSafari()) {
              gsap.set(loadingScreenRef.current, { willChange: "auto" });
            }
          }
        },
      }
    );
    // 上記のonCompleteで完了通知するとローディング画面が消えて間が空いてからheroに通知が行くので遅い。
    // 以下でtrueにするタイミングを少し早めている。
    tl.add(() => {
      setAnimationFinished(true);
    }, "-=.55");
  }, [setAnimationFinished]);

  return (
    <div ref={loadingScreenRef} className="loadingScreen">
      <p className="loadingScreen__text">{loadingText}</p>
      <div className="progressBar" ref={progressBarRef}>
        <div ref={progressBarInnerRef} className="progressBarInner"></div>
      </div>
    </div>
  );
};
export default LoadingScreen;
