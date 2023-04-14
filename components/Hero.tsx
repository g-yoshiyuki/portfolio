import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useAnimationContext } from "../contexts/AnimationContext";
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Hero = () => {
  const { animationFinished } = useAnimationContext();
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const parentTl = gsap.timeline();
    const heroContent = heroContentRef.current;
    const heroImage = heroImageRef.current;
    const words = gsap.utils.toArray(".word", heroContent) as Element[];
    // ローディング画面が消えてから初期状態をつくるとアニメーションが成立しないため、以下で事前にセットしておく
    words.forEach((word) => {
      gsap.set(word, {
        y: 16,
        opacity: 0,
      });
    });
    if (heroImage) {
      gsap.set(heroImage, {
        opacity: 0,
        y: 5,
      });
    }
    const createChildTimeline = (element: Element) => {
      const elText = element.querySelector(".rect") as HTMLSpanElement;
      const tl = gsap.timeline();
      tl.to(element, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power4.out",
      });
      tl.to(
        elText,
        {
          x: "105%",
          duration: 0.7,
          ease: "power4.out",
        },
        "-=60%"
      );
      return tl;
    };

    // ローディングが完了したら以下を実行
    // word一つずつを上記でtlに設定する。一つずつが重なるタイミングでフェードアップするように、
    // "-=90%"を指定して前のアニメーションが終了する90%前に次のアニメーションを実行する。
    // しかし1つ目のtlにも反映されて、1つめだけアニメーション終了時点から表示されてしまう。
    // これを防ぐために index === 0 ? 0 : "-=90%" という指定でindex0番目だけオフセットを0にしている。
    if (animationFinished) {
      words.forEach((word, index) => {
        parentTl.add(createChildTimeline(word), index === 0 ? 0 : "-=90%");
      });
      parentTl.add(
        gsap.to(heroImage, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power4.easeOut",
        }),
        0.6
      );
      parentTl.add(() => {
        if (heroContent) {
          const title = heroContent.querySelector(
            ".hero__content-title"
          ) as HTMLElement;
          if (title) {
            title.style.borderBottom = "1px solid rgba(239, 239, 239, 0.2)";
          }
        }
      }, parentTl.totalDuration() - 1); // タイムライン終了の1秒前に実行
    }
  }, [animationFinished]);

  return (
    <>
      <div className="hero">
        <div className="container">
          <div className="hero__content" ref={heroContentRef}>
            <span className="hero__content-label word">
              <span className="rect"></span>
              <span className="label">FREELANCE</span>
            </span>
            <h1 className="hero__content-title">
              <span className="word">
                <span className="rect"></span>
                <span className="label">YOSHIYUKI</span>
              </span>
              <br />
              <span className="word">
                <span className="rect"></span>
                <span className="label">GOUBARA</span>
              </span>
              <br />
              <span className="word">
                <span className="rect"></span>
                <span className="label">PORTFOLIO</span>
              </span>
            </h1>
            <p className="hero__content-subTitle">
              <span className="word">
                <span className="rect"></span>
                <span className="label">WEB CREATOR&nbsp;/&nbsp;</span>
              </span>
              <span className="word">
                <span className="rect"></span>
                <span className="label">DIRECTOR</span>
              </span>
            </p>

            <span className="word subText subText--alt">
              <span className="rect"></span>
              Contact:&nbsp;
              <br className="break-pc" />
              <a
                href="mailto:goubarayoshiyuki@gmail.com"
                className="text-link label"
              >
                goubarayoshiyuki@gmail.com
              </a>
            </span>
          </div>
          <div className="hero__image" ref={heroImageRef}>
            <Image
              src="/img/hero.webp"
              width={714}
              height={474.18}
              alt=""
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto",
              }}
              quality={100}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
