import Image from "next/image";
import React from "react";

const Loader = () => {
  return (
    <div className="h-full flex flex-col  items-center justify-center gap-y-4">
      <div className="h-10 w-10 relative animate-spin">
        <Image alt="loader" fill src={"/logo.png"} />
      </div>
      <p className="text-md text-muted-foreground">AiExpress is thinking...</p>
    </div>
  );
};

export default Loader;
