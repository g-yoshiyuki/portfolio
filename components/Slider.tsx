import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, EffectCoverflow } from "swiper";
import "swiper/css/pagination";
import { worksArchive } from "../constants/constants";
import Link from "next/link";


const Slider = () => {
  return (
    <>
      <Swiper
        modules={[Pagination, Navigation, EffectCoverflow]}
        navigation
        pagination={{
          clickable: true,
          // 以下を記述するとjsx内の好きな場所にページネーションを配置することができる。
          // デフォルトでは.swiperの中に生成されるので、overflow:hidden;が指定されているためスライダーの外にだすことができない。
          el: ".custom-pagination",
        }}
        effect={"coverflow"}
        coverflowEffect={{
          rotate: -15, // 画像を回転させる角度（0度なので回転なし）
          stretch: 0, // depthが0という条件下のもと、スライドをスワイプした時にスライド間の余白がstretchの値分伸縮する
          depth: 140, // スライドの深さ。z軸に対してスライドがどのくらい遠くに配置されるかを制御します。
          modifier: 1, // 影と角度の効果を修正する
          slideShadows: true, // スライドの影を無効化
        }}
        // slidesPerView={1.3}
        slidesPerView={1.2} //画像1.5枚分を表示する
        centeredSlides={true}
        spaceBetween={10} //真ん中の画像に対して左右の余白
        loop={true}
        speed={700}
        breakpoints={{
          // 641px以上の指定。swiperはmin-widthの指定しかできない。
          641: {
            slidesPerView: 1.5,
            spaceBetween: 20
          },
        }}
      >
        {worksArchive.map((work, index) => (
          <SwiperSlide key={index}>
            <div className="works__item">
              <Link  href={`/works/${index}`} className={`works__item-link ${work.class}`}>
                <Image
                  src={work.src}
                  width={work.width}
                  height={work.height}
                  alt={work.title}
                  // sizes="100vw"
                  // style={{
                  //   width: "100%",
                  //   height: "auto",
                  // }}
                  loading="eager"
                  quality={100}
                />
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="custom-pagination"></div>
    </>
  );
};

export default Slider;
