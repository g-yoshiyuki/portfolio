import { NextPage } from "next";
import React, { useLayoutEffect } from "react";
import LowerHero from "../../components/LowerHero";
import { useAnimationContext } from "../../contexts/AnimationContext";
import LowerTitleAnim from "../../components/LowerTitleAnim";
import { worksArchive, worksTitleAnim } from "../../constants/constants";
import Image from "next/image";
import Link from "next/link";

const WorksArchivePage: NextPage = () => {
  const { setAnimationFinished } = useAnimationContext();
  useLayoutEffect(() => {
    // 下層に直接アクセスした時にheaderを降ろす。
    setAnimationFinished(true);
  }, [setAnimationFinished]);
  return (
    <main className="l-lower">
      <LowerTitleAnim lowerPageTitle={worksTitleAnim} />
      <LowerHero pageTitle="WORKS" subPageTitle="フリーランス制作実績一覧" />
      <section className="worksArchive section--lower">
        <div className="container">
          {/* <h2 className="c-lower-title">ALL WORKS</h2> */}
          <ul className="worksArchive__list">
            {worksArchive.map((works, index) => (
              <li className="worksArchive__list-item" key={index}>
                <Link href={`/works/${index}`} className="hoverFilm--card">
                  <figure className="worksArchive__list-image hoverFilm">
                    <Image
                      src={works.src}
                      alt={works.title}
                      width={works.width}
                      height={works.height}
                      sizes="100vw"
                      quality={100}
                    />
                  </figure>
                  <h2 className="worksArchive__list-title">{works.title}</h2>
                  {/* <p className="worksArchive__list-text">{works.text}</p> */}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default WorksArchivePage;
