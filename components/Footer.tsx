import { contactTextAnim } from "../constants/constants";

export const Footer = () => {
  return (
    <>
      <div>
        {/* <footer className="footer">
          <span className="copy">©goubara yoshiyuki</span>
        </footer> */}
        <footer className="footer">
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
            <div className="l-button footer__button js-textAnim js-fast">
              <a
                href="mailto:yoshiyukigoubara@gmail.com"
                className="c-button c-button--l "
              >
                <span className="c-button__text">
                  <span>SEND EMAIL</span>
                  <span>SEND EMAIL</span>
                </span>
              </a>
            </div>
            <span className="footer__copy">&copy; goubara yoshiyuki</span>
          </div>
        </footer>
      </div>
    </>
  );
};
