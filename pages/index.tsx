import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Home: NextPage = () => {
  const parallaxImageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
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
  }, []);

  return (
    <>
      {/* <header className="header">
        <div className="container container--l">
          <div className="header__logo">Goubara Yoshiyuki</div>
          <nav className="header__nav">
            <ul className="header__nav-list">
              <li className="header__nav-item">
                <a
                  href="https://goubarayoshiyuki.com/"
                  target="_blank"
                  rel="noopener"
                  className="c-button"
                >
                  WORKS
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header> */}
      <main>
        <div className="hero">
          <div className="container">
            <div className="hero__content">
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
            <div className="hero__image">
              <img src="/img/hero.webp" alt="" />
            </div>
          </div>
        </div>
        <section className="introduction bg-gray">
          <div className="container container--s">
            <p className="introduction__heading">こんにちは 郷原 芳幸です。</p>
            <p className="introduction__text">
              Web制作に特化したフリーランスのデザイナー兼ディレクターです。Web制作会社でデザイン、構築、ディレクションを経験いたしました。
            </p>
            <p className="introduction__text">
              お客様との距離をより近くし、パーソナライズされたサービスをワンストップで提供することを目指し、現在はフリーランスとして活動しています。
              <br />
              プライベートではアプリ開発に取り組んでおり、新しい技術やトレンドにも常にアンテナを張り、お客様に最適なソリューションを提案できるように努めています。
            </p>
            <p className="introduction__text">
              お客様が抱える課題に対して最善の解決策を見つけ出すために、ヒアリングを大切にし、真摯にかつ柔軟に対応いたします。Webサイトに関することはお気軽にご相談ください。
            </p>
          </div>
        </section>
        <section className="services">
          <div className="textAnim">
            <ul>
              <li>FEATURED SERVICES</li>
              <li>FEATURED SERVICES</li>
            </ul>
            <ul>
              <li>FEATURED SERVICES</li>
              <li>FEATURED SERVICES</li>
            </ul>
          </div>
          <div className="container">
            <h2 className="c-title c-title--alt">SERVICES</h2>
            <ul className="services__list">
              <li className="services__list-item">
                <h3 className="c-title--accent">- CODING -</h3>
                <div className="services__list-icon">
                  <img src="/img/coding.svg" alt="CODING" />
                </div>
                <p className="c-text c-text--alt">
                  最新の技術を駆使し、表示速度・SEOに考慮したWebサイトを構築します。ECサイトを含む様々なWebプロジェクトに対応します。アプリ制作に関してもご相談ください。
                </p>
              </li>
              <li className="services__list-item">
                <h3 className="c-title--accent">- DESIGN -</h3>
                <div className="services__list-icon">
                  <img src="/img/design.svg" alt="DESIGN" />
                </div>
                <p className="c-text c-text--alt">
                  お客様の目的に沿ったデザインで、印象的なビジュアルを創り出します。ユーザーがわかりやすいサービスを目指し、WebサイトやアプリのUI設計を行います。
                </p>
              </li>
              <li className="services__list-item">
                <h3 className="c-title--accent">- DIRECTION -</h3>
                <div className="services__list-icon">
                  <img src="/img/direction.svg" alt="DIRECTION" />
                </div>
                <p className="c-text c-text--alt">
                  お客様のプロジェクトに深く関わり、適切な取材やリサーチをもとにサイト設計を行います。丁寧なヒアリングと分かりやすい言葉での説明を大切にしています。
                </p>
              </li>
            </ul>
          </div>
        </section>

        <div className="l-image">
          <img
            src="/img/works-bg.webp"
            alt=""
            ref={parallaxImageRef}
            className="js-parallax"
            data-y="-12vw"
          />
        </div>

        <section className="history bg-gray">
          <div className="container container--s">
            <h2 className="c-title">HISTORY</h2>
            <div className="history__list">
              <dl className="history__list-dl">
                <dt className="history__list-dt">2020/10</dt>
                <dd className="history__list-dd">
                  <p className="c-paragraph">
                    株式会社クラウドシードに正社員として入社
                    <br />
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
              <dl className="history__list-dl">
                <dt className="history__list-dt">2021/11</dt>
                <dd className="history__list-dd">
                  <p className="c-paragraph">
                    DISM株式会社に正社員として入社
                    <br />
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
          </div>
        </section>
        <div className="works">
          <div className="textAnim textAnim--accent">
            <ul>
              <li>WEB DESIGN - WEB DIRECTION - CODING - APPLICATION -</li>
              <li>WEB DESIGN - WEB DIRECTION - CODING - APPLICATION -</li>
              <li>WEB DESIGN - WEB DIRECTION - CODING - APPLICATION -</li>
              <li>WEB DESIGN - WEB DIRECTION - CODING - APPLICATION -</li>
            </ul>
            <ul>
              <li>WEB DESIGN - WEB DIRECTION - CODING - APPLICATION -</li>
              <li>WEB DESIGN - WEB DIRECTION - CODING - APPLICATION -</li>
              <li>WEB DESIGN - WEB DIRECTION - CODING - APPLICATION -</li>
              <li>WEB DESIGN - WEB DIRECTION - CODING - APPLICATION -</li>
            </ul>
          </div>
          <div className="container">
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
        <section className="profile">
          <div className="container container--s">
            <h2 className="c-title c-title--alt">PROFILE</h2>
            <div className="profile__info">
              <div className="profile__info-content">
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
              <div className="profile__info-image">
                <img src="/img/image.webp" alt="" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <span className="copy">©goubara yoshiyuki</span>
      </footer>
    </>
  );
};

export default Home;