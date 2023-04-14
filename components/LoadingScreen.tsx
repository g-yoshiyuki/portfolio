import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useAnimationContext } from "../contexts/AnimationContext";

const LoadingScreen: React.FC = () => {
  const loadingScreenRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressBarInnerRef = useRef<HTMLDivElement>(null);
  const { setAnimationFinished } = useAnimationContext();
  const loadingText = "LOADING".split("").map((char, index) => (
    <span key={index} className="char">
      {char}
    </span>
  ));

  useLayoutEffect(() => {
    const tl = gsap.timeline();
    tl.to(`.char`, {
      y: 0,
      stagger: 0.05 /*テキスト間の遅延時間*/,
      duration: 0.5,
      ease: "power2.out",
    });

    tl.to(progressBarRef.current, {
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
    });
    tl.to(progressBarInnerRef.current, {
      duration: 0.5,
      transform: "scaleX(0)",
      transformOrigin: "right",
      ease: "expo.out",
    });
    tl.to(loadingScreenRef.current, {
      duration: 1,
      opacity: 0,

      // 左から開くパターン
      // duration: .7,
      // x: "100%",
      // ease: "power4.out",

      onComplete: () => {
        // ローディング完了通知
        // setAnimationFinished(true);
        if (loadingScreenRef.current) {
          loadingScreenRef.current.style.display = "none";
        }
      },
    });
    // onCompleteで完了通知するとローディング画面が消えてから間があく。
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
