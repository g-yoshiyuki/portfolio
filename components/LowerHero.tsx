type LowerHeroProps = {
  pageTitle: string;
  subPageTitle: string;
};

const LowerHero: React.FC<LowerHeroProps> = ({ pageTitle,subPageTitle }) => {

  return (
    <div className="c-lower-hero">
      <div className="container c-lower-heroInner">
        <h1 className="c-lower-pageTitle">{pageTitle}</h1>
        <p className="c-lower-subPageTitle">{subPageTitle}</p>
      </div>
    </div>
  );
};

export default LowerHero;
