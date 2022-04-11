export const Congested = ({ congested }: { congested: boolean }) => {
  if (!congested) {
    return null;
  }

  return (
    <div className="mb-2 font-bold text-center text-white bg-gradient-to-r from-green-400 to-blue-500 animate-gradient-x">
      Solana is congested, your transaction might fail to send or confirm
    </div>
  );
};
