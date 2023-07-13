import type { NextPage } from "next";
import Image from "next/image";
import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Hero from "../components/Hero";
import { skillsData, skillsTextAnim } from "../constants/constants";
import Slider from "../components/Slider";
import WorksBackground from "../components/WorksBackground";
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// gsapアニメーションはcssでwill-changeを指定するのではなく、
// onStartとonCompleteで指定する。
// cssだと読み込みが間に合っていない可能性があるし、完了後にwill-changeを削除できない。

// ※通常、onCompleteでwillChangeをautoにするのが理想だが、Safariのみ、解除するとガクつきが起こる。
// 以下のSafari判定でSafariの時はautoにしないようにする。
// Safariを判定する関数を追加
function isSafari() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.indexOf("safari") !== -1 && ua.indexOf("chrome") === -1;
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
          },
          onStart: () => {
            wrap.style.willChange = "transform";
            return;
          },
          onComplete: () => {
            if (!isSafari()) {
              wrap.style.willChange = "auto";
            }
            return;
          },
        });
      }
    );
    // スクロールトリガーの設定が同じ要素のアニメーション設定。まとめて取得
    const commonScrollTriggerElements: HTMLElement[] = [
      ...(gsap.utils.toArray(".js-textAnim") as HTMLElement[]),
      ...(gsap.utils.toArray(".js-textAnim--side") as HTMLElement[]),
      ...(gsap.utils.toArray(".js-titleAnim span") as HTMLElement[]),
    ];
    const animations = {
      textAnim: {
        from: { opacity: 0, y: 60 },
        to: { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" },
      },
      textAnimSide: {
        from: { opacity: 0, x: -60 },
        to: { opacity: 1, x: 0, duration: 0.8, ease: "power4.out" },
      },
      // GsapはclipPathプロパティをサポートしていないので、cssで初期設定をつくっている。
      titleAnim: {
        from: {},
        to: { clipPath: "inset(0)" },
      },
    };
    // 条件分岐でelにアニメーション設定
    commonScrollTriggerElements.forEach((el) => {
      const isTextAnim = el.classList.contains("js-textAnim");
      const isTitleAnim = el.parentElement?.classList.contains("js-titleAnim");
      const isTextAnimSide = el.classList.contains("js-textAnim--side");
      const isFast = el.classList.contains("js-fast"); //表示を早くしたい要素
      let animationConfig;

      if (isTitleAnim) {
        animationConfig = animations.titleAnim;
      } else if (isTextAnim) {
        animationConfig = animations.textAnim;
      } else if (isTextAnimSide) {
        animationConfig = animations.textAnimSide;
      } else {
        animationConfig = animations.textAnim;
      }
      gsap.fromTo(el, animationConfig.from, {
        ...animationConfig.to,
        scrollTrigger: {
          trigger: el,
          // start: window.innerWidth <= 768 ? "top 80%" : "top 70%",
          // end: window.innerWidth <= 768 ? "bottom 40%" : "bottom 30%",
          start: isFast ? "top 90%" : "top 70%",
          end: isFast ? "bottom 40%" : "bottom 30%",
        },
        onStart: () => {
          el.style.willChange = "transform, opacity, clip-path";
          return;
        },
        onComplete: () => {
          if (!isSafari()) {
            el.style.willChange = "auto";
          }
          return;
        },
      });
    });
    // SKILLSセクションの背景色を変更するアニメーション
    gsap.to(".skills", {
      scrollTrigger: {
        trigger: ".skills",
        // start: "top 48%",
        start: "top 20%",
        onEnter: () => {
          const skillsElements = Array.from(
            document.querySelectorAll(
              ".skills, .skills .textAnim li, .skills .c-title span, .skills .c-heading"
            )
          ) as HTMLElement[];
          skillsElements.forEach(
            (el) => (el.style.willChange = "background-color, color")
          );

          gsap.to(".skills", { backgroundColor: "#222", duration: 0.5 });
          gsap.to(".skills .textAnim li", { color: "#323232", duration: 0.5 });
          gsap.to(".skills .c-title span", { color: "#E7FAEC", duration: 0.5 });
          gsap.to(".skills .c-heading", { color: "#efefef", duration: 0.5 });
          // gsap.to(".skills .c-title--accent", {color: '#efefef', duration: .4});
          // gsap.to(".skills .c-text--alt", {color: '#efefef', duration: .4});
          // gsap.to(".skills__list-item", {borderColor: '#C3EED7',backgroundColor: '#323232', duration: .4});

          gsap.to(
            {},
            {
              duration: 0.1,
              onComplete: () =>
                skillsElements.forEach((el) => {
                  if (!isSafari()) {
                    el.style.willChange = "auto";
                  }
                }),
              delay: 0.5,
            }
          );
        },
      },
    });
    // WORKSセクションの背景を変更するアニメーション
    gsap.to(".works", {
      scrollTrigger: {
        trigger: ".works",
        // start: "top 40%",
        start: "top 20%",
        onEnter: () => {
          const worksBg = document.querySelector(
            ".worksBackground"
          ) as HTMLElement;
          if (worksBg) {
            worksBg.style.willChange = "opacity";
            gsap.to(".worksBackground", { opacity: 1, duration: 0.5 });

            gsap.to(
              {},
              {
                duration: 0.1,
                onComplete: () => {
                  if (!isSafari()) {
                    worksBg.style.willChange = "auto";
                  }
                },
                delay: 0.5,
              }
            );
          }
        },
      },
    });
    // staggerを使用するアニメーショングループを生成する関数
    // staggerを使用するには、ひとつのfromToにまとめる必要があるため別途で作成する。
    function staggeredFadeUpAnim(
      selector: Selector,
      options: AnimationOptions
    ) {
      const elements = gsap.utils.toArray(selector) as HTMLElement[];
      elements.forEach((element) => {
        element.style.willChange = "opacity, transform";
        const modifiedOptions = {
          ...options,
          onStart: () => (element.style.willChange = "opacity, transform"),
          onComplete: () => {
            if (!isSafari()) {
              // Safari の場合は willChange を自動に設定しない
              element.style.willChange = "auto";
            }
          },
        };
        // スマホ時にサービスリストが縦並びになったらstaggerを解除する
        if (window.innerWidth <= 640) {
          gsap.fromTo(element, modifiedOptions.from, {
            ...modifiedOptions.to,
            scrollTrigger: {
              trigger: element,
              start: options.start || "top 70%",
              end: options.end || "bottom 30%",
            },
          });
        } else {
          gsap.fromTo(elements, modifiedOptions.from, {
            ...modifiedOptions.to,
            stagger: options.stagger,
            scrollTrigger: {
              trigger: elements[0],
              start: options.start || "top 70%",
              end: options.end || "bottom 30%",
            },
          });
        }
      });
    }
    // スキルを時間差で表示させる
    const fadeUpAnimOptions = {
      from: { opacity: 0, y: 60 },
      to: { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" },
      stagger: 0.1,
    };
    staggeredFadeUpAnim(".js-staggeredFadeUpAnim", fadeUpAnimOptions);
  }, []);

  return (
    <>
      <main>
        <Hero />
        <aside className="l-services">
          <div className="services">
            <div className="container">
              <div className="flexWrap js-textAnim js-fast">
                <div className="services__title">
                  <h2 className="c-title--aside js-titleAnim js-fast">
                    <span className="en">MY SERVICES</span>
                    <br />
                    <span className="ja">お仕事、承ります</span>
                  </h2>
                </div>
                <ul className="services__list">
                  <li className="services__list-item js-textAnim js-fast">
                    <a
                      href="https://svc.goubarayoshiyuki.com/"
                      className="services__list-link"
                      target="_blank"
                      rel="noopener"
                    >
                      <span className="services__list-number">
                        <span>01</span>
                      </span>
                      <h3 className="services__list-title">
                        <span className="en">WEBSITE CREATION</span>
                        <div className="wrap">
                          <span className="ja">WEBサイト制作</span>
                        </div>
                      </h3>
                      <span className="services__list-icon">
                        <span>
                          <img src="/img/arrow.svg?111" />
                        </span>
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </aside>
        <section className="introduction bg-gray">
          <div className="container container--s">
            <p className="introduction__heading js-textAnim">
              はじめまして 郷原 芳幸です。
            </p>
            <p className="introduction__text js-textAnim">
              Web制作に特化したフリーランスのデザイナー兼ディレクターです。Web制作会社でディレクション、デザイン、コーディングを経験いたしました。
            </p>
            <p className="introduction__text js-textAnim">
              全工程を一貫して担当し、納品する経験を通じて、お客様との深い関わりとその成果物に対する充実感を感じることができました。この体験がフリーランスとして独立するきっかけとなり、現在はお客様との距離をより近くし、パーソナライズされたサービスを提供しています。
            </p>
            <p className="introduction__text js-textAnim">
              プライベートではアプリ開発に取り組んでおり、新しい技術やトレンドにも常にアンテナを張り、お客様に最適なソリューションを提案できる体制を整えています。
            </p>
            <p className="introduction__text js-textAnim">
              お客様が抱える課題に対して最善の解決策を見つけ出すために、ヒアリングを大切にし、真摯にかつ柔軟に対応いたします。Webサイトに関することはお気軽にご相談ください。
            </p>
          </div>
        </section>
        <section className="skills">
          <div className="textAnim">
            {Array.from({ length: 2 }, (_, ulIndex) => (
              <ul key={ulIndex}>
                {skillsTextAnim.map((item, liIndex) => (
                  <li key={`${ulIndex}-${liIndex}`}>{item}</li>
                ))}
              </ul>
            ))}
          </div>
          <div className="container">
            <h2 className="c-title c-title--alt js-titleAnim">
              <span>SKILLS</span>
            </h2>
            <p className="c-heading c-heading--alt js-textAnim">
              取材からデザイン、コーディングまで
              <span className="ib">全工程を担当いたします。</span>
              <br />
              それぞれのステージで得られた洞察が
              <span className="ib">他のステージに活かされ、</span>
              <br />
              最終的な成果物のクオリティを高めます。
            </p>
            <ul className="skills__list">
              {skillsData.map((skill, index) => (
                <li
                  className="skills__list-item js-staggeredFadeUpAnim"
                  key={index}
                >
                  <h3 className="c-title--accent">- {skill.title} -</h3>
                  <div className="skills__list-icon">
                    <img src={skill.iconSrc} alt={skill.iconAlt} />
                  </div>
                  <p className="c-text c-text--alt">{skill.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="works">
          <WorksBackground />
          <div className="container">
            <h2 className="c-title c-title--alt js-titleAnim">
              <span>WORKS</span>
            </h2>
            <p className="c-heading c-heading--alt js-textAnim">
              フリーランス制作実績
            </p>
            <div className="js-textAnim" style={{ position: "relative" }}>
              <Slider />
            </div>
            <div className="l-button js-textAnim js-fast">
              <a className="c-button c-button--l">
                <span className="c-button__text">
                  <span>VIEW ALL</span>
                  <span>COMING SOON</span>
                  {/* <span>VIEW ALL</span> */}
                </span>
              </a>
            </div>
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
        <section className="history bg-gray">
          <div className="container container--s">
            <h2 className="c-title js-titleAnim">
              <span>HISTORY</span>
            </h2>
            <div className="history__list">
              <dl className="history__list-dl js-textAnim">
                <dt className="history__list-dt">2020/10</dt>
                <dd className="history__list-dd">
                  <p className="c-paragraph">
                    <span className="heading">
                      株式会社クラウドシードに正社員として入社
                    </span>
                    ディレクション、サイト設計、デザイン、コーディングを担当
                  </p>
                  <p className="c-paragraph">
                    <span className="heading">【デザイン実績】</span>
                    <span className="indent">
                      □
                      市の成人式典令和4年度サイトデザインとロゴがコンペで選出される
                      <br />
                      全ページのデザインとコーディングを担当
                    </span>
                  </p>
                  <p className="c-paragraph">
                    <span className="heading">
                      【取材〜制作まで一人で担当して納品した実績】
                    </span>
                    <span className="indent">
                      □ 某水産物養殖会社の新規コーポレイトサイト
                    </span>
                    <span className="indent">
                      □ 大阪で人気パン屋さんのコーポレイトサイトリニューアル
                    </span>
                    <span className="indent">
                      □
                      自社斎場8会館保有する葬儀会社のコーポレイトサイトリニューアル
                    </span>
                    <span className="indent">
                      □ 創業20年の建設会社の新規コーポレイトサイト
                    </span>
                    <span className="indent">
                      □
                      創業40年の防水材・塗料メーカーのコーポレイトサイトリニューアル
                    </span>
                  </p>
                  <p className="c-paragraph">2021年10月に退職</p>
                </dd>
              </dl>
              <dl className="history__list-dl js-textAnim">
                <dt className="history__list-dt">2021/11</dt>
                <dd className="history__list-dd">
                  <p className="c-paragraph">
                    <span className="heading">
                      DISM株式会社に正社員として入社
                    </span>
                    デザイン、コーディング業務を担当
                  </p>
                  <p className="c-paragraph">
                    <span className="heading">【実績】</span>
                    <span className="indent">
                      □自社サイト全面リニューアルのデザインとコーディングを１人で担当
                    </span>
                    <span className="indent">□ 大手企業のサイト制作を担当</span>
                  </p>
                  <p className="c-paragraph">2023年3月に退職</p>
                </dd>
              </dl>
            </div>
            <div className="js-textAnim history__link">
              <p className="history__link-heading">
                <span>会社での制作実績はこちら</span>
              </p>
              <div className="l-button">
                <a
                  href="https://private.goubarayoshiyuki.com/"
                  target="_blank"
                  rel="noopener"
                  className="c-button c-button--l c-button--alt"
                >
                  <span className="c-button__text">
                    <span>COMPANY WORKS</span>
                    <span>COMPANY WORKS</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
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
              <div className="profile__info-image js-textAnim">
                <Image
                  src="/img/image.webp?999"
                  width={176}
                  height={223.52}
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
