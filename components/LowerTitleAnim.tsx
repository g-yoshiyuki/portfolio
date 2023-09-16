// import { worksTitleAnim } from "../constants/constants";

type LowerTitleAnimProps = {
  lowerPageTitle: string[];
};

const LowerTitleAnim: React.FC<LowerTitleAnimProps> = ({ lowerPageTitle }) => {
  return (
    <div className="textAnim textAnim--lower">
      {Array.from({ length: 2 }, (_, ulIndex) => (
        <ul key={ulIndex}>
          {lowerPageTitle.map((item, liIndex) => (
            <li key={`${ulIndex}-${liIndex}`}>{item}</li>
          ))}
        </ul>
      ))}
    </div>
  );
};

export default LowerTitleAnim;
