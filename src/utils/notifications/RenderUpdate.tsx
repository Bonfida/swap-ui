import Loading from "../../components/Loading";
import { ExplorerButton } from "../../components/Buttons";

export const RenderUpdate = ({
  updateText,
  signature,
}: {
  updateText: string;
  signature?: string;
}) => {
  if (signature) {
    return (
      <div className="flex flex-col">
        <span> Transaction confirmed 👌</span>
        <ExplorerButton tx={signature} />
      </div>
    );
  }
  return (
    <div className="flex flex-row items-center">
      <span className="mr-2">{updateText} </span> <Loading />
    </div>
  );
};
