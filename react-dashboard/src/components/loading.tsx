const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-black/45 backdrop-blur-sm absolute top-0 left-0 z-20 flex-col">
      <div className="grid grid-cols-3 grid-rows-3 gap-[5px] w-[120px] h-[120px]">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="mosaic-block bg-green-500 w-full h-full rounded-sm animate-bounce-scale" />
        ))}
      </div>
    </div>
  );
};

export default LoadingComponent;
