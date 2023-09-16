import { useRouter } from "next/router";
import { workDetailTitleAnim, worksArchive } from "../../constants/constants";
import { useAnimationContext } from "../../contexts/AnimationContext";
import { useEffect } from "react";
import LowerTitleAnim from "../../components/LowerTitleAnim";
import LowerHero from "../../components/LowerHero";
import Link from "next/link";
import { worksSEO } from "../../constants/next-seo.config";
import { NextSeo } from "next-seo";
import { GetStaticPaths, GetStaticProps } from "next";

interface Work {
  id: number;
  src: string;
  srcSp: string;
  title: string;
  width: number;
  height: number;
  href: string;
  text: string;
}

// getStaticPaths関数を追加
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = worksArchive.map((work, index) => ({
    params: { id: index.toString() },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<{ work: Work }> = async ({
  params,
}) => {
  const id = params?.id;
  const work = worksArchive[Number(id)];
  if (!work) {
    return { notFound: true };
  }
  return { props: { work: { id: Number(id), ...work } } }; // id プロパティを追加
};

const WorkDetailPage: React.FC<{ work: Work }> = ({ work }) => {
  const router = useRouter();
  // const { id } = router.query;

  const { setAnimationFinished } = useAnimationContext();
  useEffect(() => {
    // 下層に直接アクセスした時にheaderを降ろす。
    setAnimationFinished(true);
  }, [setAnimationFinished]);

  // フォールバック処理を追加
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  if (!work) {
    return <div className="notFound">This work does not exist.</div>;
  }

  const dynamicSEO = {
    ...worksSEO,
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}works/${work.id}`,
  };

  return (
    <>
      <NextSeo {...dynamicSEO} />
      <main className="l-lower">
        <LowerTitleAnim lowerPageTitle={workDetailTitleAnim} />
        <LowerHero pageTitle="WORKS" subPageTitle="フリーランス制作実績詳細" />
        <section className="workDetail section--lower">
          <div className="container">
            <figure className="workDetail__figure">
              {/* <Image
                src={work.src}
                alt={work.title}
                width={work.width}
                height={work.height}
                sizes="100vw"
                quality={100}
              /> */}
              <picture>
                <source
                  media="(max-width: 640px)"
                  srcSet={work.srcSp}
                />
                <img
                  src={work.src}
                  width={work.width}
                  height={work.height}
                  alt={work.title}
                />
              </picture>
            </figure>
            <h2 className="workDetail__title">{work.title}</h2>
            <a
              href={work.href}
              className="workDetail__link"
              target="_brank"
              rel="noopener"
            >
              {work.href}
            </a>
            <p className="workDetail__text c-text">{work.text}</p>
            <div className="l-button mt50">
              <Link
                href="/works/"
                className="c-button c-button--l c-button--alt"
              >
                <span className="c-button__text">
                  <span>GO BACK</span>
                  <span>GO BACK</span>
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default WorkDetailPage;
