import fida from "../../assets/fida.svg";
import Urls from "../../settings/urls";

const ITEMS = [
  { name: "Twitter", url: Urls.twitter },
  { name: "Website", url: Urls.website },
  { name: "Github", url: Urls.github },
  { name: "Old version", url: Urls.oldDex },
  { name: "Jupiter", url: Urls.jupiter },
];

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
        <div className="grid gap-4 font-bold grid-col sm:grid-flow-col">
          {ITEMS.map((e, idx) => (
            <a
              key={`footer-${idx}`}
              rel="noopener noreferrer"
              target="_blank"
              href={e.url}
            >
              {e.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
