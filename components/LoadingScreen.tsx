import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const LoadingScreen: React.FC = () => {
  const loadingScreenRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressBarInnerRef = useRef<HTMLDivElement>(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  const loadingText = "LOADING".split("").map((char, index) => (
    <span key={index} className="char">
      {char}
    </span>
  ));

  // 初回訪問判定
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const firstVisit = localStorage.getItem("firstVisit");
  //     if (!firstVisit) {
  //       localStorage.setItem("firstVisit", "false");
  //       setIsFirstVisit(true);
  //     }
  //   }
  // }, []);

  // 初回訪問判定あり
  // useEffect(() => {
  //   if (isFirstVisit && loadingScreenRef.current && progressBarRef.current) {
  //     const tl = gsap.timeline();
  //     tl.to(progressBarRef.current, {
  //       duration: 2,
  //       width: "100%",
  //     });
  //     tl.to(loadingScreenRef.current, {
  //       duration: 1,
  //       opacity: 0,
  //       onComplete: () => {
  //         if (loadingScreenRef.current) {
  //           loadingScreenRef.current.style.display = "none";
  //         }
  //       },
  //     });
  //   }
  // }, [isFirstVisit]);

  // 初回訪問判定なし
  // useEffect(() => {
  //     const tl = gsap.timeline();
  //     tl.to(progressBarRef.current, {
  //       duration: 2, // 2秒間でプログレスバーが完了する
  //       width: "100%",
  //     });
  //     tl.to(loadingScreenRef.current, {
  //       duration: 1,
  //       opacity: 0,
  //       // アニメーションが完了した後に実行する処理
  //       onComplete: () => {
  //         if (loadingScreenRef.current) {
  //           loadingScreenRef.current.style.display = "none";
  //         }
  //       },
  //     });
  // }, []);

  // 初回訪問判定なし【アニメつき】
  useEffect(() => {
    const tl = gsap.timeline();
    // tl.fromは要素の初期状態を設定する。cssで設定していれば不要。tl.toだけ書けばいい。

    // 文字が一文字ずつ登場するアニメーション
    // .charにcssを追加
    tl.to(`.char`, {
      y: 0,
      stagger: 0.05 /*テキスト間の遅延時間*/,
      duration: 0.5,
      ease: "power2.out",
    });

    tl.to(progressBarRef.current, {
      duration: .8,
      delay: .3,
      transform: "scaleX(1)",
      ease: "expo.out",
    });
    tl.to(progressBarInnerRef.current, {
      duration: .6,
      transform: "scaleX(1)",
      ease: "expo.out",
    });
    tl.to(`.char`, {
      // 2つ書くと変化は同時に行われる
      opacity: 0,
      y: -30,
      duration: .3,
    });

    tl.to(progressBarRef.current, {
      duration: .5,
      transform: "scaleX(0)",
      transformOrigin: "right",
      ease: "expo.out",
    });
    tl.to(progressBarInnerRef.current, {
      duration: .5,
      transform: "scaleX(0)",
      transformOrigin: "right",
      ease: "expo.out",
    });

    tl.to(loadingScreenRef.current, {
      duration: 1,
      opacity: 0,
      // x: "100%",
      // ease: "power4.out",
      onComplete: () => {
        if (loadingScreenRef.current) {
          loadingScreenRef.current.style.display = "none";
        }
      },
    });
  }, []);

  // 初回訪問判定あり
  // return isFirstVisit ? (
  //   <div ref={loadingScreenRef} className={styles.loadingScreen}>

  //     <h1>Loading...</h1>
  //     <div className={styles.progressBar}>
  //       <div ref={progressBarRef} className={styles.progressBarInner}></div>
  //     </div>
  //   </div>
  // ) : null;

  // 初回訪問判定なし
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
