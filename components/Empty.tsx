import Image from "next/image";
import React from "react";

interface Props {
  label: string;
}

const Empty = ({ label }: Props) => {
  return (
    <div className="h-full p-20 flex flex-col items-center justify-center">
      <div className="relative h-72 w-72">
        <Image alt="empty" fill src={"/memoji0.jpg"} />
      </div>
      <p className="text-sm text-muted-foreground text-center">{label}</p>
    </div>
  );
};

export default Empty;
