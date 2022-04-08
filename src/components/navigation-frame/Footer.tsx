import fida from "../../assets/fida.svg";
import Urls from "../../settings/urls";

const Footer = () => {
  return (
    <footer className="p-10 footer footer-center bg-gradient-to-r from-green-400 to-blue-500 text-primary-content">
      <div>
        <img src={fida} className="w-10" />
        <p className="font-bold">
          Bonfida Foundation <br />
        </p>
      </div>
      <div>
        <div className="grid grid-flow-col gap-4 font-bold">
          <a rel="noopener noreferrer" target="_blank" href={Urls.twitter}>
            Twitter
          </a>
          <a rel="noopener noreferrer" target="_blank" href={Urls.website}>
            Website
          </a>
          <a rel="noopener noreferrer" target="_blank" href={Urls.github}>
            Github
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
