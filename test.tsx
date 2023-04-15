import type { NextPage } from "next";
import Image from "next/image";
import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Hero from "../components/Hero";
import {
  servicesData,
  servicesTextAnim,
  worksTextAnim,
} from "../constants/constants";
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Home: NextPage = () => {
  type Selector = string;
  interface AnimationOptions {
    from: gsap.TweenVars;
    to: gsap.TweenVars;
    stagger: number;
    start?: string;
    end?: string;
  }

  const parallaxImageRef = useRef<HTMLImageElement>(null);
  // 画像パララックス
  useLayoutEffect(() => {
    // gsap.utils.toArray関数は、指定されたCSSセレクタに一致するすべての要素を取得し、それらを配列に変換する
    (gsap.utils.toArray(".js-parallax") as HTMLElement[]).forEach(
      (wrap: HTMLElement) => {
        // data-yに指定した数値だけ縦方向に動かす。指定していなければ-100が採用される。
        const y = wrap.getAttribute("data-y") || -100;

        gsap.to(wrap, {
          y: y,
          scrollTrigger: {
            trigger: wrap,
            start: "top bottom",
            end: "bottom top",
            // 画像が動くスピード。おおきくなるほどゆっくり
            scrub: 3,
            //markers: true
          },
        });
      }
    );

    // スクロールトリガーの設定が同じ要素のアニメーション設定。まとめて取得
    const commonScrollTriggerElements: HTMLElement[] = [
      ...(gsap.utils.toArray(".js-textAnim") as HTMLElement[]),
      ...(gsap.utils.toArray(".js-textAnim--side") as HTMLElement[]),
      ...(gsap.utils.toArray(".js-titleAnim span") as HTMLElement[]),
      ...(gsap.utils.toArray(".js-fadeUpAnim") as HTMLElement[]),
    ];
    const animations = {
      textAnim: {
        from: { opacity: 0, y: 30 },
        to: { opacity: 1, y: 0, duration: 1, ease: "power4.out" },
      },
      textAnimSide: {
        from: { opacity: 0, x: -30 },
        to: { opacity: 1, x: 0, duration: 1, ease: "power2.out" },
      },
      // GsapはclipPathプロパティをサポートしていないので、
      // cssで初期設定をつくっている。
      titleAnim: {
        from: {},
        to: { clipPath: "inset(0)" },
      },
      fadeUpAnim: {
        from: { opacity: 0, y: 30 },
        to: { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      },
    };

    // 条件分岐でelにアニメーション設定
    commonScrollTriggerElements.forEach((el) => {
      const isTitleAnim = el.parentElement?.classList.contains("js-titleAnim");
      const isTextAnimSide = el.classList.contains("js-textAnim--side");
      const isTextAnim = el.classList.contains("js-textAnim");
      const isFadeUpAnim = el.classList.contains("js-fadeUpAnim");
      // const isDelayed = el.classList.contains("js-delayed");

      let animationConfig;

      if (isTitleAnim) {
        animationConfig = animations.titleAnim;
      }
      else if (isTextAnimSide) {
        animationConfig = animations.textAnimSide;
      }
      else if (isTextAnim) {
        animationConfig = animations.textAnim;
      }
      else if (isFadeUpAnim) {
        animationConfig = animations.fadeUpAnim;
        // 遅延させたい要素に.isDelayedを付与し、以下のコメントアウトを外す
        // if (isDelayed) {
        //   // 新しいオブジェクトを作成し、既存の設定と delay を追加
        //   animationConfig.to = { ...animationConfig.to, delay: 1 };
        // }
      }
      else {
        // デフォルトのアニメーション設定
        animationConfig = animations.textAnim;
      }

      gsap.fromTo(el, animationConfig.from, {
        ...animationConfig.to,
        scrollTrigger: {
          trigger: el,
          // start: window.innerWidth <= 768 ? "top 80%" : "top 70%",
          // end: window.innerWidth <= 768 ? "bottom 40%" : "bottom 30%",
          start: "top 70%",
          end: "bottom 30%",
        },
      });
    });

    // staggerを使用するアニメーショングループを生成する関数
    // staggerを使用するには、ひとつのfromToにまとめる必要があるため別途で作成する。
    function staggeredFadeUpAnim(
      selector: Selector,
      options: AnimationOptions
    ) {
      const elements = gsap.utils.toArray(selector) as HTMLElement[];
      // スマホ時にサービスリストが縦並びになったらstaggerを解除する
      if (window.innerWidth <= 640) {
        elements.forEach((element) => {
          gsap.fromTo(element, options.from, {
            ...options.to,
            scrollTrigger: {
              trigger: element,
              start: options.start || "top 70%",
              end: options.end || "bottom 30%",
            },
          });
        });
      } else {
        gsap.fromTo(elements, options.from, {
          ...options.to,
          stagger: options.stagger,
          scrollTrigger: {
            trigger: elements[0],
            start: options.start || "top 70%",
            end: options.end || "bottom 30%",
          },
        });
      }
    }
    const fadeUpAnimOptions = {
      from: { opacity: 0, y: 40 },
      to: { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" },
      stagger: 0.1,
    };
    staggeredFadeUpAnim(".js-staggeredFadeUpAnim", fadeUpAnimOptions);
  }, []);

  return (
    <>
      <main>
        <Hero />
        <section className="services">
          <div className="textAnim">
            {Array.from({ length: 2 }, (_, ulIndex) => (
              <ul key={ulIndex}>
                {servicesTextAnim.map((item, liIndex) => (
                  <li key={`${ulIndex}-${liIndex}`}>{item}</li>
                ))}
              </ul>
            ))}
          </div>
          <div className="container">
            <h2 className="c-title c-title--alt js-titleAnim">
              <span>SERVICES</span>
            </h2>
            <ul className="services__list">
              {servicesData.map((service, index) => (
                <li
                  className="services__list-item js-staggeredFadeUpAnim"
                  key={index}
                >
                  <h3 className="c-title--accent">- {service.title} -</h3>
                  <div className="services__list-icon">
                    <img src={service.iconSrc} alt={service.iconAlt} />
                  </div>
                  <p className="c-text c-text--alt">{service.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="l-image">
          <Image
            src="/img/works-bg.webp"
            width={2000}
            height={1333}
            alt=""
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
            }}
            quality={100}
            ref={parallaxImageRef}
            className="js-parallax"
            data-y="-12vw"
            loading="eager"
          />
        </div>
        <div className="works">
          <div className="textAnim textAnim--accent">
            {Array.from({ length: 2 }, (_, ulIndex) => (
              <ul key={ulIndex}>
                {worksTextAnim.map((item, liIndex) => (
                  <li key={`${ulIndex}-${liIndex}`}>{item}</li>
                ))}
              </ul>
            ))}
          </div>
          <div className="container">
            <div className="js-textAnim">
              <p className="works__heading">
                <span>実務の制作実績はこちら</span>
              </p>
              <div className="l-button">
                <a
                  href="https://goubarayoshiyuki.com/"
                  target="_blank"
                  rel="noopener"
                  className="c-button c-button--l"
                >
                  <span className="c-button__text">
                    <span>WORKS</span>
                    <span>WORKS</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <section className="profile">
          <div className="container container--s">
            <h2 className="c-title c-title--alt js-titleAnim">
              <span>PROFILE</span>
            </h2>
            <div className="profile__info">
              <div className="profile__info-content js-textAnim--side">
                <p className="c-paragraph c-paragraph--alt">
                  <span className="heading">LANGUAGES</span>
                  HTML / SCSS / JavaScript / Typescript
                </p>
                <p className="c-paragraph c-paragraph--alt">
                  <span className="heading">FRAMEWORKS / OTHERS</span>
                  React.js / Next.js / Node.js / Express.js / Git
                </p>
                <p className="c-paragraph c-paragraph--alt">
                  <span className="heading">DESIGN TOOLS</span>
                  Figma / Photoshop / Adobe XD
                </p>
              </div>
              <div className="profile__info-image js-fadeUpAnim">
                <Image
                  src="/img/image.webp"
                  width={160}
                  height={192.48}
                  alt=""
                  sizes="100vw"
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                  loading="eager"
                  quality={100}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
