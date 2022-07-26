const ProcessingTransaction = () => {
  return (
    <div className="fixed bg-[rgba(115,115,115,0.2)] z-50 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
      <div className="bg-primary w-full flex flex-col items-center max-w-[400px] p-4 rounded-lg">
        <h1 className="text-xl font-bold w-3/4 text-center mb-6 text-white font-nunito">
          Processing transaction please wait....
        </h1>
        <div className="loader" />
      </div>
    </div>
  );
};

export default ProcessingTransaction;
