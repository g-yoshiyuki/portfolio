window.addEventListener("DOMContentLoaded", () => {
  // 複数のタイムラインをグループ化するために親のタイムラインを作成している
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

  document.querySelectorAll(".word").forEach((word) => {
    tl.add(createChildTimeline(word), "-=90%");
  });

  // .rectは白ベタ塗り
  function createChildTimeline(element: any) {
    const elText = element.querySelector(".rect");
    const tl = gsap
      .timeline()
      .from(element, {
        y: 16,
        opacity: 0,
        duration: 0.75,
        ease: "power4.out",
      })
      .set(elText, { opacity: 0 })
      .to(
        elText,
        {
          x: "105%",
          duration: 1,
          ease: "power4.out",
        },
        "-=50%"
      );
    return tl;
  }
});
<div className="container">

  <span className="word">
    <span className="rect"></span>
    <span className="label">INTERACTION</span>
  </span>

  <span className="word">
    <span className="rect"></span>
    <span className="label">DESIGN</span>
  </span>
  <span className="word">
    <span className="rect"></span>
    <span className="label">&</span>
  </span>
  <span className="word">
    <span className="rect"></span>
    <span className="label">TECHNOLOGY</span>
  </span>
  <span className="word">
    <span className="rect"></span>
    <span className="label">by</span>
  </span>
  <span className="word">
    <span className="rect"></span>
    <span className="label">ICS MEDIA</span>
  </span>
</div>;
/*★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★

★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★ */
import React, { useEffect, useRef } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const heroContentRef = useRef();

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

    tl.add(createChildTimeline(heroContentRef.current), "-=90%");

    function createChildTimeline(element) {
      const elText = element.querySelector(".hero__content-title");
      const tl = gsap
        .timeline()
        .from(element, {
          y: 16,
          opacity: 0,
          duration: 0.75,
          ease: "power4.out",
        })
        .set(elText, { opacity: 0 })
        .to(
          elText,
          {
            x: "105%",
            duration: 1,
            ease: "power4.out",
          },
          "-=50%",
        );
      return tl;
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className="hero__content" ref={heroContentRef}>
        <span className="hero__content-label">FREELANCE</span>
        <h1 className="hero__content-title">
          YOSHIYUKI
          <br />
          GOUBARA
          <br />
          PORTFOLIO
        </h1>
        <p className="hero__content-subTitle">WEB CREATOR / DIRECTOR</p>
        <span className="subText subText--alt">
          {" "}
          Contact : <br className="break-pc" />
          <a
            href="mailto:goubarayoshiyuki@gmail.com"
            className="text-link"
          >
            goubarayoshiyuki@gmail.com
          </a>
        </span>
      </div>
    </div>
  );
}
