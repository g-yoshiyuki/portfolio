import { contactTextAnim, footerLinksData } from "../constants/constants";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export const Footer = () => {
  const router = useRouter();
  const [key, setKey] = useState(Date.now());

  // ページ遷移した時にボタンが表示されない。レンダリングを解消するために以下のコードで出keyを設定し、再レンダリングを強制している。
  useEffect(() => {
    const handleRouteChangeComplete = () => {
      // ページ遷移が完了したときにキーを更新する
      setKey(Date.now());
    };

    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router.events]);
  return (
    <>
      <div key={key}>
        <div className="contactArea">
          <div className="textAnim">
            {Array.from({ length: 2 }, (_, ulIndex) => (
              <ul key={ulIndex}>
                {contactTextAnim.map((item, liIndex) => (
                  <li key={`${ulIndex}-${liIndex}`}>{item}</li>
                ))}
              </ul>
            ))}
          </div>
          <div className="container">
            <div className="l-button contactArea__button js-textAnim js-fast">
              <a
                href="mailto:info@goubarayoshiyuki.com"
                className="c-button c-button--l "
              >
                <span className="c-button__text">
                  <span>SEND EMAIL</span>
                  <span>SEND EMAIL</span>
                </span>
              </a>
            </div>
          </div>
        </div>
        <footer className="footer">
          <div className="container">
            <ul className="footer__list">
              {footerLinksData.map((link, index) => (
                <li className="footer__list-item" key={index}>
                  {link.isExternal ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener"
                      className="footer__list-link"
                    >
                      {link.text}
                    </a>
                  ) : (
                    <Link href={link.href} className="footer__list-link">
                      {link.text}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="footer__logo">
              <img src="/img/logo.svg" alt="" />
            </div>
          </div>
          <span className="footer__copy">&copy; goubara yoshiyuki</span>
        </footer>
      </div>
    </>
  );
};
