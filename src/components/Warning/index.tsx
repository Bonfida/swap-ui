import { useState } from "react";
import { ButtonBorderGradient } from "../Buttons";
import { Modal } from "../Modal";
import Urls from "../../settings/urls";

import { Link } from "../Link";

export const Warning = ({
  visible,
  setVisible,
}: {
  visible?: boolean;
  setVisible: (arg: boolean) => void;
}) => {
  const [checked, setChecked] = useState(false);

  const handle = () => {
    if (checked) {
      return setVisible(false);
    }
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <div className="text-sm font-bold">
        <h2 className="mb-2 text-xl font-bold text-white">Warning</h2>

        <p className="text-white">
          The Bonfida DEX is a fully decentralised digital asset exchange. No
          representation or warranty is made concerning any aspect of the
          Bonfida DEX, including its suitability, quality, availability,
          accessibility, accuracy or safety. As more fully explained in the{" "}
          <Link href={Urls.rules}>Rules</Link> (available{" "}
          <Link href={Urls.rules}>here</Link>) and the{" "}
          <Link href={Urls.risks}>Risk</Link> Statement (available{" "}
          <Link href={Urls.risks}>here</Link>), your access to and use of the
          Bonfida DEX is entirely at your own risk and could lead to substantial
          losses. You take full responsibility for your use of the Bonfida DEX,
          and acknowledge that you use it on the basis of your own enquiry,
          without solicitation or inducement by Contributors (as defined in the
          Rules).
        </p>
        <p className="mt-4 text-white">
          The Bonfida DEX is not available to residents of Belarus, the Central
          African Republic, the Democratic Republic of Congo, the Democratic
          People’s Republic of Korea, the Crimea region of Ukraine, Cuba, Iran,
          Libya, Somalia, Sudan, South Sudan, Syria, the USA, Yemen, and
          Zimbabwe or any other jurisdiction in which accessing or using the
          Bonfida DEX is prohibited (“Prohibited Jurisdictions”). In using the
          Bonfida DEX, you confirm that you are not located in, incorporated or
          otherwise established in, or a citizen or resident of, a Prohibited
          Jurisdiction.
        </p>
        <p className="mt-4 text-white">
          If you intend to enter into any transactions involving derivatives,
          you also confirm that you are not located in, incorporated or
          otherwise established in, or a citizen or resident of, a Derivatives
          Restricted Jurisdiction (as defined in the Rules).
        </p>

        <div className="flex flex-row items-center mt-5">
          <input
            onChange={() => setChecked((prev) => !prev)}
            type="checkbox"
            checked={checked}
            className="mr-5 checkbox checkbox-accent"
          />
          <span className="w-[90%] font-bold">
            I confirm that I have read, understand and accept the{" "}
            <Link href={Urls.rules}>Rules</Link> and the{" "}
            <Link href={Urls.risks}>Risk Statement</Link>.
          </span>
        </div>

        <div>
          <ButtonBorderGradient
            disabled={!checked}
            onClick={handle}
            containerClass="my-2"
            buttonClass="bg-black w-full p-2 uppercase font-bold h-[50px]"
            fromColor="green-400"
            toColor="blue-500"
          >
            Enter
          </ButtonBorderGradient>
          <button
            onClick={() => window.open(Urls.google, "_self")}
            className="bg-black w-full uppercase font-bold h-[50px] rounded-[10px] p-[2px]"
          >
            Leave
          </button>
        </div>
      </div>
    </Modal>
  );
};
